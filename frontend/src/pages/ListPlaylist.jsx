import React, { useState, useEffect } from 'react';
import PlaylistSongsFun from "./PlaylistSongs.jsx"


const PlaylistDashboard = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    // Function to fetch playlists from the server
    const fetchPlaylists = async () => {
      try {
        setIsLoading(true);
        
        // Sending a POST request to get the list
        const formData = new FormData();

        const token = localStorage.getItem("token");
        console.log("Token:", token);
        
        formData.append("hash_id", token);

        console.log("hash_id:", formData.get("hash_id"));

        const response = await fetch('http://localhost:8000/api/get_playlists/', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        
        // Assuming the server returns an array of objects:
        // [{ id: 1, name: "Chill Vibes", tracks: 24, coverUrl: "..." }, ...]
        const playlistData = data.hash.map((hash, index) => ({
          id: hash,
          name: data.name[index],
          tracks: data.tracks[index],
          type: "Playlist"
        }));

        setPlaylists(playlistData);
        
      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError(err.message);
        
        // MOCK DATA: For demonstration purposes so you can see the UI 
        // if you run this without a real backend connected yet.
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylists();
  }, []); // Empty dependency array means this runs once when the page loads

  // Styles matching the dark theme of the music app
  const styles = {
    page: {
      padding: '30px',
      backgroundColor: '#121212',
      color: '#ffffff',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      fontSize: '28px',
      fontWeight: '700',
      marginBottom: '24px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '24px'
    },
    card: {
      backgroundColor: '#181818',
      padding: '16px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    cardHover: {
      backgroundColor: '#282828'
    },
    imagePlaceholder: {
      width: '100%',
      aspectRatio: '1',
      backgroundColor: '#333',
      borderRadius: '4px',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#555',
      fontSize: '48px'
    },
    title: {
      fontSize: '16px',
      fontWeight: '600',
      margin: '0 0 8px 0',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    subtitle: {
      fontSize: '14px',
      color: '#a7a7a7',
      margin: 0
    },
    statusMessage: {
      color: '#a7a7a7',
      fontSize: '16px',
      marginTop: '20px'
    }
  };

  return (
    <div style={styles.page}>
      {selectedPlaylist ? (
        <div>
          <button onClick={() => setSelectedPlaylist(null)}>
            ← Back to playlists
          </button>

          <PlaylistSongsFun selectedPlaylist={selectedPlaylist}/>

        </div>
      ) : (
        <>
          <h1 style={styles.header}>Your Playlists</h1>
  
          {isLoading ? (
            <p style={styles.statusMessage}>Loading your playlists...</p>
          ) : error && playlists.length === 0 ? (
            <p style={{ ...styles.statusMessage, color: '#e22134' }}>
              Error: {error}
            </p>
          ) : playlists.length === 0 ? (
            <p style={styles.statusMessage}>
              You don't have any playlists yet.
            </p>
          ) : (
            <div style={styles.grid}>
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  style={styles.card}
                  onClick={() => setSelectedPlaylist(playlist)}
                  onMouseEnter={(e) =>
                    e.currentTarget.style.backgroundColor =
                      styles.cardHover.backgroundColor
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.style.backgroundColor =
                      styles.card.backgroundColor
                  }
                >
                  <div style={styles.imagePlaceholder}>
                    🎵
                  </div>
  
                  <h3 style={styles.title}>
                    {playlist.name}
                  </h3>
  
                  <p style={styles.subtitle}>
                    {playlist.tracks} tracks • {playlist.type}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlaylistDashboard;