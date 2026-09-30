import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Song } from '../types';
import { API_ENDPOINTS } from '../config/api';

interface PlayerContextType {
  currentSong: Song | null;
  playlist: Song[];
  currentIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffle: boolean;
  isLoadingAudio: boolean;
  audioError: string | null;
  likedSongHashes: string[];
  toggleLikeSong: (trackHash: string) => void;
  playTrack: (song: Song, index?: number, newPlaylist?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  loadNext: () => void;
  playPrev: () => void;
  seek: (seconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  loadPlaylist: (songs: Song[], startIndex?: number) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Liked songs hashes kept locally in localStorage for UI consistency
  const [likedSongHashes, setLikedSongHashes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aura_liked_songs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio element once
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoadingAudio(false);
      setAudioError(null);
    };

    const onWaiting = () => {
      setIsLoadingAudio(true);
    };

    const onPlaying = () => {
      setIsLoadingAudio(false);
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onError = () => {
      setIsLoadingAudio(false);
      setIsPlaying(false);
      if (audio.src && audio.src !== '') {
        setAudioError(`Audio stream unavailable from ${audio.src}. Verify backend audio endpoint.`);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
    };
  }, []);

  // Sync ended event with latest playlist and loop state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        playNext();
      }
    };

    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, [playlist, currentIndex, isLooping, isShuffle]);

  const toggleLikeSong = (trackHash: string) => {
    setLikedSongHashes((prev) => {
      const exists = prev.includes(trackHash);
      const next = exists ? prev.filter((id) => id !== trackHash) : [...prev, trackHash];
      try {
        localStorage.setItem('aura_liked_songs', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save liked songs:', err);
      }
      return next;
    });
  };

  const playTrack = (song: Song, index?: number, newPlaylist?: Song[]) => {
    const currentList = newPlaylist || playlist;
    if (newPlaylist) {
      setPlaylist(newPlaylist);
    }

    console.log("Playlist raw",playlist);

    let foundIndex = index !== undefined ? index : currentList.findIndex((s) => s.track_hash === song.track_hash);

    console.log(song.track_hash);
    if (foundIndex === -1) {
      foundIndex = currentList.length;
      setPlaylist([...currentList, song]);
    }
    setCurrentIndex(foundIndex);
    setCurrentSong(song);
    setAudioError(null);
    setIsLoadingAudio(true);

    const audio = audioRef.current;
    if (audio) {
      const audioUrl = API_ENDPOINTS.audio(song.track_hash);
      audio.src = audioUrl;
      audio.currentTime = 0;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoadingAudio(false);
        })
        .catch((err) => {
          console.warn('Playback error (backend audio may be unavailable or blocked):', err);
          setIsPlaying(false);
          setIsLoadingAudio(false);
          setAudioError(`Playback error for "${song.track_name}". Please verify the backend audio stream.`);
        });
    }
  };

  const loadPlaylist = (songs: Song[], startIndex = 0) => {
    if (!songs || songs.length === 0) return;
    setPlaylist(songs);
    playTrack(songs[startIndex], startIndex, songs);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentSong && playlist.length > 0) {
      playTrack(playlist[0], 0);
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn('Play error:', err);
          setAudioError('Unable to resume playback. Ensure backend audio is online.');
        });
    }
  };

  const loadNext = () => {
    if (!playlist || playlist.length === 0) return;

    console.log(playlist);


    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }
    return playlist.length;
  };

  const playNext = () => {
    if (!playlist || playlist.length === 0) return;

    let nextIndex: number;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }

    playTrack(playlist[nextIndex], nextIndex);
  };

  const playPrev = () => {
    if (!playlist || playlist.length === 0) return;

    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }

    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    playTrack(playlist[prevIndex], prevIndex);
  };

  const seek = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const setVolume = (vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    setIsMuted(clamped === 0);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume > 0 ? volume : 0.8;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleLoop = () => {
    setIsLooping((prev) => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
  };

  return (
    <PlayerContext.Provider
      value={{
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
        loadPlaylist,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
