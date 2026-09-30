export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  csrf: `${API_BASE_URL}/api/csrf/`,
  createUsers: `${API_BASE_URL}/api/create_users/`,
  signIn: `${API_BASE_URL}/api/sign_in/`,
  createPlaylist: `${API_BASE_URL}/api/create_playlist/`,
  getPlaylists: `${API_BASE_URL}/api/get_playlists/`,
  getSongs: `${API_BASE_URL}/api/get_songs/`,
  audio: (trackHash: string) => `${API_BASE_URL}/api/audio/${trackHash}`,
  getSongsByToken: (token: string) => `${API_BASE_URL}/api/get_songs/${token}`,
};

/**
 * Fetch CSRF token from the backend
 */
export async function fetchCsrfToken(): Promise<string | null> {
  try {
    const res = await fetch(API_ENDPOINTS.csrf, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (data && typeof data === 'object') {
      return (data as any).csrfToken || (data as any).csrf_token || (data as any).token || null;
    }
    return null;
  } catch (err) {
    console.warn('Could not fetch CSRF token from backend:', err);
    return null;
  }
}
