from django.urls import path
from .views import download_song, get_song, stream_audio, recommendation, create_users

urlpatterns = [
    path("download/", download_song),
    path("songs/", get_song),
    path("audio/<str:filename>", stream_audio),
    path("create_users", create_users),
]
