import React, { useState, useEffect, useRef } from 'react';
import { useOSStore } from '../store/useOSStore';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export const TerminalApp: React.FC = () => {
  const { setTheme, openWindow, unlockAchievement } = useOSStore();
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'KhushalOS Terminal v4.0.0', type: 'success' },
    { text: 'Type "help" for a list of available system commands.', type: 'output' },
    { text: '', type: 'output' }
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Focus terminal input on click
  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);

  // Listen for global custom terminal events (enables trigger links across apps)
  useEffect(() => {
    const handleGlobalCommand = (e: Event) => {
      const customEvent = e as CustomEvent;
      const cmd = customEvent.detail;
      if (cmd) {
        openWindow('terminal');
        setTimeout(() => {
          executeCommand(cmd);
        }, 150);
      }
    };
    window.addEventListener('terminal_command', handleGlobalCommand);
    return () => window.removeEventListener('terminal_command', handleGlobalCommand);
  }, []);

  const executeCommand = (cmdStr: string) => {
    const cleanCmd = cmdStr.trim();
    if (!cleanCmd) return;

    const newHistory = [...history, { text: `guest@khushal-os:~$ ${cleanCmd}`, type: 'input' as const }];
    const parts = cleanCmd.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let outputLines: TerminalLine[] = [];

    switch (command) {
      case 'help':
        outputLines = [
          { text: 'Available commands:', type: 'success' },
          { text: '  help       - Display this list of shell commands', type: 'output' },
          { text: '  whoami     - Learn about Khushal\'s professional profile', type: 'output' },
          { text: '  projects   - Summary details of my portfolio projects', type: 'output' },
          { text: '  skills     - View my system diagnostics and tech stack levels', type: 'output' },
          { text: '  contact    - Print my email, LinkedIn and GitHub details', type: 'output' },
          { text: '  neofetch   - Display system diagnostics and OS specs logo', type: 'output' },
          { text: '  theme      - Switch themes. Usage: theme [glass | cyberpunk | matrix]', type: 'output' },
          { text: '  matrix     - Trigger the digital code rain rain animation', type: 'output' },
          { text: '  cowsay     - Make a cow speak. Usage: cowsay [message]', type: 'output' },
          { text: '  sudo       - Superuser override authorization', type: 'output' },
          { text: '  clear      - Clear the terminal console logs', type: 'output' }
        ];
        break;

      case 'whoami':
        outputLines = [
          { text: 'User: Khushal Kumar Sahu', type: 'success' },
          { text: 'Role: Full-stack Developer & AI Solutions Architect', type: 'output' },
          { text: 'Level: B.Tech Computer Science Undergrad (2023 - 2027)', type: 'output' },
          { text: 'Focus: Scalable web platforms, LLM integrations, MERN stack & RAG pipelines.', type: 'output' },
          { text: 'Interests: 300+ LeetCode problems solved, NLP, and agentic workflows.', type: 'output' }
        ];
        break;

      case 'skills':
        unlockAchievement('skills');
        outputLines = [
          { text: 'SYSTEM DIAGNOSTICS - CORE STACK:', type: 'success' },
          { text: '  React / NextJS  [====================] 90% (Active)', type: 'output' },
          { text: '  TypeScript      [==================--] 85% (Stable)', type: 'output' },
          { text: '  Tailwind CSS    [====================] 95% (Optimized)', type: 'output' },
          { text: '  Node / Express  [=================---] 80% (Core)', type: 'output' },
          { text: '  SQL / MongoDB   [=================---] 85% (Connected)', type: 'output' },
          { text: '  WebGL / ThreeJS [==============------] 70% (Experimental)', type: 'output' }
        ];
        break;

      case 'projects':
        outputLines = [
          { text: 'RECENT PORTFOLIO PROJECTS:', type: 'success' },
          { text: '  1. MediCare - AI Medical Care Platform (Vector RAG, gpt-4o-mini)', type: 'output' },
          { text: '  2. ReadyBoss - Resume & Job Application Tracker (Gemini, Cohere APIs)', type: 'output' },
          { text: '  3. CortexCraft - AI-Powered Study Assistant (Gemini & Hugging Face)', type: 'output' },
          { text: '  Type "projects open [app]" or launch via Desktop shortcuts.', type: 'output' }
        ];
        break;

      case 'contact':
        outputLines = [
          { text: 'CONNECT DETAILS:', type: 'success' },
          { text: '  Email:    kkskumarsahu31@gmail.com', type: 'output' },
          { text: '  GitHub:   github.com/khushalkks', type: 'output' },
          { text: '  LinkedIn: LinkedIn Profile available in contact client.', type: 'output' }
        ];
        break;

      case 'neofetch':
        outputLines = [
          { text: '       .---.          guest@khushal-os', type: 'success' },
          { text: '      /     \\         ----------------', type: 'output' },
          { text: '      \\     /         OS: KhushalOS v4.0.0 (x86_64)', type: 'output' },
          { text: '       `---`          Shell: sh (Zustand Shell v1.0)', type: 'output' },
          { text: '      /|   |\\         Uptime: 2 mins', type: 'output' },
          { text: '     / |   | \\        Resolution: 1920x1080', type: 'output' },
          { text: '    /  |___|  \\       CPU: AMD Ryzen 9 5900X (24) @ 3.7GHz', type: 'output' },
          { text: '   /           \\      GPU: NVIDIA GeForce RTX 4080 (16GB VRAM)', type: 'output' },
          { text: '  /_____________/     Memory: 32768MB OK', type: 'output' }
        ];
        break;

      case 'theme':
        if (args.length === 0) {
          outputLines = [{ text: 'Specify a theme: theme [glass | cyberpunk | matrix]', type: 'error' }];
        } else {
          const themeName = args[0].toLowerCase();
          if (themeName === 'glass' || themeName === 'cyberpunk' || themeName === 'matrix') {
            setTheme(themeName as any);
            outputLines = [{ text: `Theme successfully updated to: ${themeName}`, type: 'success' }];
          } else {
            outputLines = [{ text: `Unknown theme: ${themeName}. Try glass, cyberpunk, or matrix`, type: 'error' }];
          }
        }
        break;

      case 'matrix':
        setTheme('matrix');
        unlockAchievement('matrix');
        outputLines = [
          { text: 'Down the rabbit hole...', type: 'success' },
          { text: 'Matrix rain protocol triggered.', type: 'output' }
        ];
        break;

      case 'cowsay':
        unlockAchievement('cowsay');
        const sayMsg = args.length > 0 ? args.join(' ') : 'Moo! Welcome to KhushalOS!';
        const borderLength = sayMsg.length + 2;
        const line = '-'.repeat(borderLength);
        outputLines = [
          { text: `  ${line}`, type: 'output' },
          { text: `| ${sayMsg} |`, type: 'output' },
          { text: `  ${line}`, type: 'output' },
          { text: '         \\   ^__^', type: 'output' },
          { text: '          \\  (oo)\\_______', type: 'output' },
          { text: '             (__)\\       )\\/\\', type: 'output' },
          { text: '                 ||----w |', type: 'output' },
          { text: '                 ||     ||', type: 'output' }
        ];
        break;

      case 'sudo':
        outputLines = [
          { text: '[sudo] Enter password for guest:', type: 'error' },
          { text: 'Warning: This incident will be reported to the sysadmin.', type: 'error' },
          { text: 'Guest has no root permissions on KhushalOS.', type: 'error' }
        ];
        break;

      case 'clear':
        setHistory([]);
        setInput('');
        return;

      default:
        outputLines = [{ text: `bash: command not found: ${command}. Type "help" for valid inputs.`, type: 'error' }];
        break;
    }

    setHistory([...newHistory, ...outputLines]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    }
  };

  return (
    <div 
      onClick={focusInput}
      className="flex-1 p-4 bg-black/90 font-mono text-sm leading-relaxed overflow-y-auto flex flex-col justify-start select-text crt-overlay h-full min-h-[250px]"
    >
      <div className="flex-1 space-y-1">
        {history.map((line, idx) => {
          let colorClass = 'text-slate-300';
          if (line.type === 'input') colorClass = 'text-sky-400 font-bold';
          else if (line.type === 'success') colorClass = 'text-emerald-400 font-bold';
          else if (line.type === 'error') colorClass = 'text-rose-400 font-semibold';

          return (
            <div key={idx} className={`${colorClass} whitespace-pre-wrap break-all`}>
              {line.text}
            </div>
          );
        })}
        <div ref={terminalEndRef} />
      </div>

      {/* Input row */}
      <div className="flex items-center space-x-2 shrink-0 pt-2 border-t border-white/5 mt-3 select-none">
        <span className="text-emerald-400 font-bold">guest@khushal-os:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none font-mono text-slate-100 placeholder:text-slate-800 text-sm focus:ring-0 p-0"
          placeholder="..."
          autoFocus
        />
      </div>
    </div>
  );
};
