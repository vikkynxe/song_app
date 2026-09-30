import React, { useState, useEffect } from 'react';
import { Menu, Search, Heart, Music2, Sparkles, Disc3 } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { usePlayer } from '../context/PlayerContext';
import { Playlist, Song } from '../types';
import SideBar from '../components/SideBar';
import BottomPlayer from '../components/BottomPlayer';
import HomePageMain from './HomePageMain';
import ListPlaylist from './ListPlaylist';
import PlaylistSongs from './PlaylistSongs';
import CreatePlaylistPage from './CreatePlaylistPage';
import '../Style/HomePage.css';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const { likedSongHashes, playlist, playTrack } = usePlayer();

  // Authentication gate: redirect unauthenticated users to /
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn || isLoggedIn !== 'true') {
      navigate('/');
    }
  }, [navigate]);

  // Page switching state: Home, Search, Your Playlist, Create Playlist, Liked Songs
  const [page, setPage] = useState<string>('Home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Search input state (for filtering currently available tracks/playlists without inventing fake backend APIs)
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSelectPlaylist = (pl: Playlist) => {
    setSelectedPlaylist(pl);
  };

  const handleBackToPlaylists = () => {
    setSelectedPlaylist(null);
  };

  const handlePageChange = (newPage: string) => {
    setPage(newPage);
    setSelectedPlaylist(null);
  };

  // Render current content based on page state
  const renderContent = () => {
    if (selectedPlaylist && page === 'Your Playlist') {
      return (
        <PlaylistSongs
          playlist={selectedPlaylist}
          onBack={handleBackToPlaylists}
        />
      );
    }

    switch (page) {
      case 'Home':
        return <HomePageMain setPage={handlePageChange} />;

      case 'Your Playlist':
        return (
          <ListPlaylist
            onSelectPlaylist={handleSelectPlaylist}
            onNavigateCreate={() => handlePageChange('Create Playlist')}
          />
        );

      case 'Create Playlist':
        return (
          <CreatePlaylistPage
            onPlaylistCreated={() => handlePageChange('Your Playlist')}
          />
        );

      case 'Search':
        return (
          <div className="space-y-6 pb-12">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-['Syne'] text-white">
                Search
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Filter and locate tracks across your active session library
              </p>
            </div>

            <div className="relative max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by track name, artist, or album..."
                className="w-full glass-input text-slate-100 placeholder:text-slate-500 text-sm rounded-2xl py-3 pl-11 pr-4"
              />
            </div>

            {/* If there are tracks in queue/active playlist, filter them */}
            {playlist.length > 0 && searchQuery.trim() ? (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Matching Tracks ({
                    playlist.filter(
                      (s) =>
                        s.track_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.artist_names.toLowerCase().includes(searchQuery.toLowerCase())
                    ).length
                  })
                </h3>
                <div className="divide-y divide-white/5 rounded-2xl border border-white/5 overflow-hidden">
                  {playlist
                    .filter(
                      (s) =>
                        s.track_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.artist_names.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((song, i) => (
                      <div
                        key={song.track_hash || i}
                        onClick={() => playTrack(song)}
                        className="p-3.5 flex items-center justify-between hover:bg-white/5 cursor-pointer text-xs"
                      >
                        <div>
                          <p className="font-semibold text-white">{song.track_name}</p>
                          <p className="text-slate-400 text-[11px]">{song.artist_names}</p>
                        </div>
                        <span className="text-indigo-400 text-[11px] font-medium">Play</span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 text-center max-w-md mx-auto my-8">
                <Search className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-white">Find Music</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Load a playlist from your library or upload a CSV to search and stream tracks.
                </p>
              </div>
            )}
          </div>
        );

      case 'Liked Songs': {
        const likedSongsInCurrent = playlist.filter((s) =>
          likedSongHashes.includes(s.track_hash)
        );

        return (
          <div className="space-y-6 pb-12">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-['Syne'] text-white">
                Liked Songs
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Tracks you've marked as favorites during your listening sessions
              </p>
            </div>

            {likedSongsInCurrent.length > 0 ? (
              <div className="rounded-2xl border border-white/5 overflow-hidden divide-y divide-white/5">
                {likedSongsInCurrent.map((song, i) => (
                  <div
                    key={song.track_hash || i}
                    onClick={() => playTrack(song)}
                    className="p-4 flex items-center justify-between hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                        <Heart className="w-4 h-4 fill-current" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{song.track_name}</p>
                        <p className="text-xs text-slate-400">{song.artist_names}</p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-400 font-medium">Play</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/5 text-center max-w-md mx-auto my-8">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className="text-sm font-semibold text-white">No Liked Songs Yet</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Click the heart icon on any playing song or in a playlist to pin your favorite tracks here.
                </p>
              </div>
            )}
          </div>
        );
      }

      default:
        return <HomePageMain setPage={handlePageChange} />;
    }
  };

  return (
    <div className="home-layout">
      {/* Sidebar Navigation */}
      <SideBar
        currentPage={page}
        setPage={handlePageChange}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 header-glass px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-white/5"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline-block">
              {page}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange('Search')}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300">
              <Disc3 className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Views (with extra bottom padding for BottomPlayer) */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-28">
          {renderContent()}
        </main>

        {/* Fixed Bottom Music Player */}
        <BottomPlayer />
      </div>
    </div>
  );
};

export default HomePage;
