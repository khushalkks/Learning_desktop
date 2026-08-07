import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../store/useOSStore';
import { Gamepad, Award, RotateCcw, ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

export const GamesApp: React.FC = () => {
  const { unlockAchievement } = useOSStore();
  const [activeGame, setActiveGame] = useState<'menu' | 'snake' | 'memory' | 'shooter'>('menu');

  return (
    <div className="flex-1 flex flex-col h-full font-sans select-none text-slate-200">
      {activeGame === 'menu' && (
        <div className="flex-1 p-6 flex flex-col justify-center items-center space-y-6 max-w-md mx-auto">
          <div className="text-center space-y-2">
            <Gamepad size={40} className="text-indigo-400 mx-auto animate-float" />
            <h2 className="text-lg font-bold font-display text-white uppercase tracking-wider">KOS GAMING ZONE</h2>
            <p className="text-[11px] text-slate-400 font-mono">Unlock system achievements by scoring high in these retro mini-games!</p>
          </div>

          <div className="w-full space-y-2.5">
            {[
              { id: 'snake', title: 'Retro Snake Game', desc: 'Control the snake to eat food and grow. Score 100+ points to unlock achievements.' },
              { id: 'memory', title: 'Tech Stack Memory Match', desc: 'Flip and match pairs of technical frameworks. Match all cards to win!' },
              { id: 'shooter', title: 'Stellar Space Combat', desc: 'Destroy alien invaders. Dodge collisions. Score 100+ points to win.' }
            ].map((game) => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game.id as any)}
                className="w-full p-4 bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-white/10 rounded-xl text-left flex items-start space-x-4 transition group"
              >
                <div className="p-2 bg-slate-900 border border-white/5 rounded-lg text-indigo-400 font-bold select-none shrink-0 group-hover:scale-105 transition-all">
                  GP
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors font-sans text-sm">
                    {game.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 leading-normal font-mono">
                    {game.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-900 border border-white/5 rounded-xl font-mono text-[9px] text-slate-500 text-center w-full">
            SYSTEM ACHIEVEMENTS LINKED & SYNCED
          </div>
        </div>
      )}

      {activeGame === 'snake' && <SnakeGame goBack={() => setActiveGame('menu')} onWin={() => unlockAchievement('game_win')} />}
      {activeGame === 'memory' && <MemoryGame goBack={() => setActiveGame('menu')} onWin={() => unlockAchievement('game_win')} />}
      {activeGame === 'shooter' && <SpaceShooter goBack={() => setActiveGame('menu')} onWin={() => unlockAchievement('game_win')} />}
    </div>
  );
};

// ==========================================
// 1. RETRO SNAKE GAME
// ==========================================
interface GameProps {
  goBack: () => void;
  onWin: () => void;
}

const SnakeGame: React.FC<GameProps> = ({ goBack, onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('kos_snake_highscore') || '0'));

  const directionRef = useRef<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const snakeRef = useRef<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const foodRef = useRef({ x: 5, y: 5 });

  const GRID_SIZE = 20;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
          break;
        case 'ArrowDown':
          if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
          if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
          if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    const spawnFood = () => {
      let newFood;
      while (true) {
        newFood = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        };
        // Ensure food does not spawn inside the snake
        const hitSnake = snakeRef.current.some(s => s.x === newFood.x && s.y === newFood.y);
        if (!hitSnake) break;
      }
      foodRef.current = newFood;
    };

    const updateGame = () => {
      // Move snake
      const head = { ...snakeRef.current[0] };
      switch (directionRef.current) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collision with walls or self
      if (
        head.x < 0 || head.x >= GRID_SIZE || 
        head.y < 0 || head.y >= GRID_SIZE ||
        snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        return;
      }

      // Prepend head
      snakeRef.current.unshift(head);

      // Check if eat food
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore((prev) => {
          const newScore = prev + 10;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('kos_snake_highscore', String(newScore));
          }
          if (newScore >= 100) {
            onWin();
          }
          return newScore;
        });
        spawnFood();
      } else {
        snakeRef.current.pop();
      }

      // Render
      ctx.fillStyle = '#020617'; // dark bg
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid accents
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvas.height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvas.width, i * cellSize);
        ctx.stroke();
      }

      // Draw Food
      ctx.fillStyle = '#f43f5e'; // red food
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * cellSize + cellSize/2, 
        foodRef.current.y * cellSize + cellSize/2, 
        cellSize/2.5, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Snake
      snakeRef.current.forEach((segment, idx) => {
        ctx.fillStyle = idx === 0 ? '#34d399' : '#10b981'; // head is lighter green
        ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
      });
    };

    const interval = setInterval(updateGame, 130);
    return () => clearInterval(interval);
  }, [gameOver, highScore]);

  const restartGame = () => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    directionRef.current = 'RIGHT';
    setScore(0);
    setGameOver(false);
  };

  const handleMobileNav = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (dir === 'UP' && directionRef.current !== 'DOWN') directionRef.current = 'UP';
    if (dir === 'DOWN' && directionRef.current !== 'UP') directionRef.current = 'DOWN';
    if (dir === 'LEFT' && directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
    if (dir === 'RIGHT' && directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
  };

  return (
    <div className="flex-1 p-5 flex flex-col justify-between items-center h-full">
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between font-mono select-none border-b border-white/5 pb-2">
        <button onClick={goBack} className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 font-bold">
          <span>&lt; MENU</span>
        </button>
        <div className="flex space-x-4">
          <span>SCORE: <b className="text-indigo-400">{score}</b></span>
          <span>HIGH: <b className="text-slate-400">{highScore}</b></span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative border border-indigo-500/20 rounded-xl overflow-hidden shadow-neon-blue my-4 bg-slate-950">
        <canvas ref={canvasRef} width={280} height={280} className="block" />
        
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 text-center select-none font-mono">
            <div className="text-rose-500 font-bold text-lg">GAME OVER</div>
            <div className="text-xs text-slate-400">FINAL SCORE: {score}</div>
            <button
              onClick={restartGame}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
            >
              <RotateCcw size={12} />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* On-screen controls for mobile/ease of play */}
      <div className="flex flex-col items-center space-y-1.5 select-none w-full max-w-[200px]">
        <button onClick={() => handleMobileNav('UP')} className="p-2.5 bg-slate-900 border border-white/5 hover:bg-slate-800 rounded-xl"><ArrowUp size={16} /></button>
        <div className="flex space-x-4">
          <button onClick={() => handleMobileNav('LEFT')} className="p-2.5 bg-slate-900 border border-white/5 hover:bg-slate-800 rounded-xl"><ArrowLeft size={16} /></button>
          <div className="w-10"></div>
          <button onClick={() => handleMobileNav('RIGHT')} className="p-2.5 bg-slate-900 border border-white/5 hover:bg-slate-800 rounded-xl"><ArrowRight size={16} /></button>
        </div>
        <button onClick={() => handleMobileNav('DOWN')} className="p-2.5 bg-slate-900 border border-white/5 hover:bg-slate-800 rounded-xl"><ArrowDown size={16} /></button>
      </div>
    </div>
  );
};

