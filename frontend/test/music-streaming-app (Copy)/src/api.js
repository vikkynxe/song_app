const BASE_URL = 'http://localhost:8000';

// Django uses form-encoded POST + a hash_id token (from sign-in), not
// session cookies or Bearer tokens — so every authed call sends
// hash_id as form data, not a header.
async function postForm(path, fields) {
  const form = new FormData();
  Object.entries(fields).forEach(([k, v]) => form.append(k, v));
  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', body: form });
  return res.json();
}

export async function signIn(user_name, password) {
  const res = await fetch(`${BASE_URL}/sign-in/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_name, password }),
  });
  const data = await res.json();
  if (data.token) localStorage.setItem('hash_id', data.token); // this is your auth token going forward
  return data;
}

export async function fetchUserPlaylists() {
  const hash_id = localStorage.getItem('hash_id');
  return postForm('/get-data-for-user/', { hash_data: hash_id, type_of_hash: 'playlist' });
}

export async function fetchSongData(songHash) {
  return postForm('/get-data-for-user/', { hash_data: songHash, type_of_hash: 'song' });
}

function normalizeSong(raw, i) {
  return {
    id: raw.title + '-' + i,
    title: raw.title,
    artist: raw.artist,
    album: raw.album,
    duration: 0,
    audioUrl: raw.url,
    coverIdx: i % 12,
    liked: false,
  };
}

export async function fetchRecommended() {
  const res = await fetch(`${BASE_URL}/get-song/`);
  const data = await res.json();
  return data.songs.map(normalizeSong);
}

export function streamUrl(filename) {
  return `${BASE_URL}/stream/${encodeURIComponent(filename)}/`; // supports Range requests already — good for the progress bar/scrubbing
}

export async function createPlaylist(hash_id, playlistName, csvFile) {
  const form = new FormData();
  form.append('hash_id', hash_id);
  form.append('playlistname', playlistName);
  form.append('file', csvFile);
  const res = await fetch(`${BASE_URL}/create-playlist/`, { method: 'POST', body: form });
  return res.json();
}
