import { useEffect, useRef, useState } from "react";

function AudioPlayer({ Audiohashdata, Audioplayerdata }) {
  const audioRef = useRef(null);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);


  const index = Audioplayerdata.findIndex(
    song => song.track_hash === Audiohashdata
  );

  
  console.log(index);

  const current_song = Audioplayerdata[index];

  console.log(current_song);


  const handleSongEnded = () => {
    console.log("Song finished");

    function nextsongorsuffule(){
      try {
        index = index +1;
        Audiohashdata = current_song.track_hash;
      } catch (error) {
        index = 0;
        Audiohashdata = current_song.track_hash;
        console.log("Something went wrong:", error);
      } finally {
        console.log("Finished");
      }
    }
    nextsongorsuffule();
  };
  

  const audioUrl = `http://localhost:8000/api/audio/${Audiohashdata}`;

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  const handleSeek = (e) => {
    const time = Number(e.target.value);

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleSongEnded}
      />


      <button onClick={() => audioRef.current.play()}>
        ▶️
      </button>

      <button onClick={() => audioRef.current.pause()}>
        ⏸️
      </button>

      <input
        type="range"
        min="0"
        max={duration || 0}
        value={currentTime}
        onChange={handleSeek}
        step="0.1"
        style={{ width: "400px" }}
      />

      <span>
        {Math.floor(currentTime)} / {Math.floor(duration)} sec
      </span>
    </div>
  );
}

export default AudioPlayer;