// ==========================================
// 2. TECH MEMORY CARD MATCH
// ==========================================
const MemoryGame: React.FC<GameProps> = ({ goBack, onWin }) => {
  const techSymbols = ['React', 'TS', 'Tailwind', 'Docker', 'GraphQL', 'NextJS'];
  const [cards, setCards] = useState<{ id: number; symbol: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initGame = () => {
    // Duplicate symbols, shuffle
    const paired = [...techSymbols, ...techSymbols].map((sym, index) => ({
      id: index,
      symbol: sym,
      isFlipped: false,
      isMatched: false
    }));

    // Shuffle
    const shuffled = paired.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (gameWon) return;
    // Prevent clicking flipped or matched
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (flippedIndices.length >= 2) return;

    const updated = [...cards];
    updated[index].isFlipped = true;
    setCards(updated);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // Matched
        setTimeout(() => {
          const matched = [...cards];
          matched[firstIdx].isMatched = true;
          matched[secondIdx].isMatched = true;
          setCards(matched);
          setFlippedIndices([]);

          // Check if won
          const allMatched = matched.every((c) => c.isMatched);
          if (allMatched) {
            setGameWon(true);
            onWin();
          }
        }, 500);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          const flippedBack = [...cards];
          flippedBack[firstIdx].isFlipped = false;
          flippedBack[secondIdx].isFlipped = false;
          setCards(flippedBack);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="flex-1 p-5 flex flex-col justify-between items-center h-full">
      <div className="w-full flex items-center justify-between font-mono border-b border-white/5 pb-2">
        <button onClick={goBack} className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 font-bold">
          <span>&lt; MENU</span>
        </button>
        <div>MOVES: <b className="text-indigo-400">{moves}</b></div>
      </div>

      {gameWon ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center font-mono py-12">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-neon-green">
            <Award size={26} className="animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase">VICTORY UNLOCKED!</h3>
            <p className="text-[10px] text-slate-400 mt-1">Matched all Framework tiles in {moves} moves.</p>
          </div>
          <button
            onClick={initGame}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
          >
            <RotateCcw size={12} />
            <span>PLAY AGAIN</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] my-6">
          {cards.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(idx)}
              className={`h-20 rounded-xl border flex items-center justify-center font-mono text-[10px] font-black transition-all duration-300 relative ${
                card.isMatched
                  ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400 shadow shadow-emerald-500/10'
                  : card.isFlipped
                  ? 'bg-indigo-950/20 border-indigo-500 text-indigo-300 shadow shadow-indigo-500/10 rotate-y-180'
                  : 'bg-slate-900 border-white/5 text-transparent hover:bg-slate-800'
              }`}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '?'}
            </button>
          ))}
        </div>
      )}

      <div className="text-[9px] text-slate-500 font-mono text-center">
        Flip tiles to match framework logos. Match all pairs.
      </div>
    </div>
  );
};

