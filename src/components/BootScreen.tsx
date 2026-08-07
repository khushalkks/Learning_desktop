import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { Monitor, Terminal, Shield, Cpu, Database, Award } from 'lucide-react';

export const BootScreen: React.FC = () => {
  const { setLocked, setBooting } = useOSStore();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [bootPhase, setBootPhase] = useState<'bios' | 'login'>('bios');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Twinkling stars state for cosmic theme
  const [stars] = useState(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: `${Math.random() * 3}s`
    }));
  });

  const biosMessages = [
    'KHUSHAL BIOS v4.82 (C) 2026 KHUSHAL CORP.',
    'CPU: AMD Ryzen 9 5900X @ 3.70GHz (12 Cores, 24 Threads)',
    'RAM: 32768MB SYSTEM MEMORY DETECTED... OK',
    'DISKS: NVMe SSD 1TB (PORT 0) - OK',
    'GRAPHICS: NVIDIA GeForce RTX 4080 (16GB VRAM) - ACTIVE',
    'NETWORK: DHCP IP 192.168.1.104... CONNECTED',
    'OS: KhushalOS v4.0.0 (x86_64)',
    'LOADING SYSTEM MODULES: kernel.sys, security.sys, fs.sys... DONE',
    'MOUNTING FILE SYSTEM... SUCCESS',
    'STARTING GRAPHICAL SHELL (DESKTOP.SH)...',
    'SYSTEM DIAGNOSTICS: ALL SERVICES COMPLETED WITH EXIT CODE 0.',
  ];

  // Simulated BIOS logging
  useEffect(() => {
    if (bootPhase !== 'bios') return;
    
    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < biosMessages.length) {
        setLogs((prev) => [...prev, biosMessages[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 280);

    return () => clearInterval(interval);
  }, [bootPhase]);

  // Loading Progress Bar
  useEffect(() => {
    if (bootPhase !== 'bios') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setBootPhase('login');
          }, 600);
          return 100;
        }
        return prev + 2.5; // smooth increment
      });
    }, 100);

    return () => clearInterval(interval);
  }, [bootPhase]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSigningIn(true);
    
    // Simulate slight verification delay
    setTimeout(() => {
      setLocked(false);
      setBooting(false);
    }, 850);
  };

  const skipBoot = () => {
    setLocked(false);
    setBooting(false);
  };

  if (bootPhase === 'bios') {
    return (
      <div className="absolute inset-0 bg-black text-green-500 font-mono p-6 md:p-12 flex flex-col justify-between overflow-hidden crt-overlay">
        <div className="flex-1 flex flex-col justify-start space-y-2 select-text overflow-y-auto max-h-[80vh]">
          <div className="flex items-center space-x-2 text-green-400 border-b border-green-800 pb-2 mb-4">
            <Terminal size={20} className="animate-pulse" />
            <span className="font-display tracking-widest text-lg font-bold">KHUSHAL-OS BOOT SYSTEM v4.0</span>
          </div>

          {logs.map((log, idx) => (
            <div key={idx} className="text-sm md:text-base leading-relaxed animate-fade-in">
              <span className="text-green-700 mr-2">&gt;&gt;</span>
              {log}
            </div>
          ))}

          {progress < 100 && (
            <div className="text-sm md:text-base text-yellow-500 animate-pulse">
              <span className="text-green-700 mr-2">&gt;&gt;</span>
              Initializing Desktop environment: {Math.floor(progress)}%
            </div>
          )}
        </div>

        <div className="border-t border-green-800 pt-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Progress Bar Container */}
          <div className="w-full md:w-2/3">
            <div className="w-full bg-green-950 border border-green-700 h-6 rounded overflow-hidden p-0.5 relative">
              <div 
                className="bg-green-500 h-full rounded transition-all duration-100 flex items-center justify-end pr-2 text-black text-xs font-bold"
                style={{ width: `${progress}%` }}
              >
                {progress > 5 && `${Math.floor(progress)}%`}
              </div>
            </div>
          </div>

          {/* Quick buttons */}
          <button 
            onClick={skipBoot}
            className="px-4 py-2 bg-green-900/40 hover:bg-green-700 hover:text-black border border-green-600 text-green-400 rounded text-xs transition duration-200"
          >
            FAST BOOT [ESC]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="absolute inset-0 bg-cover bg-center flex items-center justify-center crt-overlay overflow-hidden"
      style={{ 
        backgroundImage: 'linear-gradient(135deg, #02000c 0%, #050515 40%, #0b0726 70%, #1b0c5a 100%)'
      }}
    >
      {/* Cosmic Nebulae Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[60vw] h-[60vw] rounded-full bg-indigo-500/20 blur-[130px] animate-blob-1" />
        <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] rounded-full bg-purple-600/15 blur-[120px] animate-blob-2" />
      </div>

      {/* Twinkling Starry sky */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-70 z-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: star.delay,
              animationDuration: '2s'
            }}
          />
        ))}
      </div>

      {/* Background Matrix/Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-1" />

      {/* Login Card */}
      <form 
        onSubmit={handleLogin}
        className="w-11/12 max-w-sm glass-panel p-8 rounded-3xl flex flex-col items-center shadow-[0_20px_50px_rgba(0,0,0,0.5),var(--os-shadow-neon)] relative border border-white/10 animate-fade-in z-10"
      >
        {/* Decorative elements */}
        <div className="absolute top-3 right-3 flex space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
        </div>

        {/* Profile Avatar */}
        <div className="w-24 h-24 rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center mb-6 shadow-neon-blue relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 group-hover:scale-110 transition duration-300" />
          <Cpu className="text-indigo-400 group-hover:rotate-12 transition duration-300" size={44} />
        </div>

        {/* User profile detail */}
        <h2 className="text-xl font-display font-bold tracking-wider text-slate-100 mb-1">
          KHUSHAL KUMAR SAHU
        </h2>
        <p className="text-xs text-indigo-400 font-mono mb-6 uppercase tracking-widest">
          SYSTEM ADMINISTRATOR
        </p>

        {/* Password input block */}
        <div className="w-full space-y-4">
          <div className="relative">
            <input 
              type="password"
              placeholder="Press Enter to login..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSigningIn}
              className="w-full bg-slate-950/60 border border-slate-700 rounded-xl py-3 px-4 text-center font-mono text-sm placeholder:text-slate-500 text-indigo-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition duration-200"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-neon-blue flex items-center justify-center space-x-2"
          >
            {isSigningIn ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>VERIFYING SYSTEM KEYS...</span>
              </>
            ) : (
              <span>SIGN IN</span>
            )}
          </button>
        </div>

        {/* Footer help */}
        <div className="mt-8 text-[10px] text-slate-500 font-mono text-center">
          <div>SECURE KERNEL ENVIRONMENT</div>
          <div className="mt-1">SYS_ID: f6691938-OS</div>
        </div>
      </form>
    </div>
  );
};
