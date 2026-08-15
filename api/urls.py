from django.urls import path
from .views import download_song, get_song, stream_audio, recommendation, create_users, csrf, function_for_sign_in, get_data_for_user, hash_getter

urlpatterns = [
    path("csrf/", csrf),
    path("download/", download_song),
    path("songs/<str:hash_token>", get_song),
    path("audio/<str:filename>", stream_audio),
    path("create_users/", create_users),
    path("sign_in/",function_for_sign_in),
    path("get_data_for_user/", get_data_for_user),
    path("hash_getter/", hash_getter)
]
