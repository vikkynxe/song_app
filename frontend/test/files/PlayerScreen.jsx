import React, { useState } from 'react';
import {
  ChevronDown, Heart, Shuffle, Repeat, Repeat1, SkipBack, SkipForward,
  Play, Pause, ListMusic, Moon, MoreHorizontal,
} from 'lucide-react';
import { formatTime } from './mockData';

export default function PlayerScreen({
  theme, cover, song, progress, setProgress, isPlaying, togglePlay, goNext, goPrev,
  shuffle, setShuffle, repeat, setRepeat, likedIds, toggleLike, sleepTimer, setSleepTimer,
  onClose, onOpenQueue,
}) {
  const [showSleep, setShowSleep] = useState(false);
  const [a, b] = cover(song.coverIdx);
  const liked = likedIds.has(song.id);
  const pct = Math.min(100, (progress / song.duration) * 100);

  const cycleRepeat = () => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));

  const onScrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    setProgress(Math.floor(ratio * song.duration));
  };

  return (
    <div
      style={{
        height: 844 - 46, display: 'flex', flexDirection: 'column', padding: '4px 24px 30px',
        background: `radial-gradient(120% 60% at 50% 0%, rgba(255,61,119,0.18) 0%, rgba(14,11,18,0) 60%), ${theme.color.bg}`,
        animation: 'fadeUp 0.3s ease', position: 'relative',
      }}
    >
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
        <button onClick={onClose} style={navBtn(theme)}>
          <ChevronDown size={20} color={theme.color.textPrimary} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10.5, letterSpacing: 1.2, color: theme.color.textTertiary, fontWeight: 700, textTransform: 'uppercase' }}>Playing from album</div>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: theme.color.textSecondary }}>{song.album}</div>
        </div>
        <button style={navBtn(theme)}>
          <MoreHorizontal size={19} color={theme.color.textPrimary} />
        </button>
      </div>

      {/* artwork */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0 30px' }}>
        <div
          key={song.id}
          style={{
            width: 300, height: 300, borderRadius: 26,
            background: `linear-gradient(135deg, ${a}, ${b})`,
            boxShadow: `0 24px 60px -12px ${a}55, 0 8px 24px rgba(0,0,0,0.5)`,
            animation: 'pop 0.35s ease', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.25), transparent 55%)',
          }} />
          <div style={{
            position: 'absolute', right: 20, bottom: 20, width: 62, height: 62, borderRadius: '50%',
            background: 'rgba(10,8,12,0.55)', border: '3px solid rgba(255,255,255,0.55)',
            animation: isPlaying ? 'spin-slow 6s linear infinite' : 'none',
          }}>
            <div style={{ position: 'absolute', inset: '38%', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
          </div>
        </div>
      </div>

      {/* title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 }}>
        <div style={{ minWidth: 0, paddingRight: 12 }}>
          <div style={{ fontFamily: theme.font.display, fontSize: 21, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
          <div style={{ fontSize: 14, color: theme.color.textSecondary, marginTop: 3 }}>{song.artist}</div>
        </div>
        <button onClick={() => toggleLike(song.id)} style={{ ...navBtn(theme), flexShrink: 0 }}>
          <Heart size={19} fill={liked ? theme.color.accentA : 'none'} color={liked ? theme.color.accentA : theme.color.textPrimary} />
        </button>
      </div>

      {/* progress */}
      <div style={{ marginBottom: 8 }}>
        <div onClick={onScrub} style={{ height: 6, borderRadius: 3, background: theme.color.surface2, position: 'relative', cursor: 'pointer' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 3, background: theme.color.gradient }} />
          <div style={{ position: 'absolute', left: `calc(${pct}% - 7px)`, top: -4, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11.5, color: theme.color.textTertiary, fontVariantNumeric: 'tabular-nums' }}>
          <span>{formatTime(progress)}</span>
          <span>{formatTime(song.duration)}</span>
        </div>
      </div>

      {/* transport controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '18px 6px' }}>
        <button onClick={() => setShuffle((s) => !s)} style={{ ...iconBtn, color: shuffle ? theme.color.accentA : theme.color.textSecondary }}>
          <Shuffle size={19} />
        </button>
        <button onClick={goPrev} style={{ ...iconBtn, color: theme.color.textPrimary }}>
          <SkipBack size={24} fill={theme.color.textPrimary} />
        </button>
        <button
          onClick={togglePlay}
          style={{
            width: 70, height: 70, borderRadius: '50%', border: 'none', background: theme.color.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme.shadow.glow, cursor: 'pointer',
          }}
        >
          {isPlaying ? <Pause size={26} fill="#100810" color="#100810" /> : <Play size={26} fill="#100810" color="#100810" style={{ marginLeft: 3 }} />}
        </button>
        <button onClick={goNext} style={{ ...iconBtn, color: theme.color.textPrimary }}>
          <SkipForward size={24} fill={theme.color.textPrimary} />
        </button>
        <button onClick={cycleRepeat} style={{ ...iconBtn, color: repeat !== 'off' ? theme.color.accentA : theme.color.textSecondary }}>
          {repeat === 'one' ? <Repeat1 size={19} /> : <Repeat size={19} />}
        </button>
      </div>

      {/* bottom utility row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 20 }}>
        <button onClick={() => setShowSleep((v) => !v)} style={pillBtn(theme, !!sleepTimer)}>
          <Moon size={14} color={sleepTimer ? theme.color.accentB : theme.color.textSecondary} />
          <span>{sleepTimer ? `${sleepTimer} min` : 'Sleep timer'}</span>
        </button>
        <button onClick={onOpenQueue} style={pillBtn(theme, false)}>
          <ListMusic size={14} color={theme.color.textSecondary} />
          <span>Queue</span>
        </button>
      </div>

      {showSleep && (
        <div
          style={{
            position: 'absolute', left: 24, right: 24, bottom: 74, background: theme.color.surface2,
            border: `1px solid ${theme.color.borderStrong}`, borderRadius: theme.radius.md, padding: 10,
            boxShadow: theme.shadow.card, animation: 'fadeUp 0.2s ease', zIndex: 10,
          }}
        >
          <div style={{ fontSize: 11.5, color: theme.color.textTertiary, fontWeight: 600, padding: '4px 6px 8px' }}>STOP PLAYBACK AFTER</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {[15, 30, 45, 60].map((m) => (
              <button
                key={m}
                onClick={() => { setSleepTimer(m); setShowSleep(false); }}
                style={{
                  padding: '8px 12px', borderRadius: theme.radius.pill, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${sleepTimer === m ? theme.color.accentA : theme.color.border}`,
                  background: sleepTimer === m ? theme.color.gradientSoft : 'transparent',
                  color: theme.color.textPrimary,
                }}
              >
                {m} min
              </button>
            ))}
            <button
              onClick={() => { setSleepTimer(null); setShowSleep(false); }}
              style={{ padding: '8px 12px', borderRadius: theme.radius.pill, fontSize: 12.5, fontWeight: 600, border: `1px solid ${theme.color.border}`, background: 'transparent', color: theme.color.textTertiary }}
            >
              Off
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const iconBtn = { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const navBtn = (theme) => ({
  width: 36, height: 36, borderRadius: '50%', border: `1px solid ${theme.color.border}`, background: theme.color.surface,
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
});

const pillBtn = (theme, active) => ({
  display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px', borderRadius: theme.radius.pill,
  border: `1px solid ${active ? theme.color.accentB : theme.color.border}`, background: theme.color.surface,
  color: theme.color.textSecondary, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
});
