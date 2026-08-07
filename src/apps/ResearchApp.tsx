import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RefreshCw, Sliders, Info, Zap } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

export const ResearchApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Control parameters
  const [particleCount, setParticleCount] = useState(80);
  const [particleSpeed, setParticleSpeed] = useState(2);
  const [repulsionForce, setRepulsionForce] = useState(80); // cursor distance
  const [colorPreset, setColorPreset] = useState<'cyan' | 'pink' | 'green' | 'multi'>('cyan');
  const [isPaused, setIsPaused] = useState(false);

  // Mouse coords
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to fill the layout bounds
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial particles
    let particles: Particle[] = [];
    const createParticles = () => {
      particles = [];
      const presets = {
        cyan: ['#22d3ee', '#06b6d4', '#0891b2', '#0e7490'],
        pink: ['#f472b6', '#ec4899', '#db2777', '#be185d'],
        green: ['#4ade80', '#22c55e', '#16a34a', '#15803d'],
        multi: ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6']
      };
      
      const colors = presets[colorPreset];

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 3 + 1.5;
        particles.push({
          x: Math.random() * (canvas.width - radius * 2) + radius,
          y: Math.random() * (canvas.height - radius * 2) + radius,
          vx: (Math.random() - 0.5) * particleSpeed,
          vy: (Math.random() - 0.5) * particleSpeed,
          radius,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };
    createParticles();

    let animationId: number;

    const updatePhysics = () => {
      if (isPaused) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist/100) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update particle kinematics and apply cursor repulsion
      particles.forEach((p) => {
        // Cursor repulsion physics
        const dx = p.x - mouseRef.current.x;
        const dy = p.y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < repulsionForce) {
          const force = (repulsionForce - dist) / repulsionForce;
          const angle = Math.atan2(dy, dx);
          // push particle away
          p.vx += Math.cos(angle) * force * 0.6;
          p.vy += Math.sin(angle) * force * 0.6;
        }

        // Limit maximum velocities
        const maxV = particleSpeed * 2.5;
        p.vx = Math.max(-maxV, Math.min(maxV, p.vx));
        p.vy = Math.max(-maxV, Math.min(maxV, p.vy));

        // Add standard velocities
        p.x += p.vx;
        p.y += p.vy;

        // Apply friction/drag to slow down repelled particles
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Bounce on boundaries
        if (p.x - p.radius < 0) {
          p.x = p.radius;
          p.vx = -p.vx;
        } else if (p.x + p.radius > canvas.width) {
          p.x = canvas.width - p.radius;
          p.vx = -p.vx;
        }

        if (p.y - p.radius < 0) {
          p.y = p.radius;
          p.vy = -p.vy;
        } else if (p.y + p.radius > canvas.height) {
          p.y = canvas.height - p.radius;
          p.vy = -p.vy;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
      });

      animationId = requestAnimationFrame(updatePhysics);
    };

    updatePhysics();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [particleCount, particleSpeed, repulsionForce, colorPreset, isPaused]);

  return (
    <div ref={containerRef} className="flex-1 flex flex-col md:flex-row h-full font-sans select-text overflow-hidden">
      
      {/* Control panel left */}
      <div className="w-full md:w-60 bg-slate-950/40 border-b md:border-b-0 md:border-r border-white/5 p-4 space-y-4 shrink-0 flex flex-col justify-between overflow-y-auto select-none">
        <div className="space-y-4">
          <div className="flex items-center space-x-1.5 border-b border-white/5 pb-2">
            <Sliders size={14} className="text-indigo-400" />
            <span className="text-xs font-bold font-display text-white">SANDBOX OPTIONS</span>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <div className="text-[10px] text-slate-500 font-mono font-bold uppercase">Color Presets</div>
            <div className="grid grid-cols-2 gap-1.5">
              {['cyan', 'pink', 'green', 'multi'].map((c) => (
                <button
                  key={c}
                  onClick={() => setColorPreset(c as any)}
                  className={`py-1.5 rounded-lg border font-mono text-[9px] font-bold capitalize transition ${
                    colorPreset === c
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400 shadow'
                      : 'bg-slate-900 border-white/5 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Slider: Speed */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
              <span>PARTICLE VELOCITY</span>
              <span>{particleSpeed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={particleSpeed}
              onChange={(e) => setParticleSpeed(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-900 h-1 rounded cursor-pointer"
            />
          </div>

          {/* Slider: Count */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
              <span>PARTICLE COUNT</span>
              <span>{particleCount}</span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              value={particleCount}
              onChange={(e) => setParticleCount(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-900 h-1 cursor-pointer"
            />
          </div>

          {/* Slider: Cursor Distance */}
          <div className="space-y-1">
            <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400">
              <span>CURSOR REPULSION</span>
              <span>{repulsionForce}px</span>
            </div>
            <input
              type="range"
              min="30"
              max="150"
              value={repulsionForce}
              onChange={(e) => setRepulsionForce(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-900 h-1 cursor-pointer"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-2 pt-4 border-t border-white/5">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`w-full py-2 rounded-xl border flex items-center justify-center space-x-1.5 text-xs font-bold font-mono transition ${
              isPaused
                ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                : 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
            }`}
          >
            {isPaused ? <Play size={12} /> : <Pause size={12} />}
            <span>{isPaused ? 'RESUME SIMULATION' : 'PAUSE PHYSICS'}</span>
          </button>
          
          <div className="flex items-start space-x-1.5 p-2 bg-slate-900 border border-white/5 rounded-xl text-[9px] text-slate-500 font-mono leading-normal">
            <Info size={12} className="shrink-0 text-indigo-400 mt-0.5" />
            <span>Hover cursor over the canvas on the right to repel particles.</span>
          </div>
        </div>
      </div>

      {/* Interactive Physics Canvas */}
      <div className="flex-1 bg-slate-950 relative h-full min-h-[250px]">
        <div className="absolute top-3 left-3 bg-slate-900/80 border border-white/5 rounded-lg px-2.5 py-1 text-[9px] font-mono font-bold text-indigo-400 z-10 flex items-center space-x-1 select-none">
          <Zap size={10} className="animate-pulse" />
          <span>HTML5 VECTOR KINEMATICS ENGINE</span>
        </div>
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="absolute inset-0 block cursor-crosshair"
        />
      </div>

    </div>
  );
};
