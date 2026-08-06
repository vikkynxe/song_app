// ─────────────────────────────────────────────────────────────
// Design tokens — "Sunset Vinyl" theme: near-black eggplant base,
// rose→amber gradient accent. Sora for display, Inter for UI/body.
// (Unchanged from the original mock UI — purely visual, no data.)
// ─────────────────────────────────────────────────────────────
export const theme = {
  color: {
    bg: '#0E0B12',
    bgElevated: '#141019',
    surface: '#18141F',
    surface2: '#221B2C',
    surfaceHover: '#2B2236',
    border: 'rgba(255,255,255,0.07)',
    borderStrong: 'rgba(255,255,255,0.14)',
    textPrimary: '#F6F2FA',
    textSecondary: '#A79CBB',
    textTertiary: '#6B6178',
    accentA: '#FF3D77', // rose
    accentB: '#FFB238', // amber
    gradient: 'linear-gradient(135deg, #FF3D77 0%, #FF7A59 55%, #FFB238 100%)',
    gradientSoft: 'linear-gradient(135deg, rgba(255,61,119,0.18) 0%, rgba(255,178,56,0.18) 100%)',
    success: '#3ED9A3',
  },
  font: {
    display: "'Sora', 'Segoe UI', sans-serif",
    body: "'Inter', 'Segoe UI', sans-serif",
  },
  radius: { sm: 10, md: 16, lg: 22, xl: 30, pill: 999 },
  space: (n) => `${n * 8}px`,
  shadow: {
    card: '0 8px 24px rgba(0,0,0,0.35)',
    glow: '0 12px 32px rgba(255,61,119,0.25)',
    nav: '0 -8px 32px rgba(0,0,0,0.45)',
  },
};

// Album-art placeholders: your /api/songs/ response has no artwork
// field, so we keep the gradient-cover approach from the mock UI.
// coverIdx is derived deterministically from the song id (see below)
// so a given song always gets the same cover.
const covers = [
  ['#FF3D77', '#FFB238'],
  ['#7B5CFF', '#22D3EE'],
  ['#22D3EE', '#3ED9A3'],
  ['#FF7A59', '#FFD23D'],
  ['#B455FF', '#FF3D77'],
  ['#3ED9A3', '#7B5CFF'],
  ['#FFD23D', '#FF3D77'],
  ['#22D3EE', '#7B5CFF'],
  ['#FF3D77', '#B455FF'],
  ['#FFB238', '#3ED9A3'],
  ['#7B5CFF', '#FF7A59'],
  ['#3ED9A3', '#22D3EE'],
];

export const cover = (i) => covers[((i % covers.length) + covers.length) % covers.length];

export const formatTime = (secs) => {
  const s = Math.max(0, Math.floor(secs || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
};

// ─────────────────────────────────────────────────────────────
// Live song data
//
// Backend contract (from api/views.py::get_song):
//   GET /api/songs/  ->  { "songs": [
//     { title, artist, year, album, match_score, url }, ...
//   ] }
//
// Known gaps vs. what this UI wants, and how we cope:
//   - no `id`            -> derive one (SHA-256 of "title|artist",
//                            matching the backend's hashing pattern)
//   - no `duration`       -> unknown; defaulted to 0. The progress
//                            bar / scrubber will render but can't
//                            reflect a real track length until the
//                            backend adds this.
//   - no `coverIdx`       -> derived from a simple hash of the id
//                            so covers are stable per song.
//   - no `liked`          -> defaults to false (no persistence yet).
//   - `url` is passed through as-is. As discussed, it currently
//     points at /media/<title>.mp3 which nothing serves — audio
//     playback will likely fail until the backend is fixed to
//     return a working /api/audio/<filename> style URL.
//   - the endpoint always returns the same fixed 5 recommended
//     songs (hardcoded seed track "sodakku"), ignores any query
//     params, so Search only filters within those 5 until the
//     backend supports real search/browse.
// ─────────────────────────────────────────────────────────────

const API_BASE = 'http://localhost:8000/api';

// Lightweight SHA-256 hex digest using SubtleCrypto (browser-native,
// mirrors the backend's hashlib.sha256(...).hexdigest() pattern).
async function sha256Hex(text) {
  const enc = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Stable small-int hash for picking a coverIdx from a string id.
function smallHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

async function normalizeSong(raw) {
  const title = raw.title || 'Unknown Title';
  const artist = raw.artist || 'Unknown Artist';
  const id = await sha256Hex(`${title}|${artist}`);

  return {
    id,
    title,
    artist,
    album: raw.album || 'Unknown Album',
    year: raw.year ?? null,
    matchScore: raw.match_score ?? null,
    duration: 0, // not provided by the backend yet
    coverIdx: smallHash(id),
    liked: false, // no like-state persistence from backend yet
    url: raw.url || null,
  };
}

// Fetches and normalizes the current song list from the backend.
// Throws on network failure so callers can show an error state.
export async function fetchSongs() {
  const response = await fetch(`${API_BASE}/songs/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch songs: ${response.status}`);
  }
  const data = await response.json();
  const rawSongs = Array.isArray(data?.songs) ? data.songs : [];
  return Promise.all(rawSongs.map(normalizeSong));
}

// ─────────────────────────────────────────────────────────────
// Data the backend doesn't expose yet. Kept as light placeholders
// so the richer screens (Search trending chips, Playlists, Profile)
// still render sensibly. Swap these out once real endpoints exist.
// ─────────────────────────────────────────────────────────────

export const searchTrending = [];

export const playlists = [
  { id: 'liked', name: 'Liked Songs', count: 0, coverIdx: 0 },
];

export const user = {
  name: 'Your Account',
  handle: '',
  avatarIdx: 0,
  stats: { playlists: 0, following: 0, followers: 0 },
};
