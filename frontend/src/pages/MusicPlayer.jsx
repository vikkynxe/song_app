import React, { useEffect, useRef, useState } from "react";

export default function MusicPlayer() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);

  // Fetch songs from API
  const fetchSongs = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/songs/");
      const data = await response.json();

      // Assuming the API returns an array of songs
      setSongs(data);
      setCurrentSong(0);
      console.log(data)
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  // Fetch first batch when component loads
  useEffect(() => {
    fetchSongs();
  }, []);

  // Play/Pause whenever current song changes
  useEffect(() => {
    if (!audioRef.current || songs.length === 0) return;

    if (isPlaying) {
      audioRef.current.play().catch((err) => console.log(err));
    }
  }, [currentSong, songs, isPlaying]);

  // Play/Pause button
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
  };

  // Next song
  const nextSong = async () => {
    if (currentSong < songs.length - 1) {
      setCurrentSong((prev) => prev + 1);
    } else {
      // Last song reached -> Fetch new songs
      await fetchSongs();
    }
  };

  // Previous song
  const previousSong = () => {
    if (currentSong > 0) {
      setCurrentSong((prev) => prev - 1);
    }
  };

  if (songs.length === 0) {
    return <h3>Loading songs...</h3>;
  }

  return (
    <div>
      <h2>{songs.songs[currentSong].title}</h2>
      <p>{songs.songs[currentSong].artist}</p>

      <button onClick={previousSong}>Previous</button>

      <button onClick={togglePlay}>
        {isPlaying ? "Pause" : "Play"}
      </button>

      <button onClick={nextSong}>Next</button>

      <audio
        ref={audioRef}
        src={songs.songs[currentSong].url}
        onEnded={nextSong}
      />
    </div>
  );
}
