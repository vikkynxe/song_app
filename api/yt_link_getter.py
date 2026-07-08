import yt_dlp

song = input('song name please:')

def ytlink_getter(song):
    with yt_dlp.YoutubeDL({
        "quiet": True,
        "extract_flat": True,
    }) as ydl:
        result = ydl.extract_info(
            f"ytsearch1:{song}",
            download=False
        )

    video = result["entries"][0]

    return video["id"]
    
video = ytlink_getter(song + " Audio")
print(f"https://www.youtube.com/watch?v={video}")

