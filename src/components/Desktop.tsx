import React from 'react';
import { useOSStore } from '../store/useOSStore';
import { Window } from './Window';
import { MatrixBackground } from './MatrixBackground';
import { 
  User, FolderGit, Terminal, Send, Music, Award, FileText, 
  Settings, Code, Sparkles, Bot 
} from 'lucide-react';

// Import apps when ready (we will mock them or import them)
import { AboutApp } from '../apps/AboutApp';
import { ProjectsApp } from '../apps/ProjectsApp';
import { TerminalApp } from '../apps/TerminalApp';
import { ContactApp } from '../apps/ContactApp';
import { NotesApp } from '../apps/NotesApp';
import { MusicApp } from '../apps/MusicApp';
import { ResearchApp } from '../apps/ResearchApp';
import { GamesApp } from '../apps/GamesApp';
import { SettingsApp } from '../apps/SettingsApp';
import { AIApp } from '../apps/AIApp';

export const Desktop: React.FC = () => {
  const { windows, openWindow, activeTheme, brightness } = useOSStore();

  const shortcuts = [
    { id: 'about', title: 'About Me', icon: User, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'projects', title: 'Projects Explorer', icon: FolderGit, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
    { id: 'terminal', title: 'Terminal Emulator', icon: Terminal, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'contact', title: 'Contact Center', icon: Send, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { id: 'notes', title: 'Notes Pad', icon: FileText, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'music', title: 'Music Player', icon: Music, color: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20' },
    { id: 'research', title: 'Research Lab', icon: Code, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { id: 'games', title: 'Gaming Zone', icon: Award, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
    { id: 'ai', title: 'AI Assistant', icon: Bot, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  ];

  // Map window content based on ID
  const renderAppContent = (id: string) => {
    switch (id) {
      case 'about':
        return <AboutApp />;
      case 'projects':
        return <ProjectsApp />;
      case 'terminal':
        return <TerminalApp />;
      case 'contact':
        return <ContactApp />;
      case 'notes':
        return <NotesApp />;
      case 'music':
        return <MusicApp />;
      case 'research':
        return <ResearchApp />;
      case 'games':
        return <GamesApp />;
      case 'settings':
        return <SettingsApp />;
      case 'ai':
        return <AIApp />;
      default:
        return <div className="p-4">App not found</div>;
    }
  };

  return (
    <div 
      className="flex-1 w-full relative overflow-hidden select-none"
      style={{ 
        backgroundImage: activeTheme === 'glass' 
          ? 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)' 
          : activeTheme === 'cyberpunk'
          ? 'linear-gradient(135deg, #090014 0%, #120024 50%, #2e003e 100%)'
          : 'radial-gradient(circle at center, #022c22 0%, #000000 100%)',
        filter: `brightness(${brightness}%)`
      }}
    >
      {/* Ambient Glowing Blobs */}
      {activeTheme !== 'matrix' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
          <div 
            className={`absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] transition-colors duration-1000 animate-blob-1 ${
              activeTheme === 'glass' ? 'bg-indigo-500/20' : 'bg-pink-500/20'
            }`} 
          />
          <div 
            className={`absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full blur-[120px] transition-colors duration-1000 animate-blob-2 ${
              activeTheme === 'glass' ? 'bg-purple-500/20' : 'bg-violet-600/20'
            }`} 
          />
        </div>
      )}

      {/* Background grids */}
      {activeTheme === 'glass' && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none z-1" />
      )}
      {activeTheme === 'cyberpunk' && (
        <div className="absolute inset-0 bg-[linear-gradient(rgba(236,72,153,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(236,72,153,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-1" />
      )}

      {/* Secret Matrix code background */}
      {activeTheme === 'matrix' && <MatrixBackground />}

      {/* Grid of shortcuts */}
      <div className="absolute inset-0 p-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1 md:grid-rows-8 gap-4 w-full md:w-32 h-fit z-10 pointer-events-none">
        {shortcuts.map((shortcut) => {
          const Icon = shortcut.icon;
          return (
            <button
              key={shortcut.id}
              onClick={() => openWindow(shortcut.id)}
              className="pointer-events-auto flex flex-col items-center justify-center p-3 rounded-2xl border border-white/5 bg-slate-950/20 backdrop-blur-sm hover:bg-white/5 hover:border-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.1)] active:scale-95 group transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className={`p-2.5 rounded-xl border ${shortcut.color} shadow-md shadow-black/10 group-hover:scale-105 group-hover:rotate-3 transition duration-200`}>
                <Icon size={18} className="group-hover:rotate-6 transition duration-200" />
              </div>
              <span className="text-[9px] font-bold font-display uppercase tracking-widest text-slate-300 mt-2 text-center select-none group-hover:text-white drop-shadow-md">
                {shortcut.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating Sparkles for ambient glass theme */}
      {activeTheme === 'glass' && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 flex space-x-1 items-center animate-float">
          <Sparkles size={40} className="text-indigo-400" />
        </div>
      )}

      {/* Active Windows Stack */}
      {windows.map((win) => (
        <Window key={win.id} windowState={win}>
          {renderAppContent(win.id)}
        </Window>
      ))}
    </div>
  );
};
