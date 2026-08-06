import React, { useEffect, useRef, useState } from 'react';
import {
  Heart, Shuffle, Repeat, Repeat1, SkipBack, SkipForward, Play, Pause,
  ListMusic, Moon, Maximize2, Volume2, X,
} from 'lucide-react';
import { formatTime } from './musicData';

// ── Persistent bottom bar — always visible under the main content ──
// NOTE: song.url currently comes straight from the backend as-is
// (e.g. http://localhost:8000/media/<title>.mp3) which nothing
// serves yet — see musicData.js header comment. Playback will
// likely fail with a network/404 error until that's fixed
// server-side; we surface that failure quietly via onError rather
// than crashing the UI.
export default function PlayerBar({
  theme, cover, song, progress, setProgress, isPlaying, togglePlay, goNext, goPrev,
  likedIds, toggleLike, onToggleQueue, queueOpen, onExpand,
}) {
  const [a, b] = cover(song.coverIdx);
  const liked = likedIds.has(song.id);
  const duration = song.duration || 0;
  const pct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current || !song?.url) return;
    audioRef.current.src = song.url;
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.warn('Playback failed:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song?.id]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => console.warn('Playback failed:', err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const onScrub = (e) => {
    if (duration <= 0) return; // unknown duration, scrubbing not meaningful yet
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const newTime = ratio * duration;
    setProgress(Math.floor(newTime));
    if (audioRef.current) audioRef.current.currentTime = newTime;
  };

  return (
    <div
      style={{
        height: 92, flexShrink: 0, display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center',
        padding: '0 20px', background: theme.color.bgElevated, borderTop: `1px solid ${theme.color.border}`,
        boxShadow: theme.shadow.nav,
      }}
    >
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onEnded={goNext}
        onError={() => console.warn('Audio failed to load for:', song.url)}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <div
          onClick={onExpand}
          style={{
            width: 56, height: 56, borderRadius: 10, background: `linear-gradient(135deg, ${a}, ${b})`,
            flexShrink: 0, cursor: 'pointer', boxShadow: theme.shadow.card,
          }}
        />
        <div style={{ minWidth: 0, cursor: 'pointer' }} onClick={onExpand}>
          <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
          <div style={{ fontSize: 12, color: theme.color.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</div>
        </div>
        <button onClick={() => toggleLike(song.id)} style={{ ...iconBtnSm, flexShrink: 0 }}>
          <Heart size={16} fill={liked ? theme.color.accentA : 'none'} color={liked ? theme.color.accentA : theme.color.textSecondary} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, width: 480, maxWidth: '40vw' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <button onClick={goPrev} style={iconBtnSm}><SkipBack size={17} fill={theme.color.textPrimary} color={theme.color.textPrimary} /></button>
          <button
            onClick={togglePlay}
            style={{
              width: 40, height: 40, borderRadius: '50%', border: 'none', background: theme.color.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: theme.shadow.glow,
            }}
          >
            {isPlaying ? <Pause size={16} fill="#100810" color="#100810" /> : <Play size={16} fill="#100810" color="#100810" style={{ marginLeft: 2 }} />}
          </button>
          <button onClick={goNext} style={iconBtnSm}><SkipForward size={17} fill={theme.color.textPrimary} color={theme.color.textPrimary} /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
          <span style={{ fontSize: 10.5, color: theme.color.textTertiary, width: 34, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{formatTime(progress)}</span>
          <div onClick={onScrub} style={{ flex: 1, height: 5, borderRadius: 3, background: theme.color.surface2, position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 3, background: theme.color.gradient }} />
            <div style={{ position: 'absolute', left: `calc(${pct}% - 6px)`, top: -3, width: 11, height: 11, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
          </div>
          <span style={{ fontSize: 10.5, color: theme.color.textTertiary, width: 34, fontVariantNumeric: 'tabular-nums' }}>{duration > 0 ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
        <button onClick={onToggleQueue} style={{ ...iconBtnSm, background: queueOpen ? theme.color.surface2 : 'transparent' }}>
          <ListMusic size={17} color={queueOpen ? theme.color.accentA : theme.color.textSecondary} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: 90 }}>
          <Volume2 size={16} color={theme.color.textSecondary} />
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: theme.color.surface2, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '70%', borderRadius: 2, background: theme.color.textSecondary }} />
          </div>
        </div>
        <button onClick={onExpand} style={iconBtnSm}><Maximize2 size={16} color={theme.color.textSecondary} /></button>
      </div>
    </div>
  );
}

// ── Expanded "Now Playing" panel — large artwork focus view ──
// Shares playback state/progress with PlayerBar via props (the
// single <audio> element lives in PlayerBar); this panel is a
// read/control surface on top of that same state.
export function NowPlayingPanel({
  theme, cover, song, progress, setProgress, isPlaying, togglePlay, goNext, goPrev,
  shuffle, setShuffle, repeat, setRepeat, likedIds, toggleLike, sleepTimer, setSleepTimer,
  onClose, onOpenQueue,
}) {
  const [showSleep, setShowSleep] = useState(false);
  const [a, b] = cover(song.coverIdx);
  const liked = likedIds.has(song.id);
  const duration = song.duration || 0;
  const pct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;
  const cycleRepeat = () => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));

  const onScrub = (e) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setProgress(Math.floor(ratio * duration));
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: 880, maxWidth: '90vw', display: 'grid', gridTemplateColumns: '340px 1fr', gap: 56,
        background: theme.color.surface, border: `1px solid ${theme.color.borderStrong}`, borderRadius: theme.radius.xl,
        padding: 44, boxShadow: '0 40px 100px rgba(0,0,0,0.55)', position: 'relative', animation: 'pop 0.3s ease',
      }}
    >
      <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, ...iconBtnSm }}>
        <X size={18} color={theme.color.textSecondary} />
      </button>

      <div
        key={song.id}
        style={{
          width: 340, height: 340, borderRadius: 24, background: `linear-gradient(135deg, ${a}, ${b})`,
          boxShadow: `0 24px 60px -12px ${a}55, 0 8px 24px rgba(0,0,0,0.5)`, position: 'relative', overflow: 'hidden', animation: 'pop 0.35s ease',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25), transparent 55%)' }} />
        <div style={{
          position: 'absolute', right: 22, bottom: 22, width: 70, height: 70, borderRadius: '50%',
          background: 'rgba(10,8,12,0.55)', border: '3px solid rgba(255,255,255,0.55)',
          animation: isPlaying ? 'spin-slow 6s linear infinite' : 'none',
        }}>
          <div style={{ position: 'absolute', inset: '38%', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.2, color: theme.color.textTertiary, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>Now Playing · {song.album}</div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: theme.font.display, fontSize: 34, fontWeight: 700, letterSpacing: -0.5 }}>{song.title}</div>
            <div style={{ fontSize: 16, color: theme.color.textSecondary, marginTop: 6 }}>{song.artist}</div>
          </div>
          <button onClick={() => toggleLike(song.id)} style={{ ...navBtn(theme), flexShrink: 0 }}>
            <Heart size={19} fill={liked ? theme.color.accentA : 'none'} color={liked ? theme.color.accentA : theme.color.textPrimary} />
          </button>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div onClick={onScrub} style={{ height: 6, borderRadius: 3, background: theme.color.surface2, position: 'relative', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 3, background: theme.color.gradient }} />
            <div style={{ position: 'absolute', left: `calc(${pct}% - 7px)`, top: -4, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: theme.color.textTertiary, fontVariantNumeric: 'tabular-nums' }}>
            <span>{formatTime(progress)}</span>
            <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, margin: '20px 0' }}>
          <button onClick={() => setShuffle((s) => !s)} style={{ ...iconBtn, color: shuffle ? theme.color.accentA : theme.color.textSecondary }}>
            <Shuffle size={20} />
          </button>
          <button onClick={goPrev} style={{ ...iconBtn, color: theme.color.textPrimary }}><SkipBack size={26} fill={theme.color.textPrimary} /></button>
          <button
            onClick={togglePlay}
            style={{
              width: 66, height: 66, borderRadius: '50%', border: 'none', background: theme.color.gradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme.shadow.glow, cursor: 'pointer',
            }}
          >
            {isPlaying ? <Pause size={24} fill="#100810" color="#100810" /> : <Play size={24} fill="#100810" color="#100810" style={{ marginLeft: 3 }} />}
          </button>
          <button onClick={goNext} style={{ ...iconBtn, color: theme.color.textPrimary }}><SkipForward size={26} fill={theme.color.textPrimary} /></button>
          <button onClick={cycleRepeat} style={{ ...iconBtn, color: repeat !== 'off' ? theme.color.accentA : theme.color.textSecondary }}>
            {repeat === 'one' ? <Repeat1 size={20} /> : <Repeat size={20} />}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, position: 'relative' }}>
          <button onClick={() => setShowSleep((v) => !v)} style={pillBtn(theme, !!sleepTimer)}>
            <Moon size={14} color={sleepTimer ? theme.color.accentB : theme.color.textSecondary} />
            <span>{sleepTimer ? `${sleepTimer} min` : 'Sleep timer'}</span>
          </button>
          <button onClick={onOpenQueue} style={pillBtn(theme, false)}>
            <ListMusic size={14} color={theme.color.textSecondary} />
            <span>Open queue</span>
          </button>

          {showSleep && (
            <div style={{
              position: 'absolute', left: 0, bottom: 46, background: theme.color.surface2, border: `1px solid ${theme.color.borderStrong}`,
              borderRadius: theme.radius.md, padding: 10, boxShadow: theme.shadow.card, animation: 'fadeUp 0.2s ease', zIndex: 10, width: 260,
            }}>
              <div style={{ fontSize: 11, color: theme.color.textTertiary, fontWeight: 600, padding: '4px 6px 8px' }}>STOP PLAYBACK AFTER</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {[15, 30, 45, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSleepTimer(m); setShowSleep(false); }}
                    style={{
                      padding: '8px 12px', borderRadius: theme.radius.pill, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      border: `1px solid ${sleepTimer === m ? theme.color.accentA : theme.color.border}`,
                      background: sleepTimer === m ? theme.color.gradientSoft : 'transparent', color: theme.color.textPrimary,
                    }}
                  >
                    {m} min
                  </button>
                ))}
                <button
                  onClick={() => { setSleepTimer(null); setShowSleep(false); }}
                  style={{ padding: '8px 12px', borderRadius: theme.radius.pill, fontSize: 12, fontWeight: 600, border: `1px solid ${theme.color.border}`, background: 'transparent', color: theme.color.textTertiary }}
                >
                  Off
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const iconBtnSm = {
  width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

const navBtn = (theme) => ({
  width: 38, height: 38, borderRadius: '50%', border: `1px solid ${theme.color.border}`, background: theme.color.surface2,
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
});

const pillBtn = (theme, active) => ({
  display: 'flex', alignItems: 'center', gap: 7, padding: '9px 14px', borderRadius: theme.radius.pill,
  border: `1px solid ${active ? theme.color.accentB : theme.color.border}`, background: theme.color.surface2,
  color: theme.color.textSecondary, fontSize: 12, fontWeight: 600, cursor: 'pointer',
});
