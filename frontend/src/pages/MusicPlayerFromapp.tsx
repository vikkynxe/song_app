import React, { useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  Disc3,
  ListMusic,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import { usePlayer } from '../context/PlayerContext';
import { useRouter } from '../context/RouterContext';
import '../Style/musicplayer.css';

export const MusicPlayerFromapp: React.FC = () => {
  const {
    currentSong,
    playlist,
    currentIndex,
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
    playTrack,
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
   * Keeps track of whether the 50% request
   * has already been sent for the current song.
   */
  const requestSentRef = useRef(false);

  /**
   * Reset the 50% tracking when a new song starts.
   */
  useEffect(() => {
    requestSentRef.current = false;
  }, [currentSong?.track_hash]);

  /**
   * Detect when the song reaches 50%.
   */
  useEffect(() => {
    if (!currentSong) return;

    if (!duration || duration <= 0) return;

    if (currentTime < 0) return;

    const percentage = (currentTime / duration) * 100;

    console.log(
      `Playing: ${percentage.toFixed(2)}%`
    );

    /**
     * Send request once when playback reaches 50%.
     */
    if (
      percentage >= 50 &&
      !requestSentRef.current
    ) {
      requestSentRef.current = true;

      console.log('Song reached 50%. Sending request...');

      fetch('http://localhost:8000/api/prepar_song_befor/', {
        method: 'POST',
        body: JSON.stringify({
          track_hash: currentSong.track_hash,
          currentTime: currentTime,
          duration: duration,
          percentage: percentage,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Request failed: ${response.status}`
            );
          }

          return response.json();
        })
        .then((data) => {
          console.log(
            '50% tracking request successful:',
            data
          );
        })
        .catch((error) => {
          console.error(
            '50% tracking request failed:',
            error
          );

          /**
           * Allow the request to be retried
           * if the API request failed.
           */
          requestSentRef.current = true;
        });
    }
  }, [
    currentTime,
    duration,
    currentSong,
  ]);

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
   * Handle seek.
   */
  const handleSeek = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    seek(parseFloat(e.target.value));
  };

  /**
   * Check if current song is liked.
   */
  const isLiked = currentSong
    ? likedSongHashes.includes(
        currentSong.track_hash
      )
    : false;

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-100 p-4 sm:p-8 flex flex-col justify-between relative overflow-hidden">

      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />

      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      {/* ====================================================== */}
      {/* TOP NAVIGATION */}
      {/* ====================================================== */}

      <div className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between pb-6">

        <button
          onClick={() => navigate('/HomePage')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />

          <span>
            Back to Library
          </span>
        </button>

        <div className="text-center">

          <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-widest block">
            Now Playing
          </span>

          <span className="text-xs text-slate-400 font-medium">
            {playlist.length > 0
              ? `Track ${currentIndex + 1} of ${playlist.length}`
              : 'Standalone Player'}
          </span>

        </div>

        <div className="w-24 flex justify-end">

          {currentSong && (
            <button
              onClick={() =>
                toggleLikeSong(
                  currentSong.track_hash
                )
              }
              className={`p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors ${
                isLiked
                  ? 'text-rose-500'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Like this track"
              aria-label="Like track"
            >
              <Heart
                className={`w-4 h-4 ${
                  isLiked
                    ? 'fill-current'
                    : ''
                }`}
              />
            </button>
          )}

        </div>
      </div>

      {/* ====================================================== */}
      {/* CENTER STAGE */}
      {/* ====================================================== */}

      <div className="relative z-10 max-w-4xl mx-auto w-full my-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 py-6">

        {/* ================================================== */}
        {/* VINYL */}
        {/* ================================================== */}

        <div className="relative flex items-center justify-center shrink-0">

          <div
            className={`w-64 h-64 sm:w-80 sm:h-80 vinyl-record flex items-center justify-center ${
              isPlaying
                ? 'spinning-vinyl'
                : 'paused-vinyl'
            }`}
          >

            <div className="vinyl-grooves" />

            <div className="vinyl-grooves-inner" />

            {/* Center Label */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-indigo-700 via-purple-700 to-pink-600 p-1 flex items-center justify-center shadow-xl relative overflow-hidden">

              <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-center p-3 relative">

                <Disc3 className="w-8 h-8 text-indigo-300 mb-1" />

                <span className="text-[9px] font-bold text-white uppercase tracking-wider truncate max-w-[80px]">
                  {currentSong
                    ? currentSong.track_name
                    : 'Aura'}
                </span>

                <span className="text-[8px] text-slate-400 truncate max-w-[70px]">
                  {currentSong
                    ? currentSong.artist_names
                    : 'Music'}
                </span>

                {/* Spindle hole */}
                <div className="w-4 h-4 rounded-full bg-[#08090d] border border-white/20 mt-1" />

              </div>
            </div>
          </div>
        </div>

        {/* ================================================== */}
        {/* RIGHT SIDE */}
        {/* ================================================== */}

        <div className="w-full max-w-md flex flex-col justify-center space-y-6">

          {/* Metadata */}
          <div className="text-center lg:text-left">

            <h1 className="text-2xl sm:text-3xl font-bold font-['Syne'] text-white tracking-tight truncate">
              {currentSong
                ? currentSong.track_name
                : 'No track loaded'}
            </h1>

            <p className="text-sm text-indigo-300 font-medium mt-1 truncate">
              {currentSong
                ? currentSong.artist_names
                : 'Select a song from a playlist to start'}
            </p>

            {currentSong?.album_name && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                Album: {currentSong.album_name}
              </p>
            )}

            {currentSong?.genres && (
              <div className="flex flex-wrap items-center gap-2 mt-2 justify-center lg:justify-start">

                <span className="text-[11px] text-slate-400">
                  Genre:{' '}
                  <span className="text-slate-300">
                    {currentSong.genres}
                  </span>
                </span>

                {currentSong.record_label && (
                  <>
                    <span
                      className="text-slate-600"
                      aria-hidden="true"
                    >
                      ·
                    </span>

                    <span className="text-[11px] text-slate-400">
                      Label:{' '}
                      <span className="text-slate-300">
                        {currentSong.record_label}
                      </span>
                    </span>
                  </>
                )}

              </div>
            )}

          </div>

          {/* ================================================== */}
          {/* AUDIO ERROR */}
          {/* ================================================== */}

          {audioError && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">

              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />

              <div className="flex-1">
                {audioError}
              </div>

            </div>
          )}

          {/* ================================================== */}
          {/* PROGRESS */}
          {/* ================================================== */}

          <div className="space-y-1.5">

            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              disabled={!currentSong}
              className="w-full music-slider"
              aria-label="Seek track position"
            />

            <div className="flex justify-between text-xs font-mono tabular-nums text-slate-400">

              <span>
                {formatTime(currentTime)}
              </span>

              <span>
                {formatTime(duration)}
              </span>

            </div>

          </div>

          {/* ================================================== */}
          {/* CONTROLS */}
          {/* ================================================== */}

          <div className="flex items-center justify-between px-2">

            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`p-2 rounded-xl transition-colors ${
                isShuffle
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Shuffle"
              aria-label="Toggle Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous */}
            <button
              onClick={playPrev}
              disabled={!currentSong}
              className="p-3 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
              title="Previous"
              aria-label="Previous Track"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              disabled={!currentSong}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-40 shadow-xl shadow-indigo-500/30 transition-all cursor-pointer"
              title={
                isPlaying
                  ? 'Pause'
                  : 'Play'
              }
              aria-label={
                isPlaying
                  ? 'Pause'
                  : 'Play'
              }
            >

              {isLoadingAudio ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              )}

            </button>

            {/* Next */}
            <button
              onClick={playNext}
              disabled={!currentSong}
              className="p-3 text-slate-300 hover:text-white disabled:opacity-30 transition-colors"
              title="Next"
              aria-label="Next Track"
            >
              <SkipForward className="w-6 h-6" />
            </button>

            {/* Loop */}
            <button
              onClick={toggleLoop}
              className={`p-2 rounded-xl transition-colors ${
                isLooping
                  ? 'text-indigo-400 bg-indigo-500/10'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Loop"
              aria-label="Toggle Loop"
            >
              <Repeat className="w-4 h-4" />
            </button>

          </div>

          {/* ================================================== */}
          {/* VOLUME */}
          {/* ================================================== */}

          <div className="flex items-center gap-3 pt-2">

            <button
              onClick={toggleMute}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle mute"
            >

              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}

            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={
                isMuted
                  ? 0
                  : volume
              }
              onChange={(e) =>
                setVolume(
                  parseFloat(e.target.value)
                )
              }
              className="w-full music-slider"
              aria-label="Volume slider"
            />

          </div>

        </div>
      </div>

      {/* ====================================================== */}
      {/* PLAYLIST QUEUE */}
      {/* ====================================================== */}

      {playlist.length > 0 && (
        <div className="relative z-10 max-w-4xl mx-auto w-full pt-4 border-t border-white/5">

          <div className="flex items-center justify-between mb-3">

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">

              <ListMusic className="w-3.5 h-3.5" />

              <span>
                Playlist Queue ({playlist.length} tracks)
              </span>

            </div>

          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">

            {playlist.map((song, idx) => {

              const isCurrent =
                currentIndex === idx;

              return (
                <button
                  key={
                    song.track_hash || idx
                  }
                  onClick={() =>
                    playTrack(song, idx)
                  }
                  className={`px-3 py-2 rounded-xl text-left border shrink-0 max-w-[200px] transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >

                  <p className="text-xs font-semibold truncate">
                    {song.track_name}
                  </p>

                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {song.artist_names}
                  </p>

                </button>
              );
            })}

          </div>
        </div>
      )}

    </div>
  );
};

export default MusicPlayerFromapp;