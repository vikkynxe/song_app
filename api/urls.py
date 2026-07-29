from django.urls import path
from .views import download_song, get_song, stream_audio, recommendation, create_users, csrf, function_for_sign_in, get_song_from_playlist

urlpatterns = [
    path("csrf/", csrf),
    path("download/", download_song),
    path("songs/", get_song),
    path("audio/<str:filename>", stream_audio),
    path("create_users/", create_users),
    path("sign_in/",function_for_sign_in),
    path("get_song_from_playlist/", get_song_from_playlist),
    path("hash_getter/", hash_getter)
]
