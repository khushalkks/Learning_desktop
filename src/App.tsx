import React from 'react';
import { useOSStore } from './store/useOSStore';
import { BootScreen } from './components/BootScreen';
import { MenuBar } from './components/MenuBar';
import { Desktop } from './components/Desktop';
import { Taskbar } from './components/Taskbar';
import { QuickSettings } from './components/QuickSettings';
import { StartMenu } from './components/StartMenu';
import { Notifications } from './components/Notifications';
import { VoiceController } from './components/VoiceController';

const App: React.FC = () => {
  const { booting, activeTheme, crtEnabled, voiceActive, setVoiceActive } = useOSStore();

  if (booting) {
    return <BootScreen />;
  }

  // Determine theme class mapping
  let themeClass = 'theme-glass';
  if (activeTheme === 'cyberpunk') themeClass = 'theme-cyberpunk';
  if (activeTheme === 'matrix') themeClass = 'theme-matrix';

  return (
    <div 
      className={`w-screen h-screen overflow-hidden flex flex-col relative bg-slate-950 text-slate-100 ${themeClass} ${
        crtEnabled ? 'crt-overlay animate-crt-flicker' : ''
      }`}
    >
      {/* Top System Bar */}
      <MenuBar />

      {/* Main Desktop Area */}
      <Desktop />

      {/* Bottom Launcher Bar */}
      <Taskbar />

      {/* Floating System Widgets */}
      <QuickSettings />
      <StartMenu />
      
      {/* Voice Recognition Panel Overlay */}
      <VoiceController isOpen={voiceActive} onClose={() => setVoiceActive(false)} />
      
      {/* Toast Notification Overlays */}
      <Notifications />
    </div>
  );
};

export default App;
