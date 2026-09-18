import yt_dlp


def search_youtube(query):
    options = {
        "quiet": True,
        "extract_flat": True,
    }

    with yt_dlp.YoutubeDL(options) as ydl:
        result = ydl.extract_info(
            f"ytsearch1:{query}",
            download=False
        )

    video = result["entries"][0]
    

    print(video["title"])
    print(video["url"])


search_youtube("python tutorial")

