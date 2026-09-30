import React from 'react';
import { Home, Search, Library, PlusCircle, Heart, LogOut, Disc3, Music2, X } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

interface SideBarProps {
  currentPage: string;
  setPage: (page: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const SideBar: React.FC<SideBarProps> = ({
  currentPage,
  setPage,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { navigate } = useRouter();

  const handleNavClick = (pageName: string) => {
    setPage(pageName);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('user_name');
      localStorage.removeItem('username');
    } catch (e) {
      console.error(e);
    }
    navigate('/');
  };

  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Search', icon: Search },
    { name: 'Your Playlist', icon: Library },
    { name: 'Create Playlist', icon: PlusCircle },
    { name: 'Liked Songs', icon: Heart },
  ];

  const storedUsername = (() => {
    try {
      return localStorage.getItem('username') || localStorage.getItem('user_name') || 'Listener';
    } catch {
      return 'Listener';
    }
  })();

  const content = (
    <div className="flex flex-col h-full justify-between p-5 select-none">
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Disc3 className="w-6 h-6 animate-[spin_10s_linear_infinite]" />
            </div>
            <div>
              <span className="text-xl font-bold font-['Syne'] tracking-tight text-white block">
                Aura
              </span>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
                Music Studio
              </span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation list */}
        <div className="space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.name;
            return (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.name)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/20 text-white border-l-2 border-indigo-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Shortcut to Full Audio Player */}
        <div className="mt-8 pt-6 border-t border-white/5 space-y-2">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-500">
            Now Playing
          </div>
          <button
            onClick={() => navigate('/AudioPlayer')}
            className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors group"
          >
            <Music2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="truncate">Expanded Player</span>
          </button>
        </div>
      </div>

      {/* User profile & Sign out */}
      <div className="pt-4 border-t border-white/5">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-semibold text-xs shrink-0 uppercase">
              {storedUsername.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{storedUsername}</p>
              <p className="text-[10px] text-slate-500 truncate">Online</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            aria-label="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 sidebar-glass z-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[80vw] h-full sidebar-glass z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default SideBar;
