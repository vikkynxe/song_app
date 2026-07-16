from django.db import models


class Track(models.Model):
    track_hase = models.BinaryField(max_length=32)

    track_name = models.CharField(max_length=255)
    album_name = models.CharField(max_length=255)
    artist_name = models.CharField(max_length=500)

    release_year = models.PositiveIntegerField(null=True, blank=True)

    duration_ms = models.PositiveIntegerField()
    popularity = models.PositiveIntegerField(default=0)

    explicit = models.BooleanField(default=False)

    added_by = models.CharField(max_length=255)
    added_at = models.DateTimeField(null=True, blank=True)

    genres = models.TextField(blank=True)
    record_label = models.CharField(max_length=255, blank=True)

    danceability = models.FloatField(null=True, blank=True)
    energy = models.FloatField(null=True, blank=True)

    key = models.IntegerField(null=True, blank=True)
    loudness = models.FloatField(null=True, blank=True)
    mode = models.IntegerField(null=True, blank=True)

    speechiness = models.FloatField(null=True, blank=True)
    acousticness = models.FloatField(null=True, blank=True)
    instrumentalness = models.FloatField(null=True, blank=True)
    liveness = models.FloatField(null=True, blank=True)
    valence = models.FloatField(null=True, blank=True)

    tempo = models.FloatField(null=True, blank=True)
    time_signature = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.track_name
