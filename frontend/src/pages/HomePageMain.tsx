import React from 'react';
import { Play, Sparkles, Disc3, ArrowRight, Library, PlusCircle, Radio } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import '../Style/HomePage.css';

interface HomePageMainProps {
  setPage: (page: string) => void;
}

export const HomePageMain: React.FC<HomePageMainProps> = ({ setPage }) => {
  const { currentSong, isPlaying, togglePlay } = usePlayer();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const storedUsername = (() => {
    try {
      return localStorage.getItem('username') || localStorage.getItem('user_name') || 'Listener';
    } catch {
      return 'Listener';
    }
  })();

  const curatedShowcases = [
    {
      id: 'showcase-1',
      title: 'Midnight Synth Echoes',
      subtitle: 'Atmospheric electronic & darkwave textures',
      genre: 'Synthwave',
      gradient: 'from-indigo-600/40 via-purple-600/20 to-slate-900',
      accentColor: '#818cf8',
      tracks: '14 Tracks',
    },
    {
      id: 'showcase-2',
      title: 'Acoustic Solitude',
      subtitle: 'Intimate fingerstyle guitar & organic strings',
      genre: 'Acoustic',
      gradient: 'from-amber-600/30 via-orange-600/20 to-slate-900',
      accentColor: '#fbbf24',
      tracks: '18 Tracks',
    },
    {
      id: 'showcase-3',
      title: 'Nebula Ambient Drift',
      subtitle: 'Deep focus, generative space drones',
      genre: 'Ambient',
      gradient: 'from-cyan-600/30 via-teal-600/20 to-slate-900',
      accentColor: '#22d3ee',
      tracks: '12 Tracks',
    },
    {
      id: 'showcase-4',
      title: 'Late Night Loft Beats',
      subtitle: 'Tape saturated downtempo and jazzy chords',
      genre: 'Lo-Fi',
      gradient: 'from-rose-600/30 via-pink-600/20 to-slate-900',
      accentColor: '#fb7185',
      tracks: '20 Tracks',
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-indigo-950/70 via-slate-900/80 to-slate-950 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-3 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Audio Space</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-['Syne'] tracking-tight text-white">
              {getGreeting()}, {storedUsername}
            </h1>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">
              Explore your uploaded music library, load track playlists via CSV, and stream high fidelity audio with real-time waveform controls.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mt-6">
              <button
                onClick={() => setPage('Your Playlist')}
                className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
              >
                <Library className="w-4 h-4" />
                <span>Open Library</span>
              </button>
              <button
                onClick={() => setPage('Create Playlist')}
                className="py-2.5 px-5 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Upload CSV Playlist</span>
              </button>
            </div>
          </div>

          {/* Stylized Vinyl Disc Illustration */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-white/10 flex items-center justify-center shadow-2xl group">
              <div className="absolute inset-2 rounded-full border border-dashed border-white/10 animate-[spin_24s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-white/5" />
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                <Disc3 className="w-7 h-7" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Music Collection Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-['Syne'] text-white">
              Curated Soundscapes
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated sound styles to inspire your personal collections
            </p>
          </div>
          <button
            onClick={() => setPage('Your Playlist')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 transition-colors"
          >
            <span>View Library</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {curatedShowcases.map((card) => (
            <div
              key={card.id}
              className="music-card-glass p-5 rounded-2xl flex flex-col justify-between group cursor-pointer"
              onClick={() => setPage('Your Playlist')}
            >
              <div>
                <div
                  className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${card.gradient} border border-white/5 flex flex-col justify-between p-4 relative overflow-hidden mb-4`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                      {card.genre}
                    </span>
                    <Radio className="w-3.5 h-3.5 text-white/50" />
                  </div>

                  <div className="flex justify-between items-end">
                    <span className="text-xs text-slate-300 font-medium">{card.tracks}</span>
                    <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-indigo-500 group-hover:scale-110 transition-all shadow-md">
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Launchpad to User Playlists */}
      <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Ready to listen to your custom tracks?
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Load your saved playlists or import a new CSV track dataset
            </p>
          </div>
        </div>

        <button
          onClick={() => setPage('Your Playlist')}
          className="py-2 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-medium border border-indigo-500/30 transition-colors cursor-pointer shrink-0"
        >
          Open Playlists
        </button>
      </section>
    </div>
  );
};

export default HomePageMain;
