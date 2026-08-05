import React, { useMemo, useState } from 'react';
import { Search, X, Play } from 'lucide-react';
import { songs, searchTrending, formatTime } from './mockData';

export default function SearchScreen({ theme, cover, playSong, currentSong, isPlaying }) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return songs.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.album.toLowerCase().includes(q));
  }, [query]);

  return (
    <div style={{ padding: '4px 20px 100px', animation: 'fadeUp 0.35s ease' }}>
      <div style={{ fontFamily: theme.font.display, fontSize: 24, fontWeight: 700, margin: '6px 0 18px' }}>Search</div>

      {/* Large search bar */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10, background: theme.color.surface,
          border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.lg, padding: '14px 16px', marginBottom: 22,
        }}
      >
        <Search size={19} color={theme.color.textSecondary} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Songs, artists, albums..."
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none', color: theme.color.textPrimary,
            fontSize: 15, fontFamily: theme.font.body,
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background: theme.color.surface2, border: 'none', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={13} color={theme.color.textSecondary} />
          </button>
        )}
      </div>

      {!query && (
        <>
          <div style={{ fontFamily: theme.font.display, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Trending searches</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
            {searchTrending.map((t) => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                style={{
                  padding: '9px 14px', borderRadius: theme.radius.pill, border: `1px solid ${theme.color.border}`,
                  background: theme.color.surface, color: theme.color.textSecondary, fontSize: 12.5, fontWeight: 500,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ fontFamily: theme.font.display, fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Browse all</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {songs.slice(0, 6).map((s) => (
              <ResultCard key={s.id} song={s} theme={theme} cover={cover} onPress={() => playSong(s)} active={currentSong?.id === s.id && isPlaying} />
            ))}
          </div>
        </>
      )}

      {query && (
        <>
          <div style={{ fontSize: 12.5, color: theme.color.textTertiary, marginBottom: 12 }}>
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {results.map((s) => (
              <ResultCard key={s.id} song={s} theme={theme} cover={cover} onPress={() => playSong(s)} active={currentSong?.id === s.id && isPlaying} />
            ))}
            {results.length === 0 && (
              <div style={{ textAlign: 'center', color: theme.color.textTertiary, fontSize: 13, padding: '40px 0' }}>
                No matches. Try a different title, artist, or album.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function ResultCard({ song, theme, cover, onPress, active }) {
  const [a, b] = cover(song.coverIdx);
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: theme.radius.md,
        background: theme.color.surface, border: `1px solid ${active ? theme.color.accentA : theme.color.border}`,
      }}
    >
      <div style={{ width: 52, height: 52, borderRadius: 12, background: `linear-gradient(135deg, ${a}, ${b})`, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
        <div style={{ fontSize: 12, color: theme.color.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</div>
      </div>
      <div style={{ fontSize: 11, color: theme.color.textTertiary, flexShrink: 0 }}>{formatTime(song.duration)}</div>
      <button
        onClick={onPress}
        style={{
          width: 34, height: 34, borderRadius: '50%', border: 'none', flexShrink: 0,
          background: active ? theme.color.gradient : theme.color.surface2,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Play size={14} fill={active ? '#100810' : theme.color.textPrimary} color={active ? '#100810' : theme.color.textPrimary} style={{ marginLeft: 1 }} />
      </button>
    </div>
  );
}
