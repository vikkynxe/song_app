import React, { useState } from 'react';
import { ChevronDown, GripVertical, X, Trash2 } from 'lucide-react';
import { formatTime } from './mockData';

export default function QueueScreen({ theme, cover, currentSong, isPlaying, queue, removeFromQueue, clearQueue, reorderQueue, onClose }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const [a, b] = cover(currentSong.coverIdx);

  const handleDrop = (idx) => {
    if (dragIdx !== null && dragIdx !== idx) reorderQueue(dragIdx, idx);
    setDragIdx(null);
    setOverIdx(null);
  };

  return (
    <div style={{ height: 844 - 46, display: 'flex', flexDirection: 'column', padding: '4px 20px 24px', animation: 'fadeUp 0.3s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 0 18px' }}>
        <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: '50%', border: `1px solid ${theme.color.border}`, background: theme.color.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronDown size={20} />
        </button>
        <div style={{ fontFamily: theme.font.display, fontSize: 16, fontWeight: 700 }}>Queue</div>
        <button
          onClick={clearQueue}
          style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: theme.color.textSecondary, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}
        >
          <Trash2 size={14} /> Clear
        </button>
      </div>

      {/* now playing pinned */}
      <div style={{ fontSize: 11, letterSpacing: 1, fontWeight: 700, color: theme.color.textTertiary, marginBottom: 10 }}>NOW PLAYING</div>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: theme.radius.md,
          background: theme.color.gradientSoft, border: `1px solid ${theme.color.accentA}`, marginBottom: 24,
        }}
      >
        <div style={{ width: 50, height: 50, borderRadius: 10, background: `linear-gradient(135deg, ${a}, ${b})`, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentSong.title}</div>
          <div style={{ fontSize: 12, color: theme.color.textSecondary }}>{currentSong.artist}</div>
        </div>
        <PlayingBars theme={theme} active={isPlaying} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 11, letterSpacing: 1, fontWeight: 700, color: theme.color.textTertiary }}>UP NEXT · {queue.length}</div>
        <div style={{ fontSize: 11, color: theme.color.textTertiary }}>Hold & drag to reorder</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {queue.map((s, idx) => {
          const [ca, cb] = cover(s.coverIdx);
          const isOver = overIdx === idx && dragIdx !== null && dragIdx !== idx;
          return (
            <div
              key={s.id}
              draggable
              onDragStart={() => setDragIdx(idx)}
              onDragOver={(e) => { e.preventDefault(); setOverIdx(idx); }}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: theme.radius.md,
                background: theme.color.surface,
                border: `1px solid ${isOver ? theme.color.accentB : theme.color.border}`,
                opacity: dragIdx === idx ? 0.4 : 1,
                transform: isOver ? 'scale(1.015)' : 'scale(1)',
                transition: 'transform 0.15s ease, opacity 0.15s ease, border-color 0.15s ease',
                cursor: 'grab',
              }}
            >
              <GripVertical size={16} color={theme.color.textTertiary} style={{ flexShrink: 0 }} />
              <div style={{ width: 44, height: 44, borderRadius: 9, background: `linear-gradient(135deg, ${ca}, ${cb})`, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.title}</div>
                <div style={{ fontSize: 11.5, color: theme.color.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.artist}</div>
              </div>
              <span style={{ fontSize: 11, color: theme.color.textTertiary, flexShrink: 0 }}>{formatTime(s.duration)}</span>
              <button
                onClick={() => removeFromQueue(s.id)}
                style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: theme.color.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
              >
                <X size={13} color={theme.color.textSecondary} />
              </button>
            </div>
          );
        })}

        {queue.length === 0 && (
          <div style={{ textAlign: 'center', color: theme.color.textTertiary, fontSize: 13, padding: '60px 20px' }}>
            Queue is empty. Add songs from Home or Search to line up what plays next.
          </div>
        )}
      </div>
    </div>
  );
}

function PlayingBars({ theme, active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 16, flexShrink: 0 }}>
      {[6, 12, 9].map((h, i) => (
        <div
          key={i}
          style={{
            width: 3, height: active ? h : 4, borderRadius: 2, background: theme.color.gradient,
            transition: 'height 0.3s ease', animation: active ? `pulseBar 0.9s ease-in-out ${i * 0.15}s infinite alternate` : 'none',
          }}
        />
      ))}
      <style>{`@keyframes pulseBar { from { transform: scaleY(0.5); } to { transform: scaleY(1); } }`}</style>
    </div>
  );
}
