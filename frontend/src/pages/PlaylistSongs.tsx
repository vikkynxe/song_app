import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Play,
  Pause,
  Clock,
  Disc3,
  Music2,
  RefreshCw,
  AlertCircle,
  Heart,
} from 'lucide-react';

import { API_ENDPOINTS } from '../config/api';
import { Playlist, Song, GetSongsResponse } from '../types';
import { usePlayer } from '../context/PlayerContext';
import '../Style/PlaylistSongs.css';

interface PlaylistSongsProps {
  playlist: Playlist;
  onBack: () => void;
}

export const PlaylistSongs: React.FC<PlaylistSongsProps> = ({
  playlist,
  onBack,
}) => {
  // --------------------------------------------------
  // ONE SOURCE OF TRUTH
  // --------------------------------------------------
  // Do not keep separate `songs` and `songdata` arrays.
  // This same array is used for:
  // - displaying songs
  // - clicking a song
  // - Play All
  // - Next
  // - Previous
  const [songs, setSongs] = useState<Song[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentSong,
    isPlaying,
    playTrack,
    loadPlaylist,
    togglePlay,
    likedSongHashes,
    toggleLikeSong,
  } = usePlayer();

  // --------------------------------------------------
  // FETCH SONGS
  // --------------------------------------------------
  const fetchSongs = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINTS.getSongs, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: playlist.hash,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data: GetSongsResponse = await response.json();

      console.log('GET SONGS API RESPONSE:', data);

      /*
       * Your backend appears to have used both:
       *
       * data.resut
       * data.data
       *
       * Prefer data.data because that is the array you were
       * previously using to display the songs.
       *
       * If data.data doesn't exist, fall back to data.resut.
       */
      const receivedSongs =
        Array.isArray(data.data)
          ? data.data
          : Array.isArray(data.resut)
          ? data.resut
          : [];

      console.log('SONGS USED BY PLAYER:', receivedSongs);

      // Check every song for track_hash
      receivedSongs.forEach((song, index) => {
        if (!song?.track_hash) {
          console.error(
            `Song at index ${index} is missing track_hash:`,
            song
          );
        }
      });

      setSongs(receivedSongs);
    } catch (err: any) {
      console.error('Fetch songs error:', err);

      setError(
        'Unable to load songs for this playlist. Please verify your backend server.'
      );

      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // LOAD SONGS WHEN PLAYLIST CHANGES
  // --------------------------------------------------
  useEffect(() => {
    fetchSongs();
  }, [playlist.hash]);

  // --------------------------------------------------
  // FORMAT DURATION
  // --------------------------------------------------
  const formatDuration = (ms: number) => {
    if (!ms || isNaN(ms)) {
      return '0:00';
    }

    const totalSecs = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // --------------------------------------------------
  // CLICK INDIVIDUAL SONG
  // --------------------------------------------------
  const handleSongClick = (song: Song, index: number) => {
    console.log('CLICKED SONG:', song);
    console.log('CLICKED SONG HASH:', song?.track_hash);
    console.log('PLAYLIST:', songs);

    // Prevent /api/audio/undefined
    if (!song?.track_hash) {
      console.error(
        'Cannot play this song because track_hash is missing:',
        song
      );

      return;
    }

    // If clicking the currently playing song,
    // simply pause/resume it.
    if (currentSong?.track_hash === song.track_hash) {
      togglePlay();
      return;
    }

    /*
     * IMPORTANT:
     *
     * Use `songs`, the SAME array that is displayed,
     * as the playlist.
     *
     * Previously you were displaying `songdata` but
     * passing `songs` to playTrack().
     */
    playTrack(song, index, songs);
  };

  // --------------------------------------------------
  // PLAY ALL
  // --------------------------------------------------
  const handlePlayAll = () => {
    if (songs.length === 0) {
      return;
    }

    // Make sure first song has a hash
    if (!songs[0]?.track_hash) {
      console.error(
        'Cannot play playlist. First song has no track_hash:',
        songs[0]
      );

      return;
    }

    console.log('PLAY ALL:', songs);

    loadPlaylist(songs, 0);
  };

  // --------------------------------------------------
  // CURRENT PLAYLIST STATUS
  // --------------------------------------------------
  const isCurrentPlaylistPlaying =
    isPlaying &&
    songs.some(
      (song) => song.track_hash === currentSong?.track_hash
    );

  return (
    <div className="space-y-6 pb-16">

      {/* --------------------------------------------- */}
      {/* BACK BUTTON */}
      {/* --------------------------------------------- */}

      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />

          <span>Back to Playlists</span>
        </button>
      </div>

      {/* --------------------------------------------- */}
      {/* PLAYLIST HERO HEADER */}
      {/* --------------------------------------------- */}

      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 border border-white/10 bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-950 flex flex-col sm:flex-row items-center sm:items-end gap-6 shadow-xl">

        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-slate-900 border border-white/10 flex items-center justify-center shrink-0 shadow-2xl relative overflow-hidden group">

          <Disc3 className="w-20 h-20 text-white/20 group-hover:scale-105 transition-transform" />

          <div className="absolute inset-0 bg-black/20 flex items-center justify-center" />
        </div>

        <div className="flex-1 text-center sm:text-left">

          <div className="text-xs uppercase tracking-wider text-indigo-400 font-semibold mb-2">
            Playlist
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Syne'] text-white tracking-tight">
            {playlist.name}
          </h1>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-slate-400 mt-3">

            <span>{songs.length} songs</span>

            <span aria-hidden="true">·</span>

            <span>ID: {playlist.hash}</span>

          </div>

          {/* ACTION BUTTONS */}

          <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">

            <button
              onClick={handlePlayAll}
              disabled={songs.length === 0}
              className="py-2.5 px-6 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 disabled:opacity-40 transition-all cursor-pointer"
            >

              {isCurrentPlaylistPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />

                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current translate-x-0.5" />

                  <span>Play All</span>
                </>
              )}

            </button>

            <button
              onClick={fetchSongs}
              disabled={loading}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors cursor-pointer"
              title="Refresh songs list"
              aria-label="Refresh songs list"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  loading ? 'animate-spin' : ''
                }`}
              />
            </button>

          </div>
        </div>
      </div>

      {/* --------------------------------------------- */}
      {/* LOADING STATE */}
      {/* --------------------------------------------- */}

      {loading && (
        <div className="space-y-2">

          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-14 rounded-xl bg-white/[0.02] border border-white/5 animate-pulse"
            />
          ))}

        </div>
      )}

      {/* --------------------------------------------- */}
      {/* ERROR STATE */}
      {/* --------------------------------------------- */}

      {!loading && error && (
        <div className="p-8 rounded-3xl bg-rose-500/[0.04] border border-rose-500/20 text-center max-w-md mx-auto my-6">

          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-2" />

          <h3 className="text-sm font-semibold text-rose-200">
            Failed to Load Songs
          </h3>

          <p className="text-xs text-rose-300/80 mt-1 leading-relaxed">
            {error}
          </p>

          <button
            onClick={fetchSongs}
            className="mt-4 py-2 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-200 text-xs font-medium border border-rose-500/30 transition-colors"
          >
            Retry
          </button>

        </div>
      )}

      {/* --------------------------------------------- */}
      {/* EMPTY STATE */}
      {/* --------------------------------------------- */}

      {!loading && !error && songs.length === 0 && (
        <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 text-center max-w-md mx-auto my-8">

          <Music2 className="w-10 h-10 text-slate-500 mx-auto mb-3" />

          <h3 className="text-sm font-semibold text-white">
            No Songs in this Playlist
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            This playlist does not currently contain any tracks.
          </p>

        </div>
      )}

      {/* --------------------------------------------- */}
      {/* SONGS TABLE */}
      {/* --------------------------------------------- */}

      {!loading && !error && songs.length > 0 && (
        <div className="rounded-2xl border border-white/5 overflow-hidden bg-white/[0.01]">

          {/* HEADER */}

          <div className="grid grid-cols-12 gap-3 px-4 py-3 text-[11px] font-semibold tracking-wider text-slate-500 uppercase border-b border-white/5">

            <div className="col-span-1 text-center">
              #
            </div>

            <div className="col-span-6 sm:col-span-4">
              Title
            </div>

            <div className="hidden sm:block sm:col-span-3">
              Album
            </div>

            <div className="hidden md:block md:col-span-2">
              Genre
            </div>

            <div className="col-span-5 sm:col-span-4 md:col-span-2 flex items-center justify-end pr-2">
              <Clock className="w-3.5 h-3.5" />
            </div>

          </div>

          {/* SONG ROWS */}

          <div className="divide-y divide-white/[0.02]">

            {songs.map((song, idx) => {

              const isCurrent =
                currentSong?.track_hash === song.track_hash;

              const isSongPlaying =
                isCurrent && isPlaying;

              const isLiked =
                !!song.track_hash &&
                likedSongHashes.includes(song.track_hash);

              return (
                <div
                  /*
                   * IMPORTANT:
                   *
                   * track_hash should normally be unique.
                   * Adding idx prevents the React duplicate-key
                   * warning if the backend contains duplicate songs.
                   */
                  key={`${song.track_hash || 'song'}-${idx}`}

                  onClick={() =>
                    handleSongClick(song, idx)
                  }

                  className={`grid grid-cols-12 gap-3 px-4 py-3 items-center text-xs transition-colors cursor-pointer group ${
                    isCurrent
                      ? 'bg-indigo-600/15 text-indigo-200'
                      : 'hover:bg-white/[0.04] text-slate-300'
                  }`}
                >

                  {/* TRACK NUMBER */}

                  <div className="col-span-1 text-center font-mono tabular-nums text-slate-400 flex items-center justify-center">

                    {isSongPlaying ? (
                      <div className="flex items-end gap-0.5 h-3">

                        <span className="equalizer-bar" />
                        <span className="equalizer-bar" />
                        <span className="equalizer-bar" />

                      </div>
                    ) : (
                      <span className="group-hover:hidden">
                        {idx + 1}
                      </span>
                    )}

                    <Play
                      className={`w-3.5 h-3.5 text-white ${
                        isSongPlaying
                          ? 'hidden'
                          : 'hidden group-hover:block'
                      }`}
                    />

                  </div>

                  {/* TITLE / ARTIST */}

                  <div className="col-span-6 sm:col-span-4 min-w-0 pr-2">

                    <p
                      className={`font-semibold truncate ${
                        isCurrent
                          ? 'text-indigo-400'
                          : 'text-slate-100 group-hover:text-white'
                      }`}
                    >
                      {song.track_name || 'Untitled Track'}
                    </p>

                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {song.artist_names || 'Unknown Artist'}
                    </p>

                  </div>

                  {/* ALBUM */}

                  <div className="hidden sm:block sm:col-span-3 truncate text-slate-400 text-xs">
                    {song.album_name || '—'}
                  </div>

                  {/* GENRE */}

                  <div className="hidden md:block md:col-span-2 truncate text-slate-400 text-xs">
                    {song.genres || 'General'}
                  </div>

                  {/* DURATION / LIKE */}

                  <div className="col-span-5 sm:col-span-4 md:col-span-2 flex items-center justify-end gap-3 text-right">

                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        if (song.track_hash) {
                          toggleLikeSong(song.track_hash);
                        }
                      }}

                      className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                        isLiked
                          ? 'opacity-100 text-rose-500'
                          : 'text-slate-400 hover:text-white'
                      }`}

                      aria-label="Like song"
                    >

                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked
                            ? 'fill-current'
                            : ''
                        }`}
                      />

                    </button>

                    <span className="font-mono tabular-nums text-slate-400 text-xs w-10">
                      {formatDuration(song.duration_ms)}
                    </span>

                  </div>

                </div>
              );
            })}

          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistSongs;