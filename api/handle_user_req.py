from psycopg2.extras import execute_values
import psycopg2 
from psycopg2.errors import UniqueViolation

class handle_user_request():
    def __init__(self):
        self.conn = psycopg2.connect(
            host="localhost",
            database="song_app",
            user="it_me_owner",
            password="error^3"
        )
        self.cursor = self.conn.cursor()

    def get_user_playlist(self, id_users):
        query = """
            SELECT *
            FROM user_playlists
            WHERE user_hash = %s;
        """
        user_hash = id_users

        self.cursor.execute(query, (user_hash,))
        rows = self.cursor.fetchall()

        for row in rows:
            print(row)

        return rows
    
    def get_song_data(self, id_playlist):
        print(id_playlist)