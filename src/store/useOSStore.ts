import { create } from 'zustand';
import confetti from 'canvas-confetti';

export interface WindowItem {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
  minW: number;
  minH: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  text: string;
  type: 'info' | 'success' | 'achievement';
  timestamp: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
  points: number;
}

interface OSState {
  booting: boolean;
  isLocked: boolean;
  activeTheme: 'glass' | 'cyberpunk' | 'matrix';
  soundEnabled: boolean;
  volume: number;
  brightness: number;
  crtEnabled: boolean;
  quickSettingsOpen: boolean;
  startMenuOpen: boolean;
  windows: WindowItem[];
  activeWindowId: string | null;
  notifications: SystemNotification[];
  achievements: Achievement[];
  notes: { id: string; title: string; content: string; lastUpdated: string }[];
  voiceActive: boolean;
  user: { name: string; avatar: string; email: string } | null;
  
  // Actions
  setUser: (user: { name: string; avatar: string; email: string } | null) => void;
  setBooting: (booting: boolean) => void;
  setLocked: (locked: boolean) => void;
  setTheme: (theme: 'glass' | 'cyberpunk' | 'matrix') => void;
  setSoundEnabled: (enabled: boolean) => void;
  setVolume: (vol: number) => void;
  setBrightness: (bright: number) => void;
  setCrtEnabled: (enabled: boolean) => void;
  toggleQuickSettings: (open?: boolean) => void;
  toggleStartMenu: (open?: boolean) => void;
  setVoiceActive: (active: boolean) => void;
  
  // Window Actions
  openWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, w: number, h: number) => void;
  
  // Notification Actions
  addNotification: (title: string, text: string, type?: 'info' | 'success' | 'achievement') => void;
  removeNotification: (id: string) => void;
  
  // Achievement Actions
  unlockAchievement: (id: string) => void;
  
  // Notes Actions
  saveNote: (id: string, title: string, content: string) => void;
  deleteNote: (id: string) => void;
  
  resetSystem: () => void;
}

const defaultWindows: WindowItem[] = [
  { id: 'about', title: 'About Me', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 120, y: 70, w: 750, h: 520, minW: 400, minH: 350 },
  { id: 'projects', title: 'Projects Explorer', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 180, y: 90, w: 850, h: 560, minW: 500, minH: 400 },
  { id: 'terminal', title: 'Terminal Emulator', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 90, y: 110, w: 700, h: 460, minW: 450, minH: 300 },
  { id: 'contact', title: 'Contact Center', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 220, y: 80, w: 600, h: 520, minW: 400, minH: 400 },
  { id: 'notes', title: 'Notes Pad', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 240, y: 130, w: 650, h: 460, minW: 400, minH: 300 },
  { id: 'music', title: 'Music Player', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 340, y: 140, w: 380, h: 510, minW: 360, minH: 480 },
  { id: 'research', title: 'Research Lab', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 140, y: 150, w: 720, h: 520, minW: 450, minH: 350 },
  { id: 'games', title: 'Gaming Zone', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 200, y: 40, w: 580, h: 630, minW: 550, minH: 600 },
  { id: 'ai', title: 'AI Assistant', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 260, y: 120, w: 600, h: 500, minW: 380, minH: 350 },
  { id: 'settings', title: 'System Settings', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10, x: 280, y: 160, w: 500, h: 400, minW: 400, minH: 300 },
];

const defaultAchievements: Achievement[] = [
  { id: 'boot', title: 'Welcome to KhushalOS!', description: 'Complete the startup sequence and enter the desktop.', unlocked: false, points: 10 },
  { id: 'about', title: 'The Architect', description: 'Open the About Me app to check Khushal\'s resume details.', unlocked: false, points: 15 },
  { id: 'projects', title: 'The Explorer', description: 'Examine portfolio projects in the Projects Explorer.', unlocked: false, points: 15 },
  { id: 'contact', title: 'Say Hello', description: 'Open the Contact Center form.', unlocked: false, points: 15 },
  { id: 'matrix', title: 'Enter the Matrix', description: 'Activate the secret Matrix code rain rain mode.', unlocked: false, points: 25 },
  { id: 'cowsay', title: 'ASCII Whisperer', description: 'Run the custom cowsay command in the terminal.', unlocked: false, points: 10 },
  { id: 'game_win', title: 'Ultimate Gamer', description: 'Win Memory Match or score over 100 in Snake/Space Shooter.', unlocked: false, points: 30 },
  { id: 'theme_change', title: 'Style Switcher', description: 'Change the system theme via terminal or menu bar.', unlocked: false, points: 10 },
  { id: 'explorer', title: 'OS Connoisseur', description: 'Open all applications inside the operating system.', unlocked: false, points: 50 },
];

export const useOSStore = create<OSState>((set, get) => ({
  booting: true,
  isLocked: true,
  activeTheme: 'glass',
  soundEnabled: true,
  volume: 80,
  brightness: 100,
  crtEnabled: true,
  quickSettingsOpen: false,
  startMenuOpen: false,
  windows: defaultWindows,
  activeWindowId: null,
  notifications: [],
  achievements: defaultAchievements,
  notes: JSON.parse(localStorage.getItem('khushal_os_notes') || '[]'),
  voiceActive: false,
  user: JSON.parse(localStorage.getItem('khushal_os_user') || 'null'),

  setUser: (user) => {
    set({ user });
    if (user) {
      localStorage.setItem('khushal_os_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('khushal_os_user');
    }
  },
  setBooting: (booting) => set({ booting }),
  setVoiceActive: (voiceActive) => set({ voiceActive }),
  setLocked: (isLocked) => {
    set({ isLocked });
    if (!isLocked) {
      // Trigger boot achievement once unlocked
      get().unlockAchievement('boot');
    }
  },
  setTheme: (activeTheme) => {
    set({ activeTheme });
    get().unlockAchievement('theme_change');
  },
  setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
  setVolume: (volume) => set({ volume }),
  setBrightness: (brightness) => set({ brightness }),
  setCrtEnabled: (crtEnabled) => set({ crtEnabled }),
  toggleQuickSettings: (open) => set((state) => ({ 
    quickSettingsOpen: open !== undefined ? open : !state.quickSettingsOpen,
    startMenuOpen: false 
  })),
  toggleStartMenu: (open) => set((state) => ({ 
    startMenuOpen: open !== undefined ? open : !state.startMenuOpen,
    quickSettingsOpen: false 
  })),

  openWindow: (id) => {
    set((state) => {
      // Close start menu
      const startMenuOpen = false;

      // Find max z-index
      const maxZIndex = state.windows.reduce((max, w) => (w.isOpen ? Math.max(max, w.zIndex) : max), 10);
      
      const newWindows = state.windows.map((w) => {
        if (w.id === id) {
          return { ...w, isOpen: true, isMinimized: false, zIndex: maxZIndex + 1 };
        }
        return w;
      });

      // Award achievements based on which window is opened
      setTimeout(() => {
        if (id === 'about') get().unlockAchievement('about');
        if (id === 'projects') get().unlockAchievement('projects');
        if (id === 'contact') get().unlockAchievement('contact');
        
        // Check if all apps have been opened
        const activeWins = newWindows.filter(w => w.isOpen && w.id !== 'settings');
        if (activeWins.length >= 8) {
          get().unlockAchievement('explorer');
        }
      }, 100);

      return {
        windows: newWindows,
        activeWindowId: id,
        startMenuOpen
      };
    });
  },

  closeWindow: (id) => {
    set((state) => {
      const newWindows = state.windows.map((w) => {
        if (w.id === id) {
          return { ...w, isOpen: false, isMinimized: false };
        }
        return w;
      });

      const openWindows = newWindows.filter((w) => w.isOpen && !w.isMinimized);
      const nextActiveId = openWindows.length > 0 
        ? openWindows.reduce((highest, w) => w.zIndex > highest.zIndex ? w : highest, openWindows[0]).id
        : null;

      return {
        windows: newWindows,
        activeWindowId: nextActiveId,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const newWindows = state.windows.map((w) => {
        if (w.id === id) {
          return { ...w, isMinimized: true };
        }
        return w;
      });

      const openWindows = newWindows.filter((w) => w.isOpen && !w.isMinimized);
      const nextActiveId = openWindows.length > 0
        ? openWindows.reduce((highest, w) => w.zIndex > highest.zIndex ? w : highest, openWindows[0]).id
        : null;

      return {
        windows: newWindows,
        activeWindowId: nextActiveId,
        startMenuOpen: false
      };
    });
  },

  maximizeWindow: (id) => {
    set((state) => {
      const newWindows = state.windows.map((w) => {
        if (w.id === id) {
          return { ...w, isMaximized: !w.isMaximized };
        }
        return w;
      });

      return {
        windows: newWindows,
        activeWindowId: id,
        startMenuOpen: false
      };
    });
  },

  focusWindow: (id) => {
    set((state) => {
      if (state.activeWindowId === id) return {};

      const maxZIndex = state.windows.reduce((max, w) => (w.isOpen ? Math.max(max, w.zIndex) : max), 10);

      const newWindows = state.windows.map((w) => {
        if (w.id === id) {
          return { ...w, isMinimized: false, zIndex: maxZIndex + 1 };
        }
        return w;
      });

      return {
        windows: newWindows,
        activeWindowId: id,
        startMenuOpen: false
      };
    });
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    }));
  },

  updateWindowSize: (id, w, h) => {
    set((state) => ({
      windows: state.windows.map((win) => (win.id === id ? { ...win, w, h } : win)),
    }));
  },

  addNotification: (title, text, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: SystemNotification = {
      id,
      title,
      text,
      type,
      timestamp: new Date(),
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove notification after 4 seconds
    setTimeout(() => {
      get().removeNotification(id);
    }, 4000);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },

  unlockAchievement: (id) => {
    const target = get().achievements.find((a) => a.id === id);
    if (target && !target.unlocked) {
      // Set unlocked status
      set((state) => ({
        achievements: state.achievements.map((a) => 
          a.id === id ? { ...a, unlocked: true, unlockedAt: new Date() } : a
        )
      }));

      // Add OS notification toast
      get().addNotification(
        '🏆 Achievement Unlocked!',
        `${target.title} (+${target.points} XP)`,
        'achievement'
      );

      // Trigger party confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  },

  saveNote: (id, title, content) => {
    set((state) => {
      const now = new Date().toLocaleString();
      let updatedNotes;
      const exists = state.notes.some(n => n.id === id);

      if (exists) {
        updatedNotes = state.notes.map(n => n.id === id ? { ...n, title, content, lastUpdated: now } : n);
      } else {
        updatedNotes = [...state.notes, { id, title, content, lastUpdated: now }];
      }

      localStorage.setItem('khushal_os_notes', JSON.stringify(updatedNotes));
      return { notes: updatedNotes };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const updatedNotes = state.notes.filter(n => n.id !== id);
      localStorage.setItem('khushal_os_notes', JSON.stringify(updatedNotes));
      return { notes: updatedNotes };
    });
  },

  resetSystem: () => {
    set({
      activeTheme: 'glass',
      soundEnabled: true,
      volume: 80,
      brightness: 100,
      crtEnabled: true,
      quickSettingsOpen: false,
      startMenuOpen: false,
      windows: defaultWindows,
      activeWindowId: null,
      notifications: [],
      achievements: defaultAchievements,
      user: null,
    });
    localStorage.removeItem('khushal_os_notes');
    localStorage.removeItem('khushal_os_user');
    get().addNotification('System Reset', 'All settings and achievements have been reset.', 'info');
  }
}));
