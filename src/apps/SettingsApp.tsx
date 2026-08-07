import React from 'react';
import { useOSStore } from '../store/useOSStore';
import { Settings, Volume2, Sun, Eye, Paintbrush, Monitor, RotateCcw, AlertTriangle } from 'lucide-react';

export const SettingsApp: React.FC = () => {
  const {
    activeTheme,
    soundEnabled,
    volume,
    brightness,
    crtEnabled,
    setTheme,
    setSoundEnabled,
    setVolume,
    setBrightness,
    setCrtEnabled,
    resetSystem,
    achievements
  } = useOSStore();

  const totalPoints = achievements.reduce((sum, a) => (a.unlocked ? sum + a.points : sum), 0);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="flex-1 p-6 font-sans text-xs select-text space-y-6 overflow-y-auto max-w-xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-2.5 border-b border-white/5 pb-2">
        <Settings size={18} className="text-indigo-400" />
        <h2 className="text-sm font-bold font-display text-white uppercase tracking-wider">System Settings Center</h2>
      </div>

      {/* Grid Settings Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Box 1: Visual Theme selection */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
          <div className="flex items-center space-x-1.5 border-b border-white/5 pb-1.5">
            <Paintbrush size={13} className="text-indigo-400" />
            <span className="font-bold text-slate-200 uppercase font-mono">Appearance Themes</span>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] text-slate-400 leading-relaxed font-mono">Select a global visual styling theme:</p>
            <div className="space-y-1.5">
              {[
                { id: 'glass', label: 'Classic Glassmorphism', desc: 'Translucent blue & purple gradients', color: 'from-blue-600 to-indigo-700' },
                { id: 'cyberpunk', label: 'Cyberpunk Neon', desc: 'High contrast pink, purple & cyan outlines', color: 'from-pink-500 to-purple-800' },
                { id: 'matrix', label: 'Matrix Terminal', desc: 'Monochrome monochrome green coding rain', color: 'from-green-600 to-emerald-800' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`w-full p-2.5 rounded-xl border flex items-center justify-between text-left transition ${
                    activeTheme === t.id
                      ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 font-bold shadow'
                      : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="text-slate-200 font-bold font-sans text-xs">{t.label}</div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5 truncate">{t.desc}</div>
                  </div>
                  {/* Miniature preview circle */}
                  <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${t.color} shrink-0 border border-white/10`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Box 2: Monitor & Sound options */}
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4 font-mono select-none">
          <div className="flex items-center space-x-1.5 border-b border-white/5 pb-1.5">
            <Monitor size={13} className="text-indigo-400" />
            <span className="font-bold text-slate-200 uppercase">Hardware Options</span>
          </div>

          {/* Sound volume slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center space-x-1">
                <Volume2 size={12} className="text-indigo-400" />
                <span>AUDIO VOLUME</span>
              </span>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${soundEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}
              >
                {soundEnabled ? 'ON' : 'MUTED'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-900 h-1 cursor-pointer"
            />
          </div>

          {/* Brightness slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="flex items-center space-x-1">
                <Sun size={12} className="text-indigo-400" />
                <span>MONITOR BRIGHTNESS</span>
              </span>
              <span className="font-bold text-slate-400">{brightness}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-900 h-1 cursor-pointer"
            />
          </div>

          {/* CRT Screen Toggle */}
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <span className="flex items-center space-x-1.5 text-[10px]">
              <Eye size={12} className="text-indigo-400" />
              <span>CRT LINES SIMULATION</span>
            </span>
            <button
              onClick={() => setCrtEnabled(!crtEnabled)}
              className={`px-2 py-0.5 border rounded text-[9px] font-bold ${
                crtEnabled ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' : 'border-slate-800 text-slate-500'
              }`}
            >
              {crtEnabled ? 'ENABLED' : 'DISABLED'}
            </button>
          </div>
        </div>

      </div>

      {/* System diagnostics information */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 font-mono space-y-3">
        <div className="font-bold text-slate-300 uppercase border-b border-white/5 pb-1">System Specs & Stats</div>
        <div className="grid grid-cols-2 gap-y-1 text-slate-400 text-[10px]">
          <div>OS Identifier:</div><div className="text-indigo-400 font-bold">KhushalOS Suite v4.0</div>
          <div>Core Kernel Version:</div><div className="text-slate-300">Zustand_Engine_v1.0.2</div>
          <div>Achievements Tracker:</div><div className="text-yellow-500 font-bold">{unlockedCount} / {achievements.length} ({totalPoints} XP)</div>
          <div>Browser Host Agent:</div><div className="text-slate-300 truncate">Vite React Web Environment</div>
        </div>
      </div>

      {/* Factory reset option */}
      <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-3 font-mono">
        <div className="flex items-center space-x-2 text-rose-400">
          <AlertTriangle size={16} />
          <span className="font-bold uppercase tracking-wider text-[11px]">DANGER AREA: FACTORY SYSTEM RESET</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-normal">
          Clicking below deletes all local storage notepad data, locks completed achievements and resets system settings. This operation is irreversible.
        </p>
        <button
          onClick={() => {
            if (confirm('Clear ALL system configurations, achievements, and notepad data? This cannot be undone.')) {
              resetSystem();
            }
          }}
          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/35 border border-rose-500/30 text-rose-400 hover:text-rose-200 font-bold rounded-xl transition-all"
        >
          <RotateCcw size={12} className="inline mr-1" />
          <span>RESET ALL SYSTEM DATA</span>
        </button>
      </div>

    </div>
  );
};
