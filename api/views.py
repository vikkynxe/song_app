import os
import uuid
from django.http import FileResponse, JsonResponse, StreamingHttpResponse, HttpResponse
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
import yt_dlp
import re
from . import recommendation, sha_256_hashing
import numpy as np
from django.views.decorators.csrf import ensure_csrf_cookie
import psycopg


@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"message": "CSRF cookie set"})

DOWNLOAD_FOLDER = "downloads"

os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)

def clean_value(v):
    if isinstance(v, (np.int64, np.int32)):
        return int(v)
    if isinstance(v, (np.float64, np.float32)):
        return float(v)
    return v

@api_view(["POST"])
def download_song(request):
    url = request.data.get("url")

    if not url:
        return Response({"error": "URL is required"}, status=400)

    file_id = str(uuid.uuid4())
    output_path = f"{DOWNLOAD_FOLDER}/{file_id}"

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

        return Response({
            "message": "Download complete",
            "file_id": file_id
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)
        

def get_song(request):
    a = recommendation.recommend_songs("sodakku", num_recommendations=5)
    print(a)
    raw = a
    cleaned = [
        {
            "title": item["Song"],
            "artist": item["Artist"],
            "year": clean_value(item["Year"]),
            "album": item["Album"],
            "match_score": clean_value(item["Match Score"]),
            # add URL if you have it
            "url": f"http://localhost:8000/media/{item['Song']}.mp3"
        }
        for item in raw
    ]
    return JsonResponse({"songs": cleaned})

def stream_audio(request, filename):
    path = os.path.join("dbs/music", filename)
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


def create_users(request):
    if request.method == "POST":
        user_id = request.POST.get("userId")
        password = request.POST.get("password")
        uploaded_file = request.FILES.get("file")

        print(user_id)
        print(password)
        print(uploaded_file)
        print(uploaded_file.name)
        print(uploaded_file.size)

        return JsonResponse({
            "message": "File received successfully"
        })

    return JsonResponse({"error": "Only POST allowed"}, status=405)