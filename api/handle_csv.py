import csv
import hashlib
import io
from django.shortcuts import render
from .models import Track
from  sha_256_hashing import hashing_sha_256


def csv_handler(file_csv):


    uploaded_file = request.FILES.get("file")

    text_file = io.TextIOWrapper(
        uploaded_file.file,
        encoding="utf-8"
    )

    reader = csv.reader(text_file)

    next(reader)  # skip header

    data_list = []

    for row in reader:

        # columns 2,3,4,5
        combined = "".join(row[1:5])

        # create hash
        hash_value = hashlib.sha256(
            combined.encode("utf-8")
        ).hexdigest()

        data_list.append(
            MyData(
                hash_value=hash_value,
                name=row[1],
                city=row[2],
                age=row[3],
                country=row[4]
            )
        )

        # insert many rows at once
        MyData.objects.bulk_create(
            data_list,
            batch_size=5000
        )

        text_file.detach()

        return render(request, "success.html")

    return render(request, "upload.html")
