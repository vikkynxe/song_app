import { useEffect, useState } from "react";
import "../Style/PlaylistSongs.css";
import { useNavigate } from "react-router-dom";
import BottomPlayerF from "../components/BottomPlayer.jsx"


function PlaylistSongsFun({ selectedPlaylist }) {
  const [songs, setSongs] = useState([]);
  const [songs_details, setsongs_details] = useState([]);
  const navigate = useNavigate();


  const handleClick = (key) => {
    navigate("/BottomPlayerF", {
      state: {
        list: songs_details,
        hash: songs
      }
    });
  };

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
      } catch (error) {
        console.error("Request failed:", error);
      }
    }

    if (selectedPlaylist?.id) {
      getSongsFromDB();
    }
  }, [selectedPlaylist]);

  return (
    <div className="playlist-container">
      <div className="playlist-header">
        <div className="playlist-icon">♫</div>

        <div>
          <span className="playlist-label">PLAYLIST</span>
          <h1>{selectedPlaylist?.name || "Playlist Songs"}</h1>
          <p>{songs_details.length} songs</p>
        </div>
      </div>

      <div className="songs-header">
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span>Duration</span>
      </div>

      <div className="songs-list">
        {songs_details.map((song, index) => (
          <div className="song-row" key={song.id} onClick={() => handleClick(song.track_hash)} style={{ cursor: "pointer" }} >
            <div className="number">{index + 1}</div>

            <div className="song-details">
              <h3 className="song-name">{song.track_name}</h3>
              <p className="artist">{song.artist_names}</p>
            </div>

            <div className="album">{song.album_name}</div>

            <div className="duration">
              {song.duration_ms
                ? `${Math.floor(song.duration_ms / 60000)}:${String(
                    Math.floor((song.duration_ms % 60000) / 1000)
                  ).padStart(2, "0")}`
                : "--:--"}
            </div>

            <div className="song-extra">
              <span>Popularity: {song.popularity}</span>
              <span>Genres: {song.genres}</span>
              <span>Label: {song.record_label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlaylistSongsFun;