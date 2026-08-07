import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../store/useOSStore';
import { Mic, MicOff, X, Sparkles, Volume2 } from 'lucide-react';

interface VoiceControllerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({ isOpen, onClose }) => {
  const { openWindow, closeWindow, windows, setTheme, addNotification } = useOSStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('Listening... Speak a command.');
    };

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const activeTranscript = finalTranscript || interimTranscript;
      setTranscript(activeTranscript);

      if (finalTranscript) {
        processCommand(finalTranscript.toLowerCase());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setTranscript('Microphone permission denied.');
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  // Automatically start listening when opened
  useEffect(() => {
    if (isOpen && isSupported && recognitionRef.current) {
      startListening();
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isOpen]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already started
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const processCommand = (cmd: string) => {
    const cleanCmd = cmd.trim();
    
    // Command matching helpers
    const matches = (keywords: string[]) => {
      return keywords.some(kw => cleanCmd.includes(kw));
    };

    if (matches(['open about', 'about me', 'show about'])) {
      openWindow('about');
      notifyCommand('Open About Me');
    } else if (matches(['open projects', 'show projects', 'view projects'])) {
      openWindow('projects');
      notifyCommand('Open Projects');
    } else if (matches(['open terminal', 'show terminal', 'command prompt'])) {
      openWindow('terminal');
      notifyCommand('Open Terminal');
    } else if (matches(['open contact', 'show contact', 'send email'])) {
      openWindow('contact');
      notifyCommand('Open Contact Center');
    } else if (matches(['open notes', 'show notes', 'open notepad'])) {
      openWindow('notes');
      notifyCommand('Open Notes Pad');
    } else if (matches(['open music', 'play music', 'show music'])) {
      openWindow('music');
      notifyCommand('Open Music Player');
    } else if (matches(['open research', 'show research', 'physics lab'])) {
      openWindow('research');
      notifyCommand('Open Research Lab');
    } else if (matches(['open games', 'show games', 'gaming zone'])) {
      openWindow('games');
      notifyCommand('Open Gaming Zone');
    } else if (matches(['open assistant', 'ai assistant', 'open ai'])) {
      openWindow('ai');
      notifyCommand('Open AI Assistant');
    } else if (matches(['open settings', 'show settings', 'control center'])) {
      openWindow('settings');
      notifyCommand('Open Settings');
    } else if (matches(['theme cyberpunk', 'cyberpunk theme', 'cyberpunk mode'])) {
      setTheme('cyberpunk');
      notifyCommand('Set Theme to Cyberpunk');
    } else if (matches(['theme glass', 'glass theme', 'glass mode'])) {
      setTheme('glass');
      notifyCommand('Set Theme to Glassmorphism');
    } else if (matches(['theme matrix', 'matrix theme', 'matrix mode'])) {
      setTheme('matrix');
      notifyCommand('Set Theme to Matrix');
    } else if (matches(['close all', 'close windows'])) {
      windows.forEach(w => {
        if (w.isOpen) closeWindow(w.id);
      });
      notifyCommand('Close All Windows');
    }
  };

  const notifyCommand = (actionText: string) => {
    addNotification('🎤 Voice Command!', `Executing action: "${actionText}"`, 'success');
    
    // Auto close dialog after executing a command successfully
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center z-[150] select-none font-mono">
      <div className="w-11/12 max-w-sm glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center relative animate-fade-in text-center">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white transition"
        >
          <X size={16} />
        </button>

        <h3 className="text-sm font-display font-bold text-white tracking-widest uppercase mb-1">
          Voice Controller
        </h3>
        <p className="text-[10px] text-indigo-400 font-bold mb-6">WEB SPEECH API ACTIVE</p>

        {isSupported ? (
          <div className="space-y-6 w-full">
            {/* Pulsing Mic Circle */}
            <div className="flex justify-center">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isListening 
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse shadow-neon-pink' 
                    : 'bg-indigo-600/10 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600/20'
                }`}
              >
                {isListening ? <Mic size={32} /> : <MicOff size={32} />}
              </button>
            </div>

            {/* Transcript feed */}
            <div className="bg-slate-950/80 border border-white/5 rounded-xl p-3.5 min-h-[70px] flex items-center justify-center">
              <p className={`text-xs leading-relaxed ${isListening ? 'text-slate-300 font-bold' : 'text-slate-500'}`}>
                {transcript}
              </p>
            </div>

            {/* Suggestions list */}
            <div className="space-y-2 text-left bg-slate-900/60 border border-white/5 rounded-xl p-3.5 select-text">
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1 flex items-center space-x-1">
                <Sparkles size={8} />
                <span>Try Saying:</span>
              </div>
              <ul className="text-[10px] text-slate-400 space-y-1">
                <li>• <b className="text-slate-200">"Open Projects"</b> (Views project grid)</li>
                <li>• <b className="text-slate-200">"Open Terminal"</b> (Opens diagnostic console)</li>
                <li>• <b className="text-slate-200">"Play Music"</b> (Starts synth loops)</li>
                <li>• <b className="text-slate-200">"Theme Cyberpunk"</b> (Switches style layout)</li>
                <li>• <b className="text-slate-200">"Close All"</b> (Minimizes all windows)</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs">
              Web Speech Recognition is not supported by your current browser. Please try launching this in Chrome or Microsoft Edge.
            </div>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 border border-white/5 text-slate-300 hover:text-white rounded-lg text-xs"
            >
              Close Panel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
