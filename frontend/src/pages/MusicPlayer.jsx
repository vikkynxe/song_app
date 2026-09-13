import React, { useEffect, useRef, useState } from "react";
import "../Style/musicplayer.css";
import { useLocation } from "react-router-dom";
import AudioPlayer from "./MusicPlayerFromapp";


function AudioPlayerf({ filename }) {
  const audioUrl = `http://localhost:8000/api/music/${encodeURIComponent(filename)}`;

  return (
    <audio controls preload="metadata">
      <source src={audioUrl} type="audio/mpeg" />
      Your browser does not support audio playback.
    </audio>
  );
}



export default function MusicPlayer() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const location = useLocation();

  const { list } = location.state || {};

  console.log("list:", list);


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
    return <h3>Loading songs... <AudioPlayer /></h3>;
  }

return (
  <div className="music-player">
    <div className="player-card">
      <h2>{songs.songs[currentSong].title}</h2>
      <p>{songs.songs[currentSong].artist}</p>

      <div className="controls">
        <button onClick={previousSong}>Previous</button>

        <button className="play-btn" onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button onClick={nextSong}>Next</button>
      </div>

      <audio
        ref={audioRef}
        src={songs.songs[currentSong].url}
        onEnded={nextSong}
      />
    </div>
  </div>
);
}
