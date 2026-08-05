import React, { useEffect, useRef, useState } from 'react';
import { Home, Search as SearchIcon, ListMusic, User, Play, Pause } from 'lucide-react';
import { theme, songs, initialQueue, byId, formatTime, cover } from './mockData';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import PlayerScreen from './PlayerScreen';
import ProfilePlaylistsScreen from './ProfilePlaylistsScreen';
import QueueScreen from './QueueScreen';

const FONT_LINK_ID = 'sunset-vinyl-fonts';

// Injects Sora + Inter once, and a couple of global animation
// keyframes that every screen shares (drag lift, progress shimmer).
function useGlobalFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.id = 'sunset-vinyl-anim';
    style.textContent = `
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 0px; height: 0px; }
      @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pop { from { transform: scale(0.94); opacity: 0.6; } to { transform: scale(1); opacity: 1; } }
    `;
    document.head.appendChild(style);
  }, []);
}

export default function App() {
  useGlobalFonts();

  const [tab, setTab] = useState('home'); // home | search | playlists | profile
  const [screen, setScreen] = useState('main'); // main | player | queue

  const [queue, setQueue] = useState(initialQueue);
  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(38); // seconds
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off'); // off | all | one
  const [likedIds, setLikedIds] = useState(new Set(songs.filter((s) => s.liked).map((s) => s.id)));
  const [sleepTimer, setSleepTimer] = useState(null);

  const tickRef = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      tickRef.current = setInterval(() => {
        setProgress((p) => (p + 1 >= currentSong.duration ? 0 : p + 1));
      }, 1000);
    }
    return () => clearInterval(tickRef.current);
  }, [isPlaying, currentSong]);

  const playSong = (song) => {
    setCurrentSong(song);
    setProgress(0);
    setIsPlaying(true);
    setScreen('player');
  };

  const togglePlay = () => setIsPlaying((p) => !p);

  const goNext = () => {
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    const next = queue[(idx + 1) % queue.length] || queue[0];
    if (next) { setCurrentSong(next); setProgress(0); setIsPlaying(true); }
  };
  const goPrev = () => {
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    const prev = queue[(idx - 1 + queue.length) % queue.length] || queue[0];
    if (prev) { setCurrentSong(prev); setProgress(0); setIsPlaying(true); }
  };

  const toggleLike = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const removeFromQueue = (id) => setQueue((q) => q.filter((s) => s.id !== id));
  const clearQueue = () => setQueue([]);
  const reorderQueue = (from, to) => {
    setQueue((q) => {
      const next = [...q];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const shared = { theme, cover, formatTime, likedIds, toggleLike, playSong, currentSong, isPlaying };

  return (
    <div
      style={{
        width: 390,
        height: 844,
        margin: '0 auto',
        background: theme.color.bg,
        borderRadius: 44,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: theme.font.body,
        color: theme.color.textPrimary,
        boxShadow: '0 40px 90px rgba(0,0,0,0.55)',
        border: '10px solid #030204',
      }}
    >
      {/* status bar */}
      <div
        style={{
          height: 46,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '0 28px 6px',
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: 0.2,
          position: 'relative',
          zIndex: 5,
        }}
      >
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 12 }}>●●●</span>
          <span style={{ fontSize: 12 }}>Wi‑Fi</span>
          <span style={{ fontSize: 12 }}>🔋</span>
        </div>
      </div>

      {screen === 'player' && (
        <PlayerScreen
          {...shared}
          song={currentSong}
          progress={progress}
          setProgress={setProgress}
          togglePlay={togglePlay}
          goNext={goNext}
          goPrev={goPrev}
          shuffle={shuffle}
          setShuffle={setShuffle}
          repeat={repeat}
          setRepeat={setRepeat}
          sleepTimer={sleepTimer}
          setSleepTimer={setSleepTimer}
          onClose={() => setScreen('main')}
          onOpenQueue={() => setScreen('queue')}
        />
      )}

      {screen === 'queue' && (
        <QueueScreen
          {...shared}
          queue={queue}
          removeFromQueue={removeFromQueue}
          clearQueue={clearQueue}
          reorderQueue={reorderQueue}
          onClose={() => setScreen('player')}
        />
      )}

      {screen === 'main' && (
        <>
          <div style={{ height: 844 - 46 - 64 - (currentSong ? 64 : 0), overflowY: 'auto', paddingBottom: 8 }}>
            {tab === 'home' && <HomeScreen {...shared} />}
            {tab === 'search' && <SearchScreen {...shared} />}
            {(tab === 'playlists' || tab === 'profile') && (
              <ProfilePlaylistsScreen {...shared} focus={tab} />
            )}
          </div>

          {currentSong && (
            <MiniPlayer song={currentSong} isPlaying={isPlaying} togglePlay={togglePlay} onOpen={() => setScreen('player')} />
          )}

          <BottomNav tab={tab} setTab={setTab} />
        </>
      )}
    </div>
  );
}

function MiniPlayer({ song, isPlaying, togglePlay, onOpen }) {
  const [a, b] = cover(song.coverIdx);
  return (
    <div
      onClick={onOpen}
      style={{
        height: 64,
        margin: '0 12px',
        borderRadius: theme.radius.md,
        background: theme.color.surface2,
        border: `1px solid ${theme.color.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        gap: 10,
        cursor: 'pointer',
        boxShadow: theme.shadow.card,
      }}
    >
      <div style={{ width: 42, height: 42, borderRadius: 10, background: `linear-gradient(135deg, ${a}, ${b})`, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
        <div style={{ fontSize: 11.5, color: theme.color.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); togglePlay(); }}
        style={{
          width: 36, height: 36, borderRadius: '50%', border: 'none',
          background: theme.color.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#100810', flexShrink: 0,
        }}
      >
        {isPlaying ? <Pause size={16} fill="#100810" /> : <Play size={16} fill="#100810" style={{ marginLeft: 1 }} />}
      </button>
    </div>
  );
}

function BottomNav({ tab, setTab }) {
  const items = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'search', label: 'Search', Icon: SearchIcon },
    { id: 'playlists', label: 'Playlists', Icon: ListMusic },
    { id: 'profile', label: 'Profile', Icon: User },
  ];
  return (
    <div
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: theme.color.bgElevated,
        borderTop: `1px solid ${theme.color.border}`,
        boxShadow: theme.shadow.nav,
      }}
    >
      {items.map(({ id, label, Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              background: 'none', border: 'none', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, cursor: 'pointer', color: active ? theme.color.textPrimary : theme.color.textTertiary,
              width: 64,
            }}
          >
            <Icon size={20} strokeWidth={active ? 2.4 : 2} color={active ? undefined : theme.color.textTertiary}
              style={active ? { stroke: 'url(#navGrad)' } : {}} />
            {active && (
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="navGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={theme.color.accentA} />
                    <stop offset="100%" stopColor={theme.color.accentB} />
                  </linearGradient>
                </defs>
              </svg>
            )}
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, background: active ? theme.color.gradient : 'none', WebkitBackgroundClip: active ? 'text' : 'unset', WebkitTextFillColor: active ? 'transparent' : 'unset' }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
