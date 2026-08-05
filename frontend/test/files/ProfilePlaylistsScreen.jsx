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
    <div style={{ padding: '4px 20px 100px', animation: 'fadeUp 0.35s ease' }}>
      {/* profile header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '6px 0 22px' }}>
        <div style={{ fontFamily: theme.font.display, fontSize: 24, fontWeight: 700 }}>Profile</div>
        <button style={{ width: 38, height: 38, borderRadius: '50%', border: `1px solid ${theme.color.border}`, background: theme.color.surface, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Settings size={17} color={theme.color.textSecondary} />
        </button>
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 16, padding: 18, borderRadius: theme.radius.lg,
          background: theme.color.surface, border: `1px solid ${theme.color.border}`, marginBottom: 24,
        }}
      >
        <div style={{ width: 68, height: 68, borderRadius: '50%', background: `linear-gradient(135deg, ${ua}, ${ub})`, border: `3px solid ${theme.color.borderStrong}`, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: theme.font.display, fontSize: 17, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
          <div style={{ fontSize: 12.5, color: theme.color.textSecondary, marginBottom: 10 }}>{user.handle}</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Stat label="Playlists" value={user.stats.playlists} theme={theme} />
            <Stat label="Followers" value={user.stats.followers} theme={theme} />
            <Stat label="Following" value={user.stats.following} theme={theme} />
          </div>
        </div>
      </div>

      {/* playlists header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontFamily: theme.font.display, fontSize: 17, fontWeight: 700 }}>Your playlists</div>
        <button
          onClick={addPlaylist}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: theme.radius.pill,
            border: 'none', background: theme.color.gradient, color: '#100810', fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
          }}
        >
          <Plus size={14} strokeWidth={3} /> Create
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
      <div style={{ fontSize: 14.5, fontWeight: 700, fontFamily: theme.font.display }}>{value}</div>
      <div style={{ fontSize: 10.5, color: theme.color.textTertiary }}>{label}</div>
    </div>
  );
}

function PlaylistCard({ playlist, theme, cover }) {
  const [a, b] = cover(playlist.coverIdx);
  const isLiked = playlist.name === 'Liked Songs';
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 14, padding: 10, borderRadius: theme.radius.md,
        background: theme.color.surface, border: `1px solid ${theme.color.border}`,
      }}
    >
      <div
        style={{
          width: 56, height: 56, borderRadius: 12, flexShrink: 0,
          background: isLiked ? theme.color.gradient : `linear-gradient(135deg, ${a}, ${b})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {isLiked && <Music2 size={22} color="#100810" />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{playlist.name}</div>
        <div style={{ fontSize: 12, color: theme.color.textSecondary, marginTop: 2 }}>{playlist.count} songs</div>
      </div>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
        <MoreVertical size={17} color={theme.color.textTertiary} />
      </button>
    </div>
  );
}
