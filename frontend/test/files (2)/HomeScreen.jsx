import React from 'react';
import { Play, Bell } from 'lucide-react';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

// NOTE: the backend has no "recently played" / "recommended" /
// "continue listening" concepts yet — it returns one flat list of
// (currently 5, hardcoded) recommended songs. We reuse that same
// list across sections so the layout still has content, rather
// than inventing fake distinctions the API doesn't back.
export default function HomeScreen({ theme, cover, playSong, currentSong, songs, user }) {
  const [ua, ub] = cover(0);
  const displayName = user?.name || 'there';

  return (
    <div style={{ padding: '36px 48px 60px', maxWidth: 1180, margin: '0 auto', animation: 'fadeUp 0.35s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
        <div>
          <div style={{ fontSize: 14, color: theme.color.textSecondary, fontWeight: 500 }}>{greeting()}</div>
          <div style={{ fontFamily: theme.font.display, fontSize: 30, fontWeight: 700, marginTop: 2, letterSpacing: -0.5 }}>{displayName.split(' ')[0]}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${theme.color.border}`, background: theme.color.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bell size={17} color={theme.color.textSecondary} />
          </button>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: `linear-gradient(135deg, ${ua}, ${ub})`, border: `2px solid ${theme.color.borderStrong}` }} />
        </div>
      </div>

      <Section title="Recommended for you" theme={theme}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 20 }}>
          {songs.map((s) => (
            <SquareCard key={s.id} song={s} theme={theme} cover={cover} onPress={() => playSong(s)} active={currentSong?.id === s.id} />
          ))}
        </div>
      </Section>

      <Section title="All songs" theme={theme} last>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 24px' }}>
          {songs.map((s) => (
            <ListRow key={s.id} song={s} theme={theme} cover={cover} onPress={() => playSong(s)} active={currentSong?.id === s.id} />
          ))}
        </div>
      </Section>

      {songs.length === 0 && (
        <div style={{ textAlign: 'center', color: theme.color.textTertiary, fontSize: 13.5, padding: '60px 0' }}>
          No songs returned by the server yet.
        </div>
      )}
    </div>
  );
}

function Section({ title, children, theme, last }) {
  return (
    <div style={{ marginBottom: last ? 0 : 40 }}>
      <div style={{ fontFamily: theme.font.display, fontSize: 19, fontWeight: 700, marginBottom: 16, letterSpacing: -0.2 }}>{title}</div>
      {children}
    </div>
  );
}

function SquareCard({ song, theme, cover, onPress, active }) {
  const [a, b] = cover(song.coverIdx);
  return (
    <div onClick={onPress} style={{ cursor: 'pointer' }} className="hoverable-card">
      <div
        style={{
          width: '100%', aspectRatio: '1 / 1', borderRadius: theme.radius.md,
          background: `linear-gradient(135deg, ${a}, ${b})`,
          boxShadow: active ? theme.shadow.glow : theme.shadow.card,
          border: active ? `2px solid ${theme.color.accentA}` : '2px solid transparent',
          marginBottom: 10, position: 'relative',
        }}
      >
        <VinylMark />
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
      <div style={{ fontSize: 12, color: theme.color.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist}</div>
    </div>
  );
}

function ListRow({ song, theme, cover, onPress, active }) {
  const [a, b] = cover(song.coverIdx);
  return (
    <div
      onClick={onPress}
      style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px', borderRadius: theme.radius.sm,
        cursor: 'pointer', background: active ? theme.color.surface : 'transparent',
      }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 11, background: `linear-gradient(135deg, ${a}, ${b})`, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.title}</div>
        <div style={{ fontSize: 12, color: theme.color.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{song.artist} · {song.album}</div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onPress(); }}
        style={{
          width: 32, height: 32, borderRadius: '50%', border: `1px solid ${theme.color.border}`, background: theme.color.surface2,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        <Play size={13} fill={theme.color.textPrimary} color={theme.color.textPrimary} style={{ marginLeft: 1 }} />
      </button>
    </div>
  );
}

function VinylMark() {
  return (
    <div style={{ position: 'absolute', right: 10, bottom: 10, width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', border: '2px solid rgba(255,255,255,0.5)' }} />
  );
}
