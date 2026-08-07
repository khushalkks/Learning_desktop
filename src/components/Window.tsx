import React, { useRef, useState, useEffect } from 'react';
import { useOSStore } from '../store/useOSStore';
import type { WindowItem } from '../store/useOSStore';
import { Minus, Square, Copy, X } from 'lucide-react';

interface WindowProps {
  windowState: WindowItem;
  children: React.ReactNode;
}

export const Window: React.FC<WindowProps> = ({ windowState, children }) => {
  const {
    activeWindowId,
    activeTheme,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useOSStore();

  const { id, title, isOpen, isMinimized, isMaximized, zIndex, x, y, w, h, minW, minH } = windowState;

  // Local state to make dragging/resizing feel butter-smooth
  const [localPos, setLocalPos] = useState({ x, y });
  const [localSize, setLocalSize] = useState({ w, h });
  const windowRef = useRef<HTMLDivElement>(null);

  // Sync with store when store changes externally (e.g. on reset or custom commands)
  useEffect(() => {
    setLocalPos({ x, y });
  }, [x, y]);

  useEffect(() => {
    setLocalSize({ w, h });
  }, [w, h]);

  const isFocused = activeWindowId === id;

  // Dragging logic
  const handleDragStart = (e: React.MouseEvent) => {
    if (isMaximized) return;
    focusWindow(id);
    
    // Ignore drag if clicking buttons
    const target = e.target as HTMLElement;
    if (target.closest('.win-btn')) return;

    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = localPos.x;
    const initialY = localPos.y;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;
      
      // Calculate new position
      const newX = Math.max(0, Math.min(window.innerWidth - 100, initialX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, initialY + deltaY));
      
      setLocalPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Sync with Zustand store
      updateWindowPosition(id, localPos.x, localPos.y);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Resizing logic
  const handleResizeStart = (e: React.MouseEvent, direction: 'r' | 'b' | 'br') => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(id);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialW = localSize.w;
    const initialH = localSize.h;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      let deltaX = moveEvent.clientX - startX;
      let deltaY = moveEvent.clientY - startY;

      let newW = initialW;
      let newH = initialH;

      if (direction === 'r' || direction === 'br') {
        newW = Math.max(minW, initialW + deltaX);
      }
      if (direction === 'b' || direction === 'br') {
        newH = Math.max(minH, initialH + deltaY);
      }

      setLocalSize({ w: newW, h: newH });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      // Sync with Zustand store
      updateWindowSize(id, localSize.w, localSize.h);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (!isOpen) return null;
  if (isMinimized) return null;

  // Window styling configurations based on theme
  let themeHeaderClass = 'bg-slate-900/90 text-slate-300 border-b border-white/5';
  let themeWindowBorder = 'border-white/10 shadow-glass';
  let themeTitleText = 'text-slate-200 font-semibold';
  
  if (activeTheme === 'cyberpunk') {
    themeHeaderClass = 'bg-purple-950/80 text-pink-400 border-b border-pink-500/50';
    themeWindowBorder = 'border-pink-500 shadow-neon-pink';
    themeTitleText = 'text-cyan-400 font-display font-bold tracking-wider';
  } else if (activeTheme === 'matrix') {
    themeHeaderClass = 'bg-black text-green-500 border-b border-green-500';
    themeWindowBorder = 'border-green-500 shadow-neon-green';
    themeTitleText = 'text-green-500 font-mono font-bold';
  }

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: 'absolute',
        top: '40px', // height of top menu bar
        left: 0,
        width: '100vw',
        height: 'calc(100vh - 88px)', // height of top menu bar (40px) + dock/taskbar (48px)
        zIndex,
      }
    : {
        position: 'absolute',
        left: `${localPos.x}px`,
        top: `${localPos.y}px`,
        width: `${localSize.w}px`,
        height: `${localSize.h}px`,
        zIndex,
      };

  return (
    <div
      ref={windowRef}
      style={windowStyle}
      onClick={() => focusWindow(id)}
      className={`glass-panel rounded-2xl flex flex-col overflow-hidden animate-fade-in transition-all duration-300 ${
        isFocused ? 'glass-panel-focused ring-1 ring-indigo-500/10' : 'shadow-lg'
      } border ${themeWindowBorder}`}
    >
      {/* Title Bar (macOS centered style) */}
      <div
        onMouseDown={handleDragStart}
        className={`px-4 py-3 flex items-center justify-between cursor-move select-none relative ${themeHeaderClass}`}
      >
        {/* Left Side: Window Controls (macOS circular dots style) */}
        <div className="flex items-center space-x-1.5 win-btn z-10">
          {/* Close Button (Red Dot) */}
          <button
            onClick={() => closeWindow(id)}
            className="w-3 h-3 rounded-full flex items-center justify-center bg-rose-500/80 hover:bg-rose-400 text-transparent hover:text-rose-950 transition-all duration-200 shadow-[0_0_6px_rgba(244,63,94,0.3)] relative group/btn"
            title="Close"
          >
            <X size={6} className="absolute stroke-[3px] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </button>

          {/* Minimize Button (Yellow Dot) */}
          <button
            onClick={() => minimizeWindow(id)}
            className="w-3 h-3 rounded-full flex items-center justify-center bg-amber-500/80 hover:bg-amber-400 text-transparent hover:text-amber-950 transition-all duration-200 shadow-[0_0_6px_rgba(245,158,11,0.3)] relative group/btn"
            title="Minimize"
          >
            <Minus size={6} className="absolute stroke-[3px] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
          </button>

          {/* Maximize/Restore Button (Green Dot) */}
          <button
            onClick={() => maximizeWindow(id)}
            className="w-3 h-3 rounded-full flex items-center justify-center bg-emerald-500/80 hover:bg-emerald-400 text-transparent hover:text-emerald-950 transition-all duration-200 shadow-[0_0_6px_rgba(16,185,129,0.3)] relative group/btn"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            {isMaximized ? (
              <Copy size={5} className="absolute stroke-[3px] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            ) : (
              <Square size={5} className="absolute stroke-[3px] opacity-0 group-hover/btn:opacity-100 transition-opacity" />
            )}
          </button>
        </div>

        {/* Center: Title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`text-[11px] uppercase tracking-wider select-none font-bold font-display ${themeTitleText}`}>
            {title}
          </span>
        </div>

        {/* Right Side: Status Badge */}
        <div className="flex items-center space-x-1.5 text-[9px] font-mono text-slate-500 select-none z-10">
          <span className={`w-1 h-1 rounded-full ${isFocused ? 'bg-indigo-400' : 'bg-slate-700'}`} />
          <span className="hidden sm:inline">{isFocused ? 'active' : 'inactive'}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-slate-950/70 text-slate-100 flex flex-col relative">
        {children}
      </div>

      {/* Resize Handles (Hidden when maximized) */}
      {!isMaximized && (
        <>
          <div
            onMouseDown={(e) => handleResizeStart(e, 'r')}
            className="resize-handle resize-handle-r"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'b')}
            className="resize-handle resize-handle-b"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, 'br')}
            className="resize-handle resize-handle-br"
          />
        </>
      )}
    </div>
  );
};
