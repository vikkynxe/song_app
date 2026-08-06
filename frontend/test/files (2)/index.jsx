import React, { useEffect, useRef, useState } from 'react';
import { Home, Search as SearchIcon, ListMusic, User, Disc3 } from 'lucide-react';
import { theme, cover, playlists, user, fetchSongs } from './musicData';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import PlayerBar, { NowPlayingPanel } from './PlayerScreen';
import ProfilePlaylistsScreen from './ProfilePlaylistsScreen';
import QueueScreen from './QueueScreen';

const FONT_LINK_ID = 'sunset-vinyl-fonts';

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
      html, body, #root { height: 100%; margin: 0; }
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-thumb { background: #2B2236; border-radius: 8px; }
      ::-webkit-scrollbar-track { background: transparent; }
      @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes slideIn { from { transform: translateX(24px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      @keyframes pop { from { transform: scale(0.96); opacity: 0.7; } to { transform: scale(1); opacity: 1; } }
    `;
    document.head.appendChild(style);
  }, []);
}

export default function MusicPlayer() {
  useGlobalFonts();

  const [tab, setTab] = useState('home'); // home | search | playlists | profile
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);

  // Live data state
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [queue, setQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState('off');
  const [likedIds, setLikedIds] = useState(new Set());
  const [sleepTimer, setSleepTimer] = useState(null);

  const loadSongs = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchSongs();
      setSongs(data);
      setQueue(data);
      setCurrentSong((prev) => prev || data[0] || null);
      setLikedIds(new Set(data.filter((s) => s.liked).map((s) => s.id)));
    } catch (err) {
      console.error('Error fetching songs:', err);
      setLoadError('Could not load songs from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const tickRef = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      tickRef.current = setInterval(() => {
        setProgress((p) => {
          const duration = currentSong?.duration || 0;
          if (duration <= 0) return p; // unknown duration: don't fake progress
          return p + 1 >= duration ? 0 : p + 1;
        });
      }, 1000);
    }
    return () => clearInterval(tickRef.current);
  }, [isPlaying, currentSong]);

  const playSong = (song) => {
    setCurrentSong(song);
    setProgress(0);
    setIsPlaying(true);
  };
  const togglePlay = () => setIsPlaying((p) => !p);
  const goNext = () => {
    if (!currentSong || queue.length === 0) return;
    const idx = queue.findIndex((s) => s.id === currentSong.id);
    const next = queue[(idx + 1) % queue.length] || queue[0];
    if (next) { setCurrentSong(next); setProgress(0); setIsPlaying(true); }
  };
  const goPrev = () => {
    if (!currentSong || queue.length === 0) return;
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

  const shared = { theme, cover, likedIds, toggleLike, playSong, currentSong, isPlaying, songs };

  if (loading) {
    return (
      <div style={loadingWrapStyle(theme)}>
        <div style={{ fontFamily: theme.font.display, fontSize: 18, fontWeight: 600 }}>Loading songs…</div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={loadingWrapStyle(theme)}>
        <div style={{ fontFamily: theme.font.display, fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
          {loadError}
        </div>
        <div style={{ color: theme.color.textSecondary, fontSize: 13.5, marginBottom: 20 }}>
          Make sure the backend is running at http://localhost:8000
        </div>
        <button onClick={loadSongs} style={retryBtnStyle(theme)}>Retry</button>
      </div>
    );
  }

  if (!currentSong) {
    return (
      <div style={loadingWrapStyle(theme)}>
        <div style={{ fontFamily: theme.font.display, fontSize: 18, fontWeight: 600 }}>No songs available.</div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        background: theme.color.bg,
        color: theme.color.textPrimary,
        fontFamily: theme.font.body,
        overflow: 'hidden',
      }}
    >
      <Sidebar tab={tab} setTab={setTab} theme={theme} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {tab === 'home' && <HomeScreen {...shared} />}
          {tab === 'search' && <SearchScreen {...shared} />}
          {(tab === 'playlists' || tab === 'profile') && (
            <ProfilePlaylistsScreen {...shared} playlists={playlists} user={user} focus={tab} />
          )}
        </div>

        <PlayerBar
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
          queueOpen={queueOpen}
          onToggleQueue={() => setQueueOpen((v) => !v)}
          onExpand={() => setNowPlayingOpen(true)}
        />
      </div>

      {queueOpen && (
        <QueueScreen
          {...shared}
          queue={queue}
          removeFromQueue={removeFromQueue}
          clearQueue={clearQueue}
          reorderQueue={reorderQueue}
          onClose={() => setQueueOpen(false)}
        />
      )}

      {nowPlayingOpen && (
        <NowPlayingOverlay
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
          onClose={() => setNowPlayingOpen(false)}
          onOpenQueue={() => { setNowPlayingOpen(false); setQueueOpen(true); }}
        />
      )}
    </div>
  );
}

function loadingWrapStyle(theme) {
  return {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: theme.color.bg,
    color: theme.color.textPrimary,
    fontFamily: theme.font.body,
    textAlign: 'center',
    padding: 20,
  };
}

function retryBtnStyle(theme) {
  return {
    padding: '10px 22px',
    borderRadius: theme.radius.pill,
    border: 'none',
    background: theme.color.gradient,
    color: '#100810',
    fontWeight: 700,
    fontSize: 13,
    cursor: 'pointer',
  };
}

function Sidebar({ tab, setTab, theme }) {
  const items = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'search', label: 'Search', Icon: SearchIcon },
    { id: 'playlists', label: 'Playlists', Icon: ListMusic },
    { id: 'profile', label: 'Profile', Icon: User },
  ];
  return (
    <div
      style={{
        width: 248, flexShrink: 0, height: '100vh', background: theme.color.bgElevated,
        borderRight: `1px solid ${theme.color.border}`, display: 'flex', flexDirection: 'column', padding: '26px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', marginBottom: 34 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: theme.color.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Disc3 size={18} color="#100810" />
        </div>
        <span style={{ fontFamily: theme.font.display, fontWeight: 700, fontSize: 17, letterSpacing: -0.3 }}>Sunset</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderRadius: theme.radius.sm,
                border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14.5, fontWeight: active ? 700 : 500,
                background: active ? theme.color.surface : 'transparent',
                color: active ? theme.color.textPrimary : theme.color.textSecondary,
              }}
            >
              <Icon size={19} color={active ? theme.color.accentA : theme.color.textSecondary} />
              {label}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 'auto', padding: 14, borderRadius: theme.radius.md, background: theme.color.gradientSoft, border: `1px solid ${theme.color.border}` }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>Go Premium</div>
        <div style={{ fontSize: 11.5, color: theme.color.textSecondary, lineHeight: 1.5 }}>Lossless audio, offline listening, zero interruptions.</div>
      </div>
    </div>
  );
}

function NowPlayingOverlay(props) {
  const { theme, onClose } = props;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, left: 248, background: `radial-gradient(120% 70% at 50% 0%, rgba(255,61,119,0.16) 0%, rgba(14,11,18,0) 55%), ${theme.color.bg}f2`,
        backdropFilter: 'blur(6px)', zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeUp 0.25s ease',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <NowPlayingPanel {...props} />
    </div>
  );
}
