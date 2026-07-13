import csv

db = {}
a=0

with open("/home/vikky/Desktop/song_app/dbs/filtered_output.csv", "r") as file:
    reader = csv.DictReader(file)

    for row in reader:
        db[row["track_id"]] = row
        a= a+1
        if a == 100:
           break;
print(db)
