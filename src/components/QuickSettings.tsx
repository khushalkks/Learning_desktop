import React, { useRef, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { Volume2, VolumeX, Sun, Eye, EyeOff, Award, RotateCcw, Paintbrush, MonitorSmartphone } from 'lucide-react';

export const QuickSettings: React.FC = () => {
  const {
    activeTheme,
    soundEnabled,
    volume,
    brightness,
    crtEnabled,
    quickSettingsOpen,
    toggleQuickSettings,
    setTheme,
    setSoundEnabled,
    setVolume,
    setBrightness,
    setCrtEnabled,
    achievements,
    resetSystem
  } = useOSStore();

  const settingsRef = useRef<HTMLDivElement>(null);

  // Close panel if clicked outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (quickSettingsOpen && settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        // Only close if we didn't click the settings toggle button in the menubar (which is a parent)
        const target = e.target as HTMLElement;
        if (!target.closest('[title="Open Quick Settings"]')) {
          toggleQuickSettings(false);
        }
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [quickSettingsOpen]);

  if (!quickSettingsOpen) return null;

  const totalPoints = achievements.reduce((sum, a) => (a.unlocked ? sum + a.points : sum), 0);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div
      ref={settingsRef}
      className="fixed top-12 right-4 w-80 glass-panel-heavy rounded-3xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5),var(--os-shadow-neon)] p-5 z-[100] animate-slide-up flex flex-col space-y-5 select-none text-slate-200 text-xs font-mono"
    >
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <span className="font-display font-bold tracking-wider text-indigo-400">CONTROL CENTER</span>
        <MonitorSmartphone size={14} className="text-indigo-400" />
      </div>

      {/* Sound / Volume Control */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <Volume2 size={12} />
            <span>VOLUME</span>
          </span>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${soundEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}
          >
            {soundEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? <Volume2 size={16} className="text-indigo-400" /> : <VolumeX size={16} className="text-rose-400" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, var(--os-accent) 0%, var(--os-accent) ${volume}%, #0f172a ${volume}%, #0f172a 100%)`
            }}
            className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer border border-white/5 outline-none transition-all duration-150"
          />
          <span className="w-8 text-right font-bold">{volume}%</span>
        </div>
      </div>

      {/* Screen Brightness Control */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px] text-slate-400">
          <span className="flex items-center space-x-1">
            <Sun size={12} />
            <span>BRIGHTNESS</span>
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Sun size={16} className="text-indigo-400" />
          <input
            type="range"
            min="20"
            max="100"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, var(--os-accent) 0%, var(--os-accent) ${brightness}%, #0f172a ${brightness}%, #0f172a 100%)`
            }}
            className="flex-1 h-1.5 rounded-lg appearance-none cursor-pointer border border-white/5 outline-none transition-all duration-150"
          />
          <span className="w-8 text-right font-bold">{brightness}%</span>
        </div>
      </div>

      {/* CRT Scanline Filter Toggle */}
      <div className="flex items-center justify-between py-1 border-t border-b border-white/5 my-1">
        <span className="flex items-center space-x-2">
          {crtEnabled ? <Eye size={14} className="text-emerald-400" /> : <EyeOff size={14} className="text-slate-400" />}
          <span>CRT FILTER MONITOR</span>
        </span>
        <button
          onClick={() => setCrtEnabled(!crtEnabled)}
          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors duration-200 ${
            crtEnabled ? 'bg-indigo-600' : 'bg-slate-800'
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-200 ${
              crtEnabled ? 'translate-x-5.5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Theme Picker */}
      <div className="space-y-2">
        <div className="text-[11px] text-slate-400 flex items-center space-x-1">
          <Paintbrush size={12} />
          <span>SYSTEM THEME</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['glass', 'cyberpunk', 'matrix'].map((theme) => (
            <button
              key={theme}
              onClick={() => setTheme(theme as any)}
              className={`py-1.5 rounded-lg border font-bold capitalize transition-all ${
                activeTheme === theme
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-neon-blue'
                  : 'bg-slate-900/60 text-slate-400 border-white/5 hover:bg-slate-800'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Info */}
      <div className="bg-slate-900/60 rounded-xl border border-white/5 p-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Award className="text-yellow-500 animate-bounce" size={20} />
          <div>
            <div className="font-bold text-slate-300">ACHIEVEMENTS</div>
            <div className="text-[10px] text-slate-500">{unlockedCount} of {achievements.length} unlocked</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-display font-black text-yellow-400">{totalPoints}</div>
          <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">OS XP</div>
        </div>
      </div>

      {/* Reset OS System */}
      <button
        onClick={() => {
          if (confirm('Are you sure you want to reset all OS configurations, files and unlocked achievements?')) {
            resetSystem();
          }
        }}
        className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/35 border border-rose-500/30 hover:border-rose-500 text-rose-400 hover:text-rose-200 rounded-lg flex items-center justify-center space-x-1.5 transition-all"
      >
        <RotateCcw size={12} />
        <span className="font-bold">RESET SYSTEM ENVIRONMENT</span>
      </button>
    </div>
  );
};
