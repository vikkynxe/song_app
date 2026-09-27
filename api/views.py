import os
import uuid
from django.http import FileResponse, JsonResponse, StreamingHttpResponse, HttpResponse
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import yt_dlp
import re
from . import recommendation
import numpy as np
from django.views.decorators.csrf import ensure_csrf_cookie
from django.db import connection
from pathlib import Path
from .handle_csv import CSV_handler_class
from .handle_user_req import handle_user_request
import io
from django.views.decorators.csrf import csrf_exempt
import json
import hashlib
import psycopg2 
from psycopg2.extras import execute_values
from psycopg2.errors import UniqueViolation
import sys
sys.path.append("/home/vikky/Desktop/song_app_credentials")
import drive
import threading
import subprocess
import queue
from .worker import normalization_queue


DOWNLOAD_FOLDER = '/home/vikky/Desktop/song_app/downloads'
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

normalization_queue = queue.Queue()


@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"message": "CSRF cookie set"})


def clean_value(v):
    if isinstance(v, (np.int64, np.int32)):
        return int(v)
    if isinstance(v, (np.float64, np.float32)):
        return float(v)
    return v

def get_recommendation_song(request):
    a = recommendation.recommend_songs("sodakku", num_recommendations=5)
    raw = a
    cleaned = [
        {
            "title": item["Song"],
            "artist": item["Artist"],
            "year": clean_value(item["Year"]),
            "album": item["Album"],
            "match_score": clean_value(item["Match Score"]),
            # add URL if you have it
            "url": f"http://localhost:8000/api/audio/{item['Song']}.mp3"
        }
        for item in raw
    ]
    return JsonResponse({"songs": cleaned})


def download_song(link_data, filename):
    url = link_data

    if not url:
        return "error: URL is required"

    output_path = f"{DOWNLOAD_FOLDER}/{filename}"

    ydl_opts = {
        "format": "bestaudio/best",
        "outtmpl": output_path,

        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "192",
        }],
    }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        mp3_file = output_path + ".mp3"

        # Put normalization into background queue
        normalization_queue.put(mp3_file)

        print("Downloaded:", mp3_file)
        print("Added to normalization queue")

        # Return immediately
        return output_path

    except Exception as e:
        print("Download error:", e)
        return f"error: {str(e)}"


def clean_text(text):
    # Replace special characters with a space
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)

    # Replace multiple spaces with a single space
    text = re.sub(r'\s+', ' ', text)

    # Remove leading/trailing spaces
    return text.strip()

def get_better_result_yt_dlp(search_query):
    options = {
        "quiet": True,
        "extract_flat": True,
        "cookiesfrombrowser": ("chrome",),
    }

    with yt_dlp.YoutubeDL(options) as ydl:
        result = ydl.extract_info(
            f"ytsearch1:{search_query}",
            download=False
        )

    print(result)

    print(type(result))

    if result["entries"] == []:
        words = search_query.split()
        search_query = " ".join(words[:5])
        with yt_dlp.YoutubeDL(options) as ydl:
            result = ydl.extract_info(
                f"ytsearch1:{search_query}",
                download=False
            )

    video = result["entries"][0]

    url = video["url"]
    return url



def stream_audio(request, fileid):
    data_list = [fileid]

    print("request recieved")
    Songs_data_details = handle_user_request().get_song_data_from_db(data_list)
    print("song detiles got", Songs_data_details)
    search_query = f"{str(Songs_data_details[0]['track_name'])} {str(Songs_data_details[0]['artist_names'])} lyrics song"
    search_query = clean_text(search_query)
    print("search details prepaed", search_query)

    #files = drive.search_files(search_query+".mp3") #remove cammend if u want drive connection
    files =[]


    if files == []:
        path = DOWNLOAD_FOLDER+'/'+search_query+'.mp3'
        if os.path.exists(path):
            print("ok no problem")
        else:
            print("getting result")
            linkdata = get_better_result_yt_dlp(search_query)
            print("link data got",linkdata)

            path = download_song(linkdata, search_query)+".mp3"
            
    else:
        path = DOWNLOAD_FOLDER+'/'+search_query+'.mp3'
        if os.path.exists(path):
            print("ok no problem")
        else:
            drive.download_file(files[0]['id'],path)

    file_size = os.path.getsize(path)

    range_header = request.META.get("HTTP_RANGE", "").strip()
    content_type = "audio/mpeg"


    if range_header:
        match = re.match(r"bytes=(\d+)-(\d*)", range_header)
        start = int(match.group(1))
        end = int(match.group(2)) if match.group(2) else file_size - 1

        length = end - start + 1

        def file_iterator(file_path, start, length, chunk_size=8192):
            with open(file_path, "rb") as f:
                f.seek(start)
                remaining = length
                while remaining > 0:
                    chunk = f.read(min(chunk_size, remaining))
                    if not chunk:
                        break
                    yield chunk
                    remaining -= len(chunk)

        response = StreamingHttpResponse(
            file_iterator(path, start, length),
            status=206,
            content_type=content_type,
        )

        response["Content-Length"] = str(length)
        response["Content-Range"] = f"bytes {start}-{end}/{file_size}"
        response["Accept-Ranges"] = "bytes"
        return response

    # fallback full file
    response = FileResponse(open(path, "rb"), content_type=content_type)
    response["Accept-Ranges"] = "bytes"
    return response

