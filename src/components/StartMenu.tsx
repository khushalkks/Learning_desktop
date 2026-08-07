import React, { useRef, useEffect, useState } from 'react';
import { useOSStore } from '../store/useOSStore';
import { 
  User, FolderGit, Terminal, Send, Music, Award, FileText, 
  HelpCircle, Search, Power, RotateCw, LogOut, Code, Compass, Bot
} from 'lucide-react';

export const StartMenu: React.FC = () => {
  const {
    startMenuOpen,
    toggleStartMenu,
    openWindow,
    setLocked,
    setBooting,
    achievements,
    resetSystem,
    user
  } = useOSStore();

  const menuRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');

  // Close panel if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (startMenuOpen && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        // Don't close if clicked on the start button icon in the taskbar
        if (!target.closest('[title="Start Menu"]')) {
          toggleStartMenu(false);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [startMenuOpen]);

  if (!startMenuOpen) return null;

  const appItems = [
    { id: 'about', title: 'About Me', desc: 'Bio & Tech Stack', icon: User, color: 'text-indigo-400' },
    { id: 'projects', title: 'Projects Explorer', desc: 'View Work & Demos', icon: FolderGit, color: 'text-sky-400' },
    { id: 'terminal', title: 'Terminal Emulator', desc: 'CLI Shell Diagnostics', icon: Terminal, color: 'text-emerald-400' },
    { id: 'contact', title: 'Contact Center', desc: 'Send Email Message', icon: Send, color: 'text-pink-400' },
    { id: 'notes', title: 'Notes Pad', desc: 'Markdown Text Editor', icon: FileText, color: 'text-amber-400' },
    { id: 'music', title: 'Music Player', desc: 'Synthwave Mixtapes', icon: Music, color: 'text-fuchsia-400' },
    { id: 'research', title: 'Research Lab', desc: 'Experiments & Sandbox', icon: Code, color: 'text-cyan-400' },
    { id: 'games', title: 'Gaming Zone', desc: 'Play Retro Games', icon: Award, color: 'text-red-400' },
    { id: 'ai', title: 'AI Assistant', desc: 'Interact with virtual agent', icon: Bot, color: 'text-purple-400' },
  ];

  const filteredApps = appItems.filter(app => 
    app.title.toLowerCase().includes(search.toLowerCase()) || 
    app.desc.toLowerCase().includes(search.toLowerCase())
  );

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  const handlePowerAction = (action: 'logout' | 'restart' | 'shutdown') => {
    toggleStartMenu(false);
    if (action === 'logout') {
      setLocked(true);
    } else if (action === 'restart') {
      setBooting(true);
      setTimeout(() => {
        // Just trigger reload or reset states to booting
        window.location.reload();
      }, 500);
    } else if (action === 'shutdown') {
      if (confirm('Shut down KhushalOS? (This will reload the browser page to reboot)')) {
        window.location.reload();
      }
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed bottom-22 left-1/2 -translate-x-1/2 w-[480px] h-[550px] max-w-[95vw] glass-panel-heavy rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),var(--os-shadow-neon)] z-[100] animate-slide-up flex flex-col select-none text-slate-200 text-xs font-mono"
    >
      {/* Search Header */}
      <div className="p-4 border-b border-white/5 flex items-center space-x-3 bg-slate-950/60 rounded-t-[24px]">
        <Search size={16} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search apps, utilities, bio details..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent border-none text-sm outline-none text-slate-200 placeholder:text-slate-500 font-sans"
          autoFocus
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Apps Grid */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold font-display">
            Applications
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {filteredApps.map((app) => {
              const Icon = app.icon;
              return (
                <button
                  key={app.id}
                  onClick={() => {
                    openWindow(app.id);
                    toggleStartMenu(false);
                  }}
                  className="p-3 bg-white/5 hover:bg-indigo-600/20 hover:border-indigo-500/30 active:bg-indigo-600/30 border border-white/5 rounded-xl text-left flex items-start space-x-3 transition group"
                >
                  <div className={`p-2 bg-slate-900 rounded-lg group-hover:bg-slate-950 border border-white/5 transition`}>
                    <Icon size={16} className={`${app.color} group-hover:scale-110 transition`} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-200 group-hover:text-indigo-300 truncate font-sans text-sm">
                      {app.title}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">
                      {app.desc}
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredApps.length === 0 && (
              <div className="col-span-2 text-center py-8 text-slate-500">
                No applications matching search query
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Quick Profile & System Actions */}
        <div className="w-[170px] bg-slate-950/60 border-l border-white/5 p-4 flex flex-col justify-between">
          {/* User Details */}
          <div className="space-y-4">
            <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white/5 border border-white/5">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt="avatar" 
                  className="w-12 h-12 rounded-full border border-indigo-500/30 mb-2 shadow-neon-blue object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-2 shadow-neon-blue">
                  <User size={20} className="text-indigo-400" />
                </div>
              )}
              <span className="font-bold text-slate-200 text-[11px] truncate w-full">
                {user ? user.name : 'Khushal Kumar'}
              </span>
              <span className="text-[9px] text-indigo-400 font-mono mt-0.5 truncate w-full">
                {user ? user.email : 'Admin'}
              </span>
            </div>

            {/* Achievements Stats */}
            <div className="space-y-1 bg-slate-900/60 border border-white/5 rounded-xl p-2.5">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Achievements</div>
              <div className="flex justify-between items-end">
                <span className="font-bold text-slate-300">{unlockedCount} unlocked</span>
                <span className="text-yellow-500 text-[13px] font-display font-black">
                  {achievements.reduce((sum, a) => a.unlocked ? sum + a.points : sum, 0)}XP
                </span>
              </div>
            </div>
          </div>

          {/* Power Options */}
          <div className="space-y-2">
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">System Power</div>
            
            <button
              onClick={() => handlePowerAction('logout')}
              className="w-full py-1.5 px-2.5 hover:bg-slate-900 hover:text-indigo-400 border border-white/5 hover:border-indigo-500/30 rounded-lg flex items-center space-x-2 text-[10px] transition"
            >
              <LogOut size={12} className="text-indigo-400" />
              <span>LOCK SYSTEM</span>
            </button>

            <button
              onClick={() => handlePowerAction('restart')}
              className="w-full py-1.5 px-2.5 hover:bg-slate-900 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/30 rounded-lg flex items-center space-x-2 text-[10px] transition"
            >
              <RotateCw size={12} className="text-cyan-400" />
              <span>RESTART OS</span>
            </button>

            <button
              onClick={() => handlePowerAction('shutdown')}
              className="w-full py-1.5 px-2.5 hover:bg-rose-500/10 hover:text-rose-200 border border-rose-500/20 hover:border-rose-500 rounded-lg flex items-center space-x-2 text-[10px] transition"
            >
              <Power size={12} className="text-rose-500" />
              <span>SHUTDOWN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
