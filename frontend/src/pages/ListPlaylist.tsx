import React, { useState, useEffect } from 'react';
import { Library, Plus, Disc3, Music2, RefreshCw, AlertCircle, Play } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';
import { Playlist, GetPlaylistsResponse } from '../types';

interface ListPlaylistProps {
  onSelectPlaylist: (playlist: Playlist) => void;
  onNavigateCreate: () => void;
}

export const ListPlaylist: React.FC<ListPlaylistProps> = ({
  onSelectPlaylist,
  onNavigateCreate,
}) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const fetchPlaylists = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token') || '';

    const formData = new FormData();
    
    formData.append("hash_id", token);

    try {
      const response = await fetch(API_ENDPOINTS.getPlaylists, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: GetPlaylistsResponse = await response.json();

      let parsed: Playlist[] = [];

      // Preserve backend mapping for data.hash, data.name, data.tracks
      if (data && Array.isArray(data.hash)) {
        parsed = data.hash.map((h, i) => ({
          hash: h,
          name: data.name?.[i] || `Playlist ${i + 1}`,
          tracks: typeof data.tracks?.[i] === 'number' ? (data.tracks![i] as number) : 0,
          type: 'User Playlist',
        }));
      } else if (Array.isArray((data as any))) {
        parsed = (data as any).map((item: any, i: number) => ({
          hash: item.hash || item.token || item.id || `p-${i}`,
          name: item.name || item.playlistname || `Playlist ${i + 1}`,
          tracks: item.tracks || item.track_count || (Array.isArray(item.tracks) ? item.tracks.length : 0),
          type: 'User Playlist',
        }));
      } else if (data && data.playlists && Array.isArray(data.playlists)) {
        parsed = data.playlists;
      }

      setPlaylists(parsed);
    } catch (err: any) {
      console.error('Fetch playlists error:', err);
      setError(
        'Unable to load playlists from backend at http://localhost:8000. Please verify your backend server is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  // Gradient motifs for card backgrounds
  const gradients = [
    'from-indigo-600/30 via-slate-800 to-slate-900',
    'from-cyan-600/30 via-slate-800 to-slate-900',
    'from-purple-600/30 via-slate-800 to-slate-900',
    'from-emerald-600/30 via-slate-800 to-slate-900',
    'from-rose-600/30 via-slate-800 to-slate-900',
    'from-amber-600/30 via-slate-800 to-slate-900',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-['Syne'] text-white">
            Your Playlists
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Collections retrieved from your connected backend library
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPlaylists}
            disabled={loading}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 transition-colors disabled:opacity-50 cursor-pointer"
            title="Refresh playlists"
            aria-label="Refresh playlists"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onNavigateCreate}
            className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 animate-pulse"
            >
              <div className="w-full aspect-square rounded-xl bg-white/5" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-8 rounded-3xl bg-rose-500/[0.04] border border-rose-500/20 text-center max-w-lg mx-auto my-8">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-rose-200">
            Backend Connection Issue
          </h3>
          <p className="text-xs text-rose-300/80 mt-2 leading-relaxed">
            {error}
          </p>
          <button
            onClick={fetchPlaylists}
            className="mt-5 py-2 px-4 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-200 border border-rose-500/30 text-xs font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && playlists.length === 0 && (
        <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/5 text-center max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
            <Library className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-white">
            No Playlists Found
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            You don't have any playlists in your account yet. Upload a CSV file to create your first music playlist.
          </p>
          <button
            onClick={onNavigateCreate}
            className="mt-6 py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Playlist</span>
          </button>
        </div>
      )}

      {/* Playlist Grid */}
      {!loading && !error && playlists.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {playlists.map((playlist, idx) => {
            const grad = gradients[idx % gradients.length];
            return (
              <div
                key={playlist.hash || idx}
                onClick={() => onSelectPlaylist(playlist)}
                className="music-card-glass p-4 rounded-2xl cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-full aspect-square rounded-xl bg-gradient-to-br ${grad} border border-white/5 flex items-center justify-center relative overflow-hidden mb-3.5 group-hover:shadow-lg transition-all`}
                  >
                    <Disc3 className="w-16 h-16 text-white/20 group-hover:text-white/30 group-hover:scale-105 transition-all duration-300" />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                      <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                        <Play className="w-5 h-5 fill-current translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {playlist.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                    <span>{playlist.tracks} tracks</span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{playlist.type || 'Playlist'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ListPlaylist;