@csrf_exempt
def create_users(request):
    if request.method == "POST":
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        dob = request.POST.get("dob")
        about_you = request.POST.get("about_you")
        uploaded_csv = request.FILES.get("file")

        if not all([username, email, password, dob, about_you]):
            print("Fields are empty")
        if uploaded_csv is None:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        if(uploaded_csv.size > (30 * 1024 * 1024)):
            return JsonResponse({"error": "File too large"}, status=400)
        
        if Path(uploaded_csv.name).suffix.lower() != ".csv":
            return JsonResponse({"error": "Only CSV files allowed"}, status=400)

        try:
            text = io.TextIOWrapper(uploaded_csv.file, encoding="utf-8")
        except UnicodeDecodeError:
            print("UnicodeDecodeError")
            return JsonResponse({"error": "File must be UTF-8"}, status=400)
        except Exception:
            print("Exception")
            return JsonResponse({"error": "Invalid CSV"}, status=400)

        handle_csv_class = CSV_handler_class(
            text, 
            username, 
            email, 
            password, 
            dob, 
            about_you, 
            "liked_playlist", ''
        )
        handle_csv_class.csv_handler()

        return JsonResponse({
            "message": "File received successfully"
        })

    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt
def function_for_sign_in(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)

            user_name = data.get("user_name")
            password = data.get("password")


            combined_string = "".join([user_name, password])
            hash_id = hashlib.sha256(combined_string.encode("utf-8")).hexdigest()

            row = handle_user_request().sign_in_function(hash_id)

            if row is None:
                return JsonResponse({
                    "message": "No Account Found"
                }, status=400)
            else:
                print("Data found")

            return JsonResponse({
                "message": "Login data received",
                "token": hash_id
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({
                "message": "Invalid JSON"
            }, status=400)

    return JsonResponse({
        "message": "Only POST method is allowed"
    }, status=405)


@csrf_exempt
def get_playlists(request):
    if request.method != "POST":
        return JsonResponse({
            "message": "Only POST requests are allowed"
        }, status=405)

    hash_token = request.POST.get("hash_id")

    playlists = handle_user_request().get_user_playlist(hash_token)

    hash_list = []
    name_list = []
    no_of_song_track = []

    for item in playlists:
        playlist_hash = item[0]
        playlist_name = item[1]

        if isinstance(playlist_hash, bytes):
            playlist_hash = playlist_hash.decode("utf-8")
        
        songcount = handle_user_request().numberofsongsfun(playlist_hash)

        no_of_song_track.append(songcount if songcount != '' else 0)

        if isinstance(playlist_name, bytes):
            playlist_name = playlist_name.decode("utf-8")

        hash_list.append(playlist_hash)
        name_list.append(playlist_name)

    #     print({
    #     "message": "Data received successfully",
    #     "hash": hash_list,
    #     "name": name_list,
    #     "tracks": no_of_song_track,
    #     "data": bool(playlists)
    # })

    return JsonResponse({
        "message": "Data received successfully",
        "hash": hash_list,
        "name": name_list,
        "tracks": no_of_song_track,
        "data": bool(playlists)
    })


def get_data_for_user(request):
    if request.method == "POST":
        try:
            hash_data = request.POST.get("hash_data")
            type_of_hash = request.POST.get("type_of_hash")
            resulted_data = None
            if type_of_hash == "playlist":
                resulted_data = handle_user_request().get_user_playlist(hash_data)
            elif type_of_hash == "song":
                resulted_data = handle_user_request().get_song_data(hash_data)
            return JsonResponse({"data": resulted_data}, safe=False)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Only POST allowed"}, status=405)


def hash_getter(request):
    if request.method == "POST":
        try:
            text1 = request.POST.get("text1")
            text2 = request.POST.get("text2")
            combined_string = "".join([text1, text2])
            user_hash = hashlib.sha256(combined_string.encode("utf-8")).hexdigest()
            return user_hash
        except:
            print("nothing new ,...")
            return 0


@csrf_exempt
def create_playlist(request):
    if request.method == "POST":
        hash_id = request.POST.get("hash_id")
        playlist_name = request.POST.get("playlistname")
        uploaded_csv = request.FILES.get("file")

        if uploaded_csv is None:
            return JsonResponse({"error": "No file uploaded"}, status=400)

        if(uploaded_csv.size > (30 * 1024 * 1024)):
            return JsonResponse({"error": "File too large"}, status=400)
        
        if Path(uploaded_csv.name).suffix.lower() != ".csv":
            return JsonResponse({"error": "Only CSV files allowed"}, status=400)

        try:
            text = io.TextIOWrapper(uploaded_csv.file, encoding="utf-8")
        except UnicodeDecodeError:
            print("UnicodeDecodeError")
            return JsonResponse({"error": "File must be UTF-8"}, status=400)
        except Exception:
            print("Exception")
            return JsonResponse({"error": "Invalid CSV"}, status=400)

        username = ''
        email = ''
        password = ''
        dob = ''
        about_you = ''

        handle_csv_class = CSV_handler_class(
            text, 
            username, 
            email, 
            password, 
            dob, 
            about_you, 
            playlist_name, 
            hash_id
        )
        data = handle_csv_class.csv_handler()

        return JsonResponse({
            "message": "File received successfully"
        })
    return JsonResponse({"error": "Only POST allowed"}, status=405)


@csrf_exempt
def get_songs(request):
    if (request.method == "POST"):
        data = json.loads(request.body)
        pl_hash_id = data.get("token")

        Songs_data = handle_user_request().get_song_data(pl_hash_id)

        Songs_data_details = handle_user_request().get_song_data_from_db(Songs_data)

        # print({
        # "resut": Songs_data,
        # "data": Songs_data_details
        # })

    return JsonResponse({
        "resut": Songs_data,
        "data": Songs_data_details
    })
