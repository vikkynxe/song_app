from django.urls import path
from .views import download_song, get_playlists, stream_audio, recommendation, create_users, csrf, function_for_sign_in, get_data_for_user, hash_getter, create_playlist, get_songs, prepar_song_befor

urlpatterns = [
    path("csrf/", csrf),
    path("download/", download_song),
    path("get_playlists/", get_playlists),
    path("audio/<str:fileid>", stream_audio),
    path("create_users/", create_users),
    path("sign_in/",function_for_sign_in),
    path("get_data_for_user/", get_data_for_user),
    path("hash_getter/", hash_getter),
    path("create_playlist/", create_playlist),
    path("get_songs/", get_songs),
    path("prepar_song_befor/",prepar_song_befor)
]
