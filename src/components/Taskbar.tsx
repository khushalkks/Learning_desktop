import React from 'react';
import { useOSStore } from '../store/useOSStore';
import { 
  User, FolderGit, Terminal, Send, Music, Award, FileText, 
  Settings, Grid, LayoutGrid, Code, Bot
} from 'lucide-react';

export const Taskbar: React.FC = () => {
  const {
    windows,
    activeWindowId,
    startMenuOpen,
    toggleStartMenu,
    openWindow,
    minimizeWindow,
    focusWindow,
  } = useOSStore();

  const dockApps = [
    { id: 'about', title: 'About Me', icon: User, color: 'hover:text-indigo-400 border-indigo-500/30' },
    { id: 'projects', title: 'Projects Explorer', icon: FolderGit, color: 'hover:text-sky-400 border-sky-500/30' },
    { id: 'terminal', title: 'Terminal Emulator', icon: Terminal, color: 'hover:text-emerald-400 border-emerald-500/30' },
    { id: 'contact', title: 'Contact Center', icon: Send, color: 'hover:text-pink-400 border-pink-500/30' },
    { id: 'notes', title: 'Notes Pad', icon: FileText, color: 'hover:text-amber-400 border-amber-500/30' },
    { id: 'music', title: 'Music Player', icon: Music, color: 'hover:text-fuchsia-400 border-fuchsia-500/30' },
    { id: 'research', title: 'Research Lab', icon: Code, color: 'hover:text-cyan-400 border-cyan-500/30' },
    { id: 'games', title: 'Gaming Zone', icon: Award, color: 'hover:text-red-400 border-red-500/30' },
    { id: 'ai', title: 'AI Assistant', icon: Bot, color: 'hover:text-purple-400 border-purple-500/30 shadow-neon-blue' },
    { id: 'settings', title: 'Settings', icon: Settings, color: 'hover:text-slate-400 border-slate-500/30' },
  ];

  const handleAppClick = (id: string) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;

    if (!win.isOpen) {
      openWindow(id);
    } else if (win.isMinimized) {
      focusWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 select-none px-4">
      
      {/* Floating macOS-style glass dock */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5 bg-slate-950/70 backdrop-blur-xl px-4 py-2 rounded-3xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5),var(--os-shadow-neon)] transition-all duration-300">
        
        {/* Start Button */}
        <button
          onClick={() => toggleStartMenu()}
          title="Start Menu"
          className={`p-2.5 rounded-2xl border transition-all duration-250 ease-out hover:scale-115 hover:-translate-y-1.5 ${
            startMenuOpen 
              ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]' 
              : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 active:scale-95 text-indigo-400 hover:text-indigo-300'
          }`}
        >
          <LayoutGrid size={18} className={startMenuOpen ? 'animate-spin-slow' : ''} />
        </button>

        {/* Separator line */}
        <div className="w-px h-6 bg-white/10 mx-1" />

        {/* App Shortcuts */}
        {dockApps.map((app) => {
          const win = windows.find((w) => w.id === app.id);
          const isOpen = win?.isOpen;
          const isFocused = win?.isOpen && !win?.isMinimized && activeWindowId === app.id;
          const Icon = app.icon;

          return (
            <div key={app.id} className="relative group">
              <button
                onClick={() => handleAppClick(app.id)}
                title={app.title}
                className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center transition-all duration-250 ease-out active:scale-90 hover:scale-115 hover:-translate-y-1.5 ${
                  isFocused
                    ? 'bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                    : isOpen
                    ? 'bg-white/10 border-white/10 text-slate-200 shadow-md'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-100 hover:bg-white/10'
                } ${app.color}`}
              >
                <Icon size={18} />
              </button>

              {/* Tooltip */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-950 border border-white/10 text-white text-[9px] font-mono font-bold px-2.5 py-1 rounded-xl shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition duration-150 whitespace-nowrap">
                {app.title}
              </div>

              {/* Status Indicator Dots */}
              {isOpen && (
                <span
                  className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-all ${
                    isFocused ? 'bg-indigo-400 w-3' : 'bg-slate-400'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