// ==========================================
// 3. STELLAR SPACE COMBAT
// ==========================================
interface Alien {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
}
interface Laser {
  x: number;
  y: number;
}

const SpaceShooter: React.FC<GameProps> = ({ goBack, onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem('kos_shooter_highscore') || '0'));

  const playerRef = useRef({ x: 120, y: 240, w: 26, h: 18, speed: 6 });
  const lasersRef = useRef<Laser[]>([]);
  const aliensRef = useRef<Alien[]>([]);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const animationFrameIdRef = useRef<number | null>(null);

  // Monitor keydowns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowUp') {
        // Spawn laser
        if (!gameOver) {
          lasersRef.current.push({
            x: playerRef.current.x + playerRef.current.w / 2 - 1.5,
            y: playerRef.current.y
          });
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameOver]);

  // Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let spawnTimer = 0;

    const updateLoop = () => {
      if (gameOver) return;

      // Handle horizontal moves
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
        playerRef.current.x = Math.max(0, playerRef.current.x - playerRef.current.speed);
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
        playerRef.current.x = Math.min(canvas.width - playerRef.current.w, playerRef.current.x + playerRef.current.speed);
      }

      // Move lasers
      lasersRef.current.forEach((l) => (l.y -= 7));
      // filter offscreen lasers
      lasersRef.current = lasersRef.current.filter((l) => l.y > 0);

      // Spawn alien ships
      spawnTimer++;
      if (spawnTimer > 35) {
        aliensRef.current.push({
          x: Math.random() * (canvas.width - 24),
          y: -20,
          w: 20,
          h: 16,
          speed: Math.random() * 1.5 + 1.2
        });
        spawnTimer = 0;
      }

      // Move aliens
      aliensRef.current.forEach((a) => (a.y += a.speed));

      // Collisions check: Laser hits Alien
      lasersRef.current.forEach((l, lIdx) => {
        aliensRef.current.forEach((a, aIdx) => {
          if (
            l.x + 3 > a.x && l.x < a.x + a.w &&
            l.y < a.y + a.h && l.y + 6 > a.y
          ) {
            // Hit! Remove alien and laser
            aliensRef.current.splice(aIdx, 1);
            lasersRef.current.splice(lIdx, 1);
            setScore((prev) => {
              const newScore = prev + 10;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('kos_shooter_highscore', String(newScore));
              }
              if (newScore >= 100) {
                onWin();
              }
              return newScore;
            });
          }
        });
      });

      // Collision check: Alien hits Player
      aliensRef.current.forEach((a) => {
        const player = playerRef.current;
        if (
          a.x + a.w > player.x && a.x < player.x + player.w &&
          a.y + a.h > player.y && a.y < player.y + player.h
        ) {
          setGameOver(true);
        }
      });

      // Filter missed aliens off-screen
      aliensRef.current = aliensRef.current.filter((a) => a.y < canvas.height);

      // Clear & Draw
      ctx.fillStyle = '#020617'; // dark space
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars ambient
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      for(let i=0; i<15; i++) {
        const sx = (Math.sin(i*200) + 1) * canvas.width / 2;
        const sy = (Date.now() / 30 + i * 40) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Draw Player SpaceShip
      ctx.fillStyle = '#6366f1'; // indigo player
      ctx.shadowColor = '#6366f1';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.moveTo(playerRef.current.x + playerRef.current.w/2, playerRef.current.y);
      ctx.lineTo(playerRef.current.x, playerRef.current.y + playerRef.current.h);
      ctx.lineTo(playerRef.current.x + playerRef.current.w, playerRef.current.y + playerRef.current.h);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw lasers
      ctx.fillStyle = '#ec4899'; // pink laser
      lasersRef.current.forEach((l) => {
        ctx.fillRect(l.x, l.y, 3, 6);
      });

      // Draw Aliens
      ctx.fillStyle = '#f43f5e'; // red alien
      aliensRef.current.forEach((a) => {
        ctx.fillRect(a.x, a.y, a.w, a.h);
      });

      animationFrameIdRef.current = requestAnimationFrame(updateLoop);
    };

    updateLoop();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [gameOver, highScore]);

  const restartGame = () => {
    playerRef.current = { x: 120, y: 240, w: 26, h: 18, speed: 6 };
    lasersRef.current = [];
    aliensRef.current = [];
    setScore(0);
    setGameOver(false);
  };

  const handleMobileMove = (dir: 'LEFT' | 'RIGHT' | 'FIRE') => {
    if (dir === 'LEFT') {
      playerRef.current.x = Math.max(0, playerRef.current.x - 20);
    }
    if (dir === 'RIGHT') {
      playerRef.current.x = Math.min(280 - playerRef.current.w, playerRef.current.x + 20);
    }
    if (dir === 'FIRE' && !gameOver) {
      lasersRef.current.push({
        x: playerRef.current.x + playerRef.current.w / 2 - 1.5,
        y: playerRef.current.y
      });
    }
  };

  return (
    <div className="flex-1 p-5 flex flex-col justify-between items-center h-full">
      <div className="w-full flex items-center justify-between font-mono border-b border-white/5 pb-2 select-none">
        <button onClick={goBack} className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 font-bold">
          <span>&lt; MENU</span>
        </button>
        <div className="flex space-x-4">
          <span>SCORE: <b className="text-indigo-400">{score}</b></span>
          <span>HIGH: <b className="text-slate-400">{highScore}</b></span>
        </div>
      </div>

      <div className="relative border border-indigo-500/20 rounded-xl overflow-hidden shadow-neon-blue my-4 bg-slate-950 select-none">
        <canvas ref={canvasRef} width={280} height={280} className="block" />
        
        {gameOver && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 text-center select-none font-mono">
            <div className="text-rose-500 font-bold text-lg">SHIPS DESTROYED</div>
            <div className="text-xs text-slate-400">FINAL SCORE: {score}</div>
            <button
              onClick={restartGame}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
            >
              <RotateCcw size={12} />
              <span>PLAY AGAIN</span>
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 select-none w-full max-w-[260px]">
        <button onClick={() => handleMobileMove('LEFT')} className="flex-1 py-2 bg-slate-900 border border-white/5 rounded-xl font-bold font-mono text-[10px]">L</button>
        <button onClick={() => handleMobileMove('FIRE')} className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold font-mono text-[11px] shadow">FIRE</button>
        <button onClick={() => handleMobileMove('RIGHT')} className="flex-1 py-2 bg-slate-900 border border-white/5 rounded-xl font-bold font-mono text-[10px]">R</button>
      </div>
    </div>
  );
};
