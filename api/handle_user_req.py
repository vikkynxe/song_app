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

    def sign_in_function(self, hash_id_for_signin):
        self.cursor.execute(
            "SELECT * FROM users_table WHERE hash_id = %s",
            [hash_id_for_signin]
        )
        row = self.cursor.fetchone()

        if row == None:
            print("nothing is here need to create")
        
        return row

    def get_user_playlist(self, id_users):
        query = """
            SELECT *
            FROM user_playlists
            WHERE user_hash = %s;
        """
        user_hash = id_users

        self.cursor.execute(query, (user_hash,))
        rows = self.cursor.fetchall()
        
        data = []
        print("\n\n\n")
        for row in rows:
            data.append([row[0].tobytes(),row[2]])

        return data
 
    def numberofsongsfun(self, hash_id):
        query = """
            SELECT COUNT(*)
            FROM playlist_tracks
            WHERE playlist_id = %s;
        """
        print(hash_id)
        self.cursor.execute(query, (hash_id,))
        count = self.cursor.fetchone()[0]

        return count
    
    def get_song_data(self, id_playlist):
        query = """
            SELECT *
            FROM playlist_tracks
            WHERE playlist_id = %s;
        """

        self.cursor.execute(query, (id_playlist,))
        rows = self.cursor.fetchall()
        
        data = []
        print("\n\n\n")
        for row in rows:
            data.append(row[2])
        return data

    def get_song_data_from_db(self, id_hash_list):
        query = """
            SELECT *
            FROM user_song_list
            WHERE track_hash = %s;
        """
        data = []
        for id_hash_item in id_hash_list:
            self.cursor.execute(query, (id_hash_item,))
            row = self.cursor.fetchone()
            if row:
                columns = [column[0] for column in self.cursor.description]
                result = dict(zip(columns, row))
            else:
                result = None
            data.append(result)
        return(data)
