import os
import subprocess
import threading
import queue

normalization_queue = queue.Queue()


def normalize_audio(input_file, output_file):
    try:
        subprocess.run([
            "ffmpeg",
            "-y",
            "-i", input_file,
            "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
            "-c:a", "libmp3lame",
            "-b:a", "192k",
            output_file
        ], check=True)

        # Replace original with normalized version
        os.replace(output_file, input_file)

        print(f"Normalized: {input_file}")

    except Exception as e:
        print(f"Normalization error: {e}")


def normalization_worker():
    while True:
        item = normalization_queue.get()

        if item is None:
            normalization_queue.task_done()
            break

        input_file = item
        output_file = input_file + ".normalized.mp3"

        try:
            normalize_audio(input_file, output_file)
        finally:
            normalization_queue.task_done()


# Start worker
normalization_thread = threading.Thread(
    target=normalization_worker,
    daemon=True
)

normalization_thread.start()
