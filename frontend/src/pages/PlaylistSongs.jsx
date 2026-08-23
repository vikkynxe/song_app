import { useEffect, useState } from "react";
function PlaylistSongsFun({ selectedPlaylist }) {
  const [songs, setSongs] = useState([]);
  const [songs_details, setsongs_details] = useState([]);
  useEffect(() => {
    async function getSongsFromDB() {
      try {
        const response = await fetch("http://localhost:8000/api/get_songs/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: selectedPlaylist?.id,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }
        const result = await response.json();
        setSongs(result.resut);
        setsongs_details(result.data);
        console.log(songs_details[0].id)
      } catch (error) {
        console.error("Request failed:", error);
      }
    }
    if (selectedPlaylist?.id) {
      getSongsFromDB();
    }
  }, [selectedPlaylist]);
  return (
  
    <div className="song-card">
      <div className="number">{songs_details.id}</div>

      <div className="song-details">
        <h3 className="song-name">{songs_details.track_name}</h3>
        <p className="artist">{songs_details.album_name}</p>
      </div>

      <div className="album">After Hours</div>

      <div className="duration">3:20</div>

      <div className="more">⋮</div>
    <div>
      <h1>Playlist Songs</h1>
      <p>{selectedPlaylist?.id}</p>
      <p>{selectedPlaylist?.name}</p>
      <p>{songs_details}</p>
      <div>
        {songs.map((song, index) => (
          <li key={index}>{song}</li>
        ))}
      </div>
    </div> 
    </div>

  );
}

export default PlaylistSongsFun;