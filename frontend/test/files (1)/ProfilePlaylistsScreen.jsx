import React, { useState } from 'react';
import { Settings, Plus, MoreVertical, Music2 } from 'lucide-react';
import { playlists, user } from './mockData';

export default function ProfilePlaylistsScreen({ theme, cover }) {
  const [list, setList] = useState(playlists);
  const [ua, ub] = cover(user.avatarIdx);

  const addPlaylist = () => {
    const idx = list.length % 12;
    setList((l) => [{ id: `p${Date.now()}`, name: `New Playlist ${l.length + 1}`, count: 0, coverIdx: idx }, ...l]);
  };

  return (
    <div style={{ padding: '36px 48px 60px', maxWidth: 1180, margin: '0 auto', animation: 'fadeUp 0.35s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ fontFamily: theme.font.display, fontSize: 30, fontWeight: 700, letterSpacing: -0.5 }}>Profile</div>
        <button style={{ width: 40, height: 40, borderRadius: '50%', border: `1px solid ${theme.color.border}`, background: theme.color.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={17} color={theme.color.textSecondary} />
        </button>
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 22, padding: 26, borderRadius: theme.radius.lg,
          background: theme.color.surface, border: `1px solid ${theme.color.border}`, marginBottom: 36,
        }}
      >
        <div style={{ width: 92, height: 92, borderRadius: '50%', background: `linear-gradient(135deg, ${ua}, ${ub})`, border: `3px solid ${theme.color.borderStrong}`, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: theme.font.display, fontSize: 22, fontWeight: 700 }}>{user.name}</div>
          <div style={{ fontSize: 13.5, color: theme.color.textSecondary, marginBottom: 14 }}>{user.handle}</div>
          <div style={{ display: 'flex', gap: 32 }}>
            <Stat label="Playlists" value={user.stats.playlists} theme={theme} />
            <Stat label="Followers" value={user.stats.followers} theme={theme} />
            <Stat label="Following" value={user.stats.following} theme={theme} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ fontFamily: theme.font.display, fontSize: 19, fontWeight: 700 }}>Your playlists</div>
        <button
          onClick={addPlaylist}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: theme.radius.pill,
            border: 'none', background: theme.color.gradient, color: '#100810', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Plus size={14} strokeWidth={3} /> Create playlist
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 18 }}>
        {list.map((p) => (
          <PlaylistCard key={p.id} playlist={p} theme={theme} cover={cover} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, theme }) {
  return (
    <div>
      <div style={{ fontSize: 17, fontWeight: 700, fontFamily: theme.font.display }}>{value}</div>
      <div style={{ fontSize: 11.5, color: theme.color.textTertiary }}>{label}</div>
    </div>
  );
}

function PlaylistCard({ playlist, theme, cover }) {
  const [a, b] = cover(playlist.coverIdx);
  const isLiked = playlist.name === 'Liked Songs';
  return (
    <div style={{ padding: 14, borderRadius: theme.radius.md, background: theme.color.surface, border: `1px solid ${theme.color.border}` }}>
      <div
        style={{
          width: '100%', aspectRatio: '1 / 1', borderRadius: 12, marginBottom: 12,
          background: isLiked ? theme.color.gradient : `linear-gradient(135deg, ${a}, ${b})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: theme.shadow.card,
        }}
      >
        {isLiked && <Music2 size={30} color="#100810" />}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 6 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{playlist.name}</div>
          <div style={{ fontSize: 12, color: theme.color.textSecondary, marginTop: 2 }}>{playlist.count} songs</div>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
          <MoreVertical size={16} color={theme.color.textTertiary} />
        </button>
      </div>
    </div>
  );
}
