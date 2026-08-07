import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { Wifi, Volume2, VolumeX, Moon, Sun, Settings, Compass, Mic } from 'lucide-react';

export const MenuBar: React.FC = () => {
  const {
    activeTheme,
    soundEnabled,
    volume,
    brightness,
    toggleQuickSettings,
    activeWindowId,
    windows,
    voiceActive,
    setVoiceActive,
  } = useOSStore();

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Get active window title if any
  const activeWindow = windows.find(w => w.id === activeWindowId && w.isOpen && !w.isMinimized);
  const activeTitle = activeWindow ? activeWindow.title : 'KhushalOS';

  return (
    <div className="h-10 w-full bg-slate-950/60 backdrop-blur-md border-b border-white/5 px-4 flex items-center justify-between text-xs select-none z-50 text-slate-300 font-sans">
      {/* Left side: Logo & Active Window context */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 hover:opacity-80 cursor-pointer transition-opacity" onClick={() => toggleQuickSettings(true)}>
          <Compass size={14} className="animate-spin-slow text-indigo-400" />
          <span className="font-display font-black tracking-widest text-[13px] bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 uppercase">
            KOS
          </span>
        </div>
        <span className="text-white/10">|</span>
        <span className="font-bold text-slate-200 uppercase tracking-wider font-display text-[10px] select-none">
          {activeTitle}
        </span>
      </div>

      {/* Right side: System stats & Clock */}
      <div className="flex items-center space-x-3.5">
        {/* Status Capsule */}
        <div className="hidden sm:flex items-center space-x-3 bg-white/5 border border-white/5 rounded-full px-3 py-1 font-mono text-[10px] text-slate-400 select-none">
          {/* Network status */}
          <div className="flex items-center space-x-1.5 hover:text-slate-200 cursor-help transition" title="Connected to Local Network">
            <Wifi size={12} className="text-emerald-400" />
            <span>1Gbps</span>
          </div>

          <span className="text-white/10">|</span>

          {/* Volume status */}
          <div className="flex items-center space-x-1.5 hover:text-slate-200 transition">
            {soundEnabled && volume > 0 ? (
              <Volume2 size={12} className="text-indigo-400" />
            ) : (
              <VolumeX size={12} className="text-rose-400" />
            )}
            <span>{soundEnabled ? `${volume}%` : 'Muted'}</span>
          </div>

          <span className="text-white/10">|</span>

          {/* Theme Indicator */}
          <div className="flex items-center space-x-1.5 capitalize hover:text-slate-200 transition">
            {activeTheme === 'glass' && <Sun size={11} className="text-yellow-500" />}
            {activeTheme === 'cyberpunk' && <Moon size={11} className="text-pink-500 animate-pulse" />}
            {activeTheme === 'matrix' && <span className="text-green-500 font-bold">Matrix</span>}
            <span>{activeTheme}</span>
          </div>
        </div>

        {/* Interactive Control Badges */}
        <div className="flex items-center space-x-1.5">
          {/* Voice Assistant Toggle */}
          <button
            onClick={() => setVoiceActive(!voiceActive)}
            className={`p-1.5 rounded-lg border transition ${
              voiceActive 
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.3)]' 
                : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
            }`}
            title="Toggle Voice Commands"
          >
            <Mic size={12} />
          </button>

          {/* Settings Toggle */}
          <button
            onClick={() => toggleQuickSettings()}
            className="p-1.5 bg-white/5 border border-white/5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition"
            title="Open Quick Settings"
          >
            <Settings size={12} className="animate-spin-slow" />
          </button>
        </div>

        <span className="text-white/10">|</span>

        {/* Date & Time Capsule */}
        <div 
          onClick={() => toggleQuickSettings()}
          className="flex items-center space-x-2 text-[10px] font-mono text-slate-300 font-bold hover:text-indigo-400 cursor-pointer transition select-none bg-indigo-600/10 border border-indigo-500/20 rounded-full px-3 py-1 shadow-[0_0_12px_rgba(99,102,241,0.1)]" 
          title="System Calendar"
        >
          <span className="hidden md:inline text-[9px] uppercase text-indigo-300/80">{formatDate(time)}</span>
          <span className="text-indigo-200">
            {formatTime(time)}
          </span>
        </div>
      </div>
    </div>
  );
};
