import csv
import hashlib
import io
from django.shortcuts import render
from psycopg2.extras import execute_values
import pandas as pd
import psycopg2 
from rest_framework.response import Response
from django.http import JsonResponse
from psycopg2.errors import UniqueViolation



class CSV_handler_class():
    def __init__(self, text_from_view, username, email, password, dob, about_you, playlist_name, hash_id):
        self.required = [
            "Track Name",
            "Album Name",
            "Artist Name(s)",
            "Release Date",
            "Duration (ms)",
            "Popularity",
            "Explicit",
            "Added By",
            "Added At",
            "Genres",
            "Record Label",
            "Danceability",
            "Energy",
            "Key",
            "Loudness",
            "Mode",
            "Speechiness",
            "Acousticness",
            "Instrumentalness",
            "Liveness",
            "Valence",
            "Tempo",
            "Time Signature",
        ]
        self.text_from_view = text_from_view

        self.conn = psycopg2.connect(
            host="localhost",
            database="song_app",
            user="it_me_owner",
            password="error^3"
        )

        self.username = username
        self.email = email
        self.password = password
        self.dob = dob
        self.about_you = about_you
        self.playlist_name = playlist_name
        self.hash_id = hash_id

        self.cursor = self.conn.cursor()

    def create_user_acc(self):
        query = """
            INSERT INTO users_table (
                hash_id,
                username,
                email,
                password,
                dob,
                about_you
            )
            VALUES (%s, %s, %s, %s, %s, %s);
            """
        combined_string = "".join([self.username, self.password])
        hash_id = hashlib.sha256(combined_string.encode("utf-8")).hexdigest()


        try:
            self.cursor.execute(
                query,
                (
                    hash_id,
                    self.username,
                    self.email,
                    self.password,
                    self.dob,
                    self.about_you,
                ),
            )
            self.conn.commit()
            print(hash_id,
                    self.username,
                    self.email,
                    self.password,
                    self.dob,
                    self.about_you)

        except UniqueViolation:
            print("maan you have already accunt")
            return JsonResponse({
                "status": 400,
                "error": "account already exist"
            })
    
        return True


    def csv_handler(self):
        
        reader = csv.reader(self.text_from_view)

        header = next(reader)

        missing = set(self.required) - set(header[1:])

        if missing:
            return Response(
                {"error": f"Missing columns: {missing}"},
                status=400,
            )

        data = []
        query = """INSERT INTO user_song_list (
            track_hash,
            track_name,
            album_name,
            artist_names,
            release_date,
            duration_ms,
            popularity,
            explicit,
            added_by,
            added_at,
            genres,
            record_label,
            danceability,
            energy,
            track_key,
            loudness,
            mode,
            speechiness,
            acousticness,
            instrumentalness,
            liveness,
            valence,
            tempo,
            time_signature
        )
        VALUES %s"""

        try:
            release_data = f"{int(row[header.index('Release Date')])}-01-01"
        except:
            release_data = f'{1800}-01-01'

        
        playlist_hash = self.playlist_creater()

        for row in reader:
            combined = "".join([
                row[header.index("Track Name")],
                row[header.index("Album Name")],
                row[header.index("Artist Name(s)")],
                release_data,
                row[header.index("Duration (ms)")],
                row[header.index("Record Label")],
            ])

            # create hash
            hash_value = hashlib.sha256(
                combined.encode("utf-8")
            ).hexdigest()
            query_for_link = f"INSERT INTO playlist_tracks (playlist_id, song_id) VALUES ('{playlist_hash}', '{hash_value}')"
            self.cursor.execute(query_for_link)

            data.append((
                hash_value,
                row[header.index("Track Name")],
                row[header.index("Album Name")],
                row[header.index("Artist Name(s)")],
                release_data,
                row[header.index("Duration (ms)")],
                row[header.index("Popularity")],
                row[header.index("Explicit")],
                row[header.index("Added By")],
                row[header.index("Added At")],
                row[header.index("Genres")],
                row[header.index("Record Label")],
                row[header.index("Danceability")],
                row[header.index("Energy")],
                row[header.index("Key")],
                row[header.index("Loudness")],
                row[header.index("Mode")],
                row[header.index("Speechiness")],
                row[header.index("Acousticness")],
                row[header.index("Instrumentalness")],
                row[header.index("Liveness")],
                row[header.index("Valence")],
                row[header.index("Tempo")],
                row[header.index("Time Signature")],
            ))
            try:
                execute_values(self.cursor, query, data)
                data=[]
            except UniqueViolation:
                update_query = """
                    UPDATE user_song_list
                    SET
                        track_name = %s,
                        album_name = %s,
                        artist_names = %s,
                        release_date = %s,
                        duration_ms = %s,
                        popularity = %s,
                        explicit = %s,
                        added_by = %s,
                        added_at = %s,
                        genres = %s,
                        record_label = %s,
                        danceability = %s,
                        energy = %s,
                        track_key = %s,
                        loudness = %s,
                        mode = %s,
                        speechiness = %s,
                        acousticness = %s,
                        instrumentalness = %s,
                        liveness = %s,
                        valence = %s,
                        tempo = %s,
                        time_signature = %s
                    WHERE track_hash = %s;
                    """
                
                update_value = [
                    row[header.index("Track Name")],
                    row[header.index("Album Name")],
                    row[header.index("Artist Name(s)")],
                    release_data,
                    row[header.index("Duration (ms)")],
                    row[header.index("Popularity")],
                    row[header.index("Explicit")],
                    row[header.index("Added By")],
                    row[header.index("Added At")],
                    row[header.index("Genres")],
                    row[header.index("Record Label")],
                    row[header.index("Danceability")],
                    row[header.index("Energy")],
                    row[header.index("Key")],
                    row[header.index("Loudness")],
                    row[header.index("Mode")],
                    row[header.index("Speechiness")],
                    row[header.index("Acousticness")],
                    row[header.index("Instrumentalness")],
                    row[header.index("Liveness")],
                    row[header.index("Valence")],
                    row[header.index("Tempo")],
                    row[header.index("Time Signature")],
                    hash_value,
                ]
                self.conn.rollback()
                self.cursor.execute(update_query, update_value)
                data=[]
            
        self.conn.commit()

        if (not ((self.username or self.email or self.password) == '')):
            is_acc_done = self.create_user_acc()
        
        if is_acc_done:

            return JsonResponse({
                "status": "success",
                "message": "CSV uploaded successfully, and account also"
            })
        if (((self.username or self.email or self.password) == '')):
            return JsonResponse({
                "status": "success",
                "message": "will belive everything is fine"
            })
        
    
    def playlist_creater(self):
        if(self.username == '' or self.password == ''):
            combined_text = "".join([self.hash_id, self.playlist_name])
            user_hash = self.hash_id
        else:
            combined_string = "".join([self.username, self.password])
            user_hash = hashlib.sha256(combined_string.encode("utf-8")).hexdigest()
            combined_text = "".join([user_hash,self.playlist_name])


        playlist_query = "INSERT INTO user_playlists (id_hash, user_hash, playlist_name) VALUES (%s, %s, %s)"
        
        hash_value = hashlib.sha256(
            combined_text.encode("utf-8")
        ).hexdigest()

        value_playlist = [hash_value, user_hash, self.playlist_name]
        
        self.cursor.execute(playlist_query, value_playlist)
        self.conn.commit()

        return hash_value
    