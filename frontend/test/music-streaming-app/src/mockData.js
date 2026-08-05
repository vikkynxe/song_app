// ─────────────────────────────────────────────────────────────
// Design tokens — "Sunset Vinyl" theme: near-black eggplant base,
// rose→amber gradient accent (evokes a record label spinning
// under stage light). Sora for display, Inter for UI/body.
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

// Album-art placeholders: since no real imagery is provided, each
// "cover" is a signature two-stop gradient so every card still reads
// as a distinct, high-quality piece of artwork at a glance.
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

export const cover = (i) => covers[i % covers.length];

export const songs = [
  { id: 's1', title: 'Midnight Static', artist: 'Nova Bloom', album: 'Afterglow', duration: 214, coverIdx: 0, liked: true },
  { id: 's2', title: 'Glass Horizon', artist: 'Kilo Vale', album: 'Glass Horizon EP', duration: 187, coverIdx: 1, liked: false },
  { id: 's3', title: 'Velvet Skyline', artist: 'Aura Ray', album: 'Night Drive', duration: 232, coverIdx: 2, liked: true },
  { id: 's4', title: 'Paper Planets', artist: 'Sable & June', album: 'Paper Planets', duration: 198, coverIdx: 3, liked: false },
  { id: 's5', title: 'Amber Static', artist: 'Nova Bloom', album: 'Afterglow', duration: 205, coverIdx: 4, liked: false },
  { id: 's6', title: 'Low Light', artist: 'Cassian Reed', album: 'Low Light', duration: 176, coverIdx: 5, liked: true },
  { id: 's7', title: 'Echo Chamber', artist: 'Tidewell', album: 'Echo Chamber', duration: 241, coverIdx: 6, liked: false },
  { id: 's8', title: 'Golden Hour Drift', artist: 'Aura Ray', album: 'Night Drive', duration: 223, coverIdx: 7, liked: false },
  { id: 's9', title: 'Neon Wilderness', artist: 'Kilo Vale', album: 'Glass Horizon EP', duration: 190, coverIdx: 8, liked: true },
  { id: 's10', title: 'Static & Bloom', artist: 'Sable & June', album: 'Paper Planets', duration: 211, coverIdx: 9, liked: false },
  { id: 's11', title: 'Slow Fade', artist: 'Cassian Reed', album: 'Low Light', duration: 199, coverIdx: 10, liked: false },
  { id: 's12', title: 'Violet Tape Loop', artist: 'Tidewell', album: 'Echo Chamber', duration: 227, coverIdx: 11, liked: true },
];

export const byId = (id) => songs.find((s) => s.id === id);

export const recentlyPlayed = [songs[0], songs[2], songs[5], songs[8], songs[11]];
export const recommended = [songs[1], songs[3], songs[6], songs[9], songs[7]];
export const continueListening = [
  { ...songs[4], progress: 0.62 },
  { ...songs[10], progress: 0.24 },
];

export const searchTrending = ['Nova Bloom', 'Night Drive', 'lofi focus', 'Aura Ray', 'Echo Chamber'];

export const playlists = [
  { id: 'p1', name: 'Late Night Drive', count: 42, coverIdx: 0 },
  { id: 'p2', name: 'Deep Focus', count: 68, coverIdx: 5 },
  { id: 'p3', name: 'Sunday Soft Pop', count: 27, coverIdx: 3 },
  { id: 'p4', name: 'Liked Songs', count: 134, coverIdx: 8 },
  { id: 'p5', name: 'Workout Pulse', count: 51, coverIdx: 6 },
];

export const user = {
  name: 'Maya Chen',
  handle: '@mayachen',
  avatarIdx: 2,
  stats: { playlists: 12, following: 84, followers: 231 },
};

export const initialQueue = [songs[3], songs[6], songs[9], songs[1], songs[7], songs[10]];

export const formatTime = (secs) => {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};
