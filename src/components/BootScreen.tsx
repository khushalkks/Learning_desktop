import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import { Monitor, Terminal, Shield, Cpu, Database, Award, User, Lock } from 'lucide-react';

export const BootScreen: React.FC = () => {
  const { setLocked, setBooting, setUser } = useOSStore();
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [bootPhase, setBootPhase] = useState<'bios' | 'login'>('bios');
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
  const hasClientId = !!googleClientId;

  // Handle Google Token decoding
  const handleGoogleSuccess = (response: any) => {
    try {
      const token = response.credential;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      
      setUser({
        name: payload.name,
        email: payload.email,
        avatar: payload.picture
      });
      
      setIsSigningIn(true);
      setTimeout(() => {
        setIsSigningIn(false);
        setLocked(false);
      }, 1000);
    } catch (e) {
      console.error('Failed to parse Google OAuth Token:', e);
      alert('Error parsing Google authentication details.');
    }
  };

  // Load Google Client JS dynamically
  useEffect(() => {
    if (!hasClientId || bootPhase !== 'login') return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      try {
        if ((window as any).google) {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleSuccess,
          });
          
          const divContainer = document.getElementById('google-signin-div');
          if (divContainer) {
            (window as any).google.accounts.id.renderButton(divContainer, {
              theme: 'filled_blue',
              size: 'large',
              width: '280',
              shape: 'pill'
            });
          }
        }
      } catch (err) {
        console.error('Failed to initialize Google accounts:', err);
      }
    };
    document.body.appendChild(script);

    return () => {
      const element = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [hasClientId, bootPhase]);

  const handleSimulateGoogle = () => {
    setShowGoogleModal(false);
    setGoogleLoading(true);
    
    // Simulate loading for authentication
    setTimeout(() => {
      setGoogleLoading(false);
      setUser({
        name: 'Guest Explorer',
        email: 'guest.explorer@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80'
      });
      setLocked(false);
    }, 1500);
  };

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
      setUser({
        name: usernameInput || 'Admin User',
        email: usernameInput ? `${usernameInput.toLowerCase().replace(/\s+/g, '')}@khushal-os.local` : 'admin@khushal-os.local',
        avatar: ''
      });
      setIsSigningIn(false);
      setLocked(false);
      setBooting(false);
    }, 1200);
  };

  const handleGuestLogin = () => {
    setIsSigningIn(true);
    setTimeout(() => {
      setUser({
        name: 'Guest Explorer',
        email: 'guest@khushal-os.local',
        avatar: ''
      });
      setIsSigningIn(false);
      setLocked(false);
      setBooting(false);
    }, 1000);
  };

  const skipBoot = () => {
    setUser({
      name: 'Admin User',
      email: 'admin@khushal-os.local',
      avatar: ''
    });
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

        {/* System Title */}
        <h1 className="text-2xl font-display font-black tracking-widest text-slate-100 uppercase mb-1 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
          Khushal OS
        </h1>
        <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-6">
          System Login Shell
        </p>

        {/* Input block */}
        <div className="w-full space-y-3.5">
          {/* Username Input */}
          <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 rounded-xl py-2.5 px-4 transition duration-200 group">
            <User size={14} className="text-slate-500 group-focus-within:text-indigo-400 transition" />
            <input 
              type="text"
              placeholder="Username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              disabled={isSigningIn}
              className="flex-1 bg-transparent border-none outline-none font-sans text-xs text-slate-200 placeholder:text-slate-500"
              autoFocus
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center space-x-3 bg-slate-950/60 border border-slate-700/80 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 rounded-xl py-2.5 px-4 transition duration-200 group">
            <Lock size={14} className="text-slate-500 group-focus-within:text-indigo-400 transition" />
            <input 
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSigningIn}
              className="flex-1 bg-transparent border-none outline-none font-sans text-xs text-slate-200 placeholder:text-slate-500"
            />
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-neon-blue flex items-center justify-center space-x-2 text-xs uppercase tracking-wider font-display"
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

          {/* Google Sign-in Divider */}
          <div className="flex items-center my-2 w-full">
            <div className="flex-1 h-px bg-white/10" />
            <span className="px-3 text-[9px] text-slate-500 font-mono">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google Login button */}
          <div className="w-full flex justify-center z-10">
            {hasClientId ? (
              <div id="google-signin-div" className="w-full flex justify-center" />
            ) : (
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-2.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 active:scale-95 text-slate-300 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.53 14.98 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.92 3.04c.92-2.77 3.51-4.5 6.58-4.5z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.58h6.43c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.74-4.92 3.74-8.69z" />
                  <path fill="#FBBC05" d="M5.42 14.54c-.24-.71-.38-1.47-.38-2.27s.14-1.56.38-2.27L1.5 6.96C.54 8.88 0 11.02 0 13.25c0 2.23.54 4.37 1.5 6.29l3.92-3z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.34 1.1-4.26 1.1-3.07 0-5.66-1.73-6.58-4.5L1.5 16.86C3.39 20.35 7.35 23 12 23z" />
                </svg>
                <span>SIGN IN WITH GOOGLE</span>
              </button>
            )}
          </div>
        </div>

        {/* Guest Mode Trigger */}
        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full mt-4 text-[10px] text-slate-500 hover:text-indigo-400 transition duration-150 font-mono uppercase tracking-widest text-center hover:underline focus:outline-none"
        >
          Guest Mode
        </button>

      </form>

      {/* Google Setup Helper Modal */}
      {showGoogleModal && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="w-full max-w-sm glass-panel p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col space-y-4 text-left select-none">
            <div className="flex items-center space-x-2 text-indigo-400 font-display font-bold text-sm tracking-wider uppercase">
              {/* Google SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.53 14.98 1 12 1 7.35 1 3.39 3.65 1.5 7.5l3.92 3.04c.92-2.77 3.51-4.5 6.58-4.5z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.58h6.43c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.74-4.92 3.74-8.69z" />
                <path fill="#FBBC05" d="M5.42 14.54c-.24-.71-.38-1.47-.38-2.27s.14-1.56.38-2.27L1.5 6.96C.54 8.88 0 11.02 0 13.25c0 2.23.54 4.37 1.5 6.29l3.92-3z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.34 1.1-4.26 1.1-3.07 0-5.66-1.73-6.58-4.5L1.5 16.86C3.39 20.35 7.35 23 12 23z" />
              </svg>
              <span>Google OAuth Setup</span>
            </div>
            
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              This application is ready to accept real Google OAuth logins. To activate, register a Client ID in your Google Cloud Console and add it to your <code className="text-pink-400 font-mono">.env</code> file:
            </p>
            
            <div className="bg-slate-950/80 border border-white/5 p-3 rounded-xl font-mono text-[9px] text-indigo-300 break-all select-all">
              VITE_GOOGLE_CLIENT_ID = your_client_id_here
            </div>

            <p className="text-[10px] text-slate-500 font-sans italic leading-relaxed">
              No Client ID yet? Click below to run a simulated authentication flow with a mock Google profile.
            </p>

            <div className="flex flex-col space-y-2 pt-2">
              <button
                type="button"
                onClick={handleSimulateGoogle}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:scale-95 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-[0_4px_12px_rgba(99,102,241,0.3)] transition"
              >
                Simulate Google Login
              </button>
              
              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 active:scale-95 text-slate-400 hover:text-slate-200 text-xs font-bold uppercase tracking-wider rounded-2xl transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Google Service Loader */}
      {googleLoading && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in">
          <div className="w-16 h-16 rounded-full border-2 border-indigo-500/10 border-t-indigo-400 animate-spin mb-4" />
          <span className="text-[10px] font-bold font-display uppercase tracking-widest text-slate-300">
            CONNECTING GOOGLE SERVICE...
          </span>
        </div>
      )}
    </div>
  );
};
