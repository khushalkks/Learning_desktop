import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../store/useOSStore';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Disc } from 'lucide-react';

interface Track {
  title: string;
  artist: string;
  duration: string;
  tempo: number; // BPM
}

export const MusicApp: React.FC = () => {
  const { soundEnabled, volume } = useOSStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Audio synthesis Web Audio API refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const nextNoteTimeRef = useRef(0);
  const stepRef = useRef(0);

  const playlist: Track[] = [
    { title: 'Neon Dreams (Synthesized)', artist: 'KhushalOS Synth Engine', duration: 'Loop', tempo: 120 },
    { title: 'Grid Runner (Synthesized)', artist: 'KhushalOS Synth Engine', duration: 'Loop', tempo: 130 },
    { title: 'Cyber Sunset (Synthesized)', artist: 'KhushalOS Synth Engine', duration: 'Loop', tempo: 110 }
  ];

  // Synthwave notes/chord sequences for different tracks
  // Neon Dreams: Cmin arpeggio
  // Grid Runner: Fmin drive
  // Cyber Sunset: Amin chill
  const getNoteFreq = (step: number, trackIdx: number): number => {
    const scaleCMin = [130.81, 155.56, 196.00, 233.08, 261.63, 311.13, 392.00, 466.16]; // C3, Eb3, G3, Bb3, C4, Eb4, G4, Bb4
    const scaleFMin = [87.31, 103.83, 130.81, 146.83, 174.61, 207.65, 261.63, 293.66];  // F2, Ab2, C3, D3, F3, Ab3, C4, D4
    const scaleAMin = [110.00, 130.81, 164.81, 220.00, 261.63, 329.63, 440.00, 523.25]; // A2, C3, E3, A3, C4, E4, A4, C5

    const activeScale = trackIdx === 0 ? scaleCMin : trackIdx === 1 ? scaleFMin : scaleAMin;

    // Simple bass arpeggiator patterns
    const pattern = [0, 2, 4, 3, 5, 4, 6, 7, 5, 3, 2, 0, 1, 3, 4, 2];
    const noteIdx = pattern[step % pattern.length];
    return activeScale[noteIdx];
  };

  // Synthesize a note
  const playSynthNote = (time: number, freq: number) => {
    if (!audioCtxRef.current || !soundEnabled) return;

    const ctx = audioCtxRef.current;
    
    // Create nodes
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Synth parameters
    osc.type = currentTrackIndex === 0 ? 'sawtooth' : currentTrackIndex === 1 ? 'square' : 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    // Volume level mapped
    const maxGain = (volume / 100) * 0.12; // cap synth volume to prevent loud pops
    
    // Envelope
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(maxGain, time + 0.03); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.28); // Decay/Release

    osc.start(time);
    osc.stop(time + 0.3);
  };

  // Synthesizer Loop Scheduler
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Initialize Web Audio Context on play
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }

    // Resume context if suspended (browser security)
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    nextNoteTimeRef.current = audioCtxRef.current.currentTime;

    const lookahead = 25.0; // ms
    const scheduleAheadTime = 0.1; // seconds

    const scheduler = () => {
      while (nextNoteTimeRef.current < audioCtxRef.current!.currentTime + scheduleAheadTime) {
        const tempo = playlist[currentTrackIndex].tempo;
        const secondsPerBeat = 60.0 / tempo;
        const stepTime = secondsPerBeat / 2; // eighth notes

        const freq = getNoteFreq(stepRef.current, currentTrackIndex);
        playSynthNote(nextNoteTimeRef.current, freq);

        nextNoteTimeRef.current += stepTime;
        stepRef.current++;
        
        // Progress Time counter
        setCurrentTime((prev) => (prev + stepTime) % 60);
      }
    };

    timerRef.current = window.setInterval(scheduler, lookahead);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, currentTrackIndex, volume, soundEnabled]);

  // Handle Play/Pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Track switching
  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    setCurrentTime(0);
    stepRef.current = 0;
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setCurrentTime(0);
    stepRef.current = 0;
  };

  const formatTime = (timeInSecs: number) => {
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const activeTrack = playlist[currentTrackIndex];

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-slate-950/80 font-sans h-full min-h-[400px]">
      
      {/* Cassette Deck representation */}
      <div className="w-full max-w-xs relative bg-slate-900 border-2 border-white/5 rounded-2xl p-4 shadow-2xl flex flex-col space-y-4 items-center mt-4">
        
        {/* Cassette Tape window */}
        <div className="w-full bg-slate-950 border border-white/10 h-24 rounded-lg flex items-center justify-between px-6 relative overflow-hidden">
          
          {/* Tape background wheel line */}
          <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-1 bg-slate-800" />

          {/* Left spinning wheel */}
          <div className={`w-12 h-12 rounded-full border-2 border-indigo-500 bg-slate-900 flex items-center justify-center relative z-10 ${
            isPlaying ? 'animate-spin' : ''
          }`} style={{ animationDuration: '4s' }}>
            <div className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-400/40" />
            <Disc className="text-indigo-400 absolute" size={24} />
          </div>

          {/* Cassette label overlay */}
          <div className="flex flex-col items-center justify-center text-[8px] font-mono text-indigo-400 z-10 bg-slate-950/90 border border-white/5 px-2 py-1 rounded">
            <span>SYNTH-A-LOG</span>
            <span className="text-slate-600">v1.2</span>
          </div>

          {/* Right spinning wheel */}
          <div className={`w-12 h-12 rounded-full border-2 border-indigo-500 bg-slate-900 flex items-center justify-center relative z-10 ${
            isPlaying ? 'animate-spin' : ''
          }`} style={{ animationDuration: '4s' }}>
            <div className="w-4 h-4 rounded-full bg-indigo-500/20 border border-indigo-400/40" />
            <Disc className="text-indigo-400 absolute" size={24} />
          </div>

        </div>

        {/* Tape info */}
        <div className="w-full bg-slate-950 border border-white/5 rounded-lg p-2.5 text-center font-mono space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">CURRENT OUTPUT</div>
          <div className="text-[11px] font-bold text-indigo-300 truncate">{activeTrack.title}</div>
          <div className="text-[9px] text-slate-500 truncate">{activeTrack.artist}</div>
        </div>

      </div>

      {/* Dynamic Equalizer Visualizer Bars (reacting to playback) */}
      <div className="h-10 flex items-end space-x-1.5 select-none my-4">
        {Array.from({ length: 15 }).map((_, i) => {
          // Dynamic styles to generate wave effect
          const delays = [0.1, 0.4, 0.2, 0.6, 0.3, 0.8, 0.5, 0.2, 0.7, 0.4, 0.9, 0.3, 0.5, 0.2, 0.6];
          const delay = delays[i];

          return (
            <div
              key={i}
              className="w-1.5 bg-indigo-500 rounded-t-full transition-all duration-300"
              style={{
                height: isPlaying ? '100%' : '10%',
                animation: isPlaying ? `float 1.2s ease-in-out infinite alternate` : 'none',
                animationDelay: `${delay}s`,
                maxHeight: '40px'
              }}
            />
          );
        })}
      </div>

      {/* Control Buttons */}
      <div className="w-full space-y-4">
        {/* Track time bar */}
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span className="text-[8px] bg-slate-900 border border-white/5 px-2 py-0.5 rounded text-indigo-400 font-bold uppercase tracking-wider">
            SYNTH ACTIVE
          </span>
          <span>{activeTrack.duration}</span>
        </div>

        {/* Play control buttons */}
        <div className="flex items-center justify-center space-x-6">
          <button
            onClick={handlePrev}
            className="p-3 bg-white/5 hover:bg-white/10 active:scale-90 border border-white/5 text-slate-400 hover:text-slate-200 rounded-full transition"
            title="Previous Track"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={togglePlay}
            className={`p-5 rounded-full border flex items-center justify-center shadow-xl active:scale-95 transition-all ${
              isPlaying
                ? 'bg-rose-600/20 border-rose-500 text-rose-400 shadow-neon-pink'
                : 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow-neon-blue'
            }`}
            title={isPlaying ? 'Pause' : 'Play Synthesizer'}
          >
            {isPlaying ? <Pause size={22} className="animate-pulse" /> : <Play size={22} />}
          </button>

          <button
            onClick={handleNext}
            className="p-3 bg-white/5 hover:bg-white/10 active:scale-90 border border-white/5 text-slate-400 hover:text-slate-200 rounded-full transition"
            title="Next Track"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Bottom indicator */}
        <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-500 font-mono text-center select-none pt-2">
          <Music size={12} className="text-indigo-400" />
          <span>REAL-TIME WEB AUDIO OSCILLATORS</span>
        </div>
      </div>

    </div>
  );
};
