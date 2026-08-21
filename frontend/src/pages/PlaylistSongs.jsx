import { useEffect, useState } from "react";
function PlaylistSongsFun({ selectedPlaylist }) {
  const [songs, setSongs] = useState([]);
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
        console.log(result)
      } catch (error) {
        console.error("Request failed:", error);
      }
    }
    if (selectedPlaylist?.id) {
      getSongsFromDB();
    }
  }, [selectedPlaylist]);
  return (
    <div>
      <h1>Playlist Songs</h1>
      <p>{selectedPlaylist?.id}</p>
      <p>{selectedPlaylist?.name}</p>
      <div>
        {songs.map((song, index) => (
          <li key={index}>{song}</li>
        ))}
      </div>
    </div>
  );
}

export default PlaylistSongsFun;