import React, { useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Heart,
  Repeat,
  Shuffle,
  Maximize2,
  Music,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import { usePlayer } from '../context/PlayerContext';
import { useRouter } from '../context/RouterContext';

export const BottomPlayer: React.FC = () => {
  /**
   * Keeps track of whether the 50% API request
   * has already been sent for the current song.
   */
  const requestSentRef = useRef(false);

  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    isShuffle,
    isLoadingAudio,
    audioError,
    likedSongHashes,
    toggleLikeSong,
    togglePlay,
    playNext,
    loadNext,
    playPrev,
    seek,
    setVolume,
    toggleMute,
    toggleLoop,
    toggleShuffle,
  } = usePlayer();

  const { navigate } = useRouter();

  /**
   * Reset the 50% request flag whenever
   * a different song starts playing.
   */
  useEffect(() => {
    requestSentRef.current = false;
  }, [currentSong?.track_hash]);

  /**
   * Check playback progress.
   *
   * When the song reaches 50%, send the API request.
   */
  useEffect(() => {
    // No song
    if (!currentSong) return;

    // Invalid duration
    if (!duration || duration <= 0) return;

    // Calculate playback percentage
    const percentage = (currentTime / duration) * 100;

    // Only send once
    if (percentage >= 50 && !requestSentRef.current) {
      let data = loadNext();

      requestSentRef.current = true;

      fetch('http://localhost:8000/api/prepar_song_befor/', {
        method: 'POST',
        body: JSON.stringify({
          track_hash: currentSong.track_hash,
          currentTime,
          duration,
          data,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
          }

          return response.json();
        })
        .then((data) => {
          console.log('Song reached 50%', data);
        })
        .catch((error) => {
          console.error('50% request failed:', error);

          /**
           * Allow retry if the request failed.
           */
          requestSentRef.current = true;
        });
    }
  }, [currentTime, duration, currentSong]);

  /**
   * Format seconds into M:SS
   */
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) {
      return '0:00';
    }

    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);

    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  /**
   * Check if current song is liked.
   */
  const isLiked = currentSong
    ? likedSongHashes.includes(currentSong.track_hash)
    : false;

  /**
   * Handle song seeking.
   */
  const handleSeekChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = parseFloat(e.target.value);

    seek(val);
  };

  /**
   * Handle volume change.
   */
  const handleVolumeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = parseFloat(e.target.value);

    setVolume(val);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bottom-player-surface px-4 py-2.5 transition-all">

      {/* Mini top progress indicator */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-100"
          style={{
            width: `${
              duration > 0
                ? (currentTime / duration) * 100
                : 0
            }%`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

        {/* ====================================================== */}
        {/* LEFT: TRACK INFORMATION */}
        {/* ====================================================== */}

        <div className="flex items-center gap-3.5 min-w-0 w-1/4">

          {/* Artwork */}
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-white/10 shrink-0 flex items-center justify-center shadow-md">

            {isLoadingAudio ? (
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            ) : currentSong ? (
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden group">

                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 to-purple-600/30" />

                <Music
                  className={`w-5 h-5 text-indigo-300 relative z-10 ${
                    isPlaying ? 'scale-110' : ''
                  } transition-transform`}
                />

              </div>
            ) : (
              <Music className="w-5 h-5 text-slate-600" />
            )}

          </div>

          {/* Song information */}
          <div className="min-w-0">

            <p className="text-sm font-semibold text-slate-100 truncate">
              {currentSong
                ? currentSong.track_name
                : 'No track playing'}
            </p>

            <p className="text-xs text-slate-400 truncate">
              {currentSong
                ? currentSong.artist_names
                : 'Select a song from your playlist'}
            </p>

          </div>

          {/* Like button */}
          {currentSong && (
            <button
              onClick={() =>
                toggleLikeSong(currentSong.track_hash)
              }
              className={`p-1.5 rounded-lg transition-colors ml-1 shrink-0 ${
                isLiked
                  ? 'text-rose-500'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={isLiked ? 'Unlike' : 'Like'}
              aria-label="Toggle Like"
            >
              <Heart
                className={`w-4 h-4 ${
                  isLiked ? 'fill-current' : ''
                }`}
              />
            </button>
          )}

        </div>

        {/* ====================================================== */}
        {/* CENTER: PLAYBACK CONTROLS */}
        {/* ====================================================== */}

        <div className="flex flex-col items-center gap-1 max-w-xl w-2/4">

          {/* Playback buttons */}
          <div className="flex items-center gap-4">

            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-1.5 rounded-lg transition-colors ${
                isShuffle
                  ? 'text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={
                isShuffle
                  ? 'Shuffle enabled'
                  : 'Enable shuffle'
              }
              aria-label="Toggle Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            {/* Previous */}
            <button
              onClick={playPrev}
              disabled={!currentSong}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Previous"
              aria-label="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              disabled={!currentSong}
              className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-white/10"
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={
                isPlaying ? 'Pause' : 'Play'
              }
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current translate-x-0.5" />
              )}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              disabled={!currentSong}
              className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              title="Next"
              aria-label="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Loop */}
            <button
              onClick={toggleLoop}
              className={`p-1.5 rounded-lg transition-colors ${
                isLooping
                  ? 'text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title={
                isLooping
                  ? 'Loop enabled'
                  : 'Enable Loop'
              }
              aria-label="Toggle Loop"
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>

          </div>

          {/* ====================================================== */}
          {/* PROGRESS BAR */}
          {/* ====================================================== */}

          <div className="w-full flex items-center gap-2.5">

            {/* Current time */}
            <span className="text-[11px] font-mono tabular-nums text-slate-400 w-8 text-right shrink-0">
              {formatTime(currentTime)}
            </span>

            {/* Seek slider */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeekChange}
              disabled={!currentSong}
              className="w-full music-slider"
              aria-label="Seek track"
            />

            {/* Duration */}
            <span className="text-[11px] font-mono tabular-nums text-slate-400 w-8 text-left shrink-0">
              {formatTime(duration)}
            </span>

          </div>

          {/* Audio error */}
          {audioError && (
            <div className="flex items-center gap-1 text-[11px] text-amber-400/90 truncate max-w-sm mt-0.5">

              <AlertCircle className="w-3 h-3 shrink-0" />

              <span className="truncate">
                {audioError}
              </span>

            </div>
          )}

        </div>

        {/* ====================================================== */}
        {/* RIGHT: VOLUME */}
        {/* ====================================================== */}

        <div className="hidden sm:flex items-center justify-end gap-3 w-1/4">

          <div className="flex items-center gap-2">

            {/* Mute */}
            <button
              onClick={toggleMute}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label="Mute / Unmute"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>

            {/* Volume slider */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 music-slider"
              aria-label="Volume slider"
            />

          </div>

          {/* Expand player */}
          <button
            onClick={() => navigate('/AudioPlayer')}
            className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-white/5 rounded-lg transition-colors ml-1"
            title="Expand Full Player"
            aria-label="Expand Full Player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};

export default BottomPlayer;