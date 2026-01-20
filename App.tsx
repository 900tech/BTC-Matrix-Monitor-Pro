
import React, { useState, useEffect } from 'react';
import MatrixRain from './components/MatrixRain';
import Terminal from './components/Terminal';
import CrtOverlay from './components/CrtOverlay';
import { useBinanceTicker } from './hooks/useBinanceTicker';

const App: React.FC = () => {
  const { data, logs, isConnected } = useBinanceTicker('btcusdt');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black flex items-center justify-center text-[#00ff41]">
      {/* Background Effect */}
      <MatrixRain />
      
      {/* Scanline/CRT Overlay */}
      <CrtOverlay />

      {/* Main UI */}
      <div className="relative z-20 w-full h-full flex items-center justify-center p-2 sm:p-4 landscape:p-2">
        <Terminal 
          data={data} 
          logs={logs} 
          isConnected={isConnected} 
        />
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-4 right-4 z-30 flex gap-2">
        <button 
          onClick={toggleFullscreen}
          className="px-3 py-1 border border-[#00ff41] text-xs opacity-50 hover:opacity-100 hover:bg-[#00ff41] hover:text-black transition-all uppercase"
        >
          {isFullscreen ? '[ Exit_FS ]' : '[ Full_Screen ]'}
        </button>
      </div>

      {/* System Status HUD */}
      <div className="absolute top-4 left-4 z-30 text-[10px] opacity-40 hidden sm:block">
        <div>OS: MATRIX_v3.1.0</div>
        <div>PATH: ROOT/CRYPTO/BTC_STREAM</div>
        <div>STATUS: {isConnected ? 'LINK_ACTIVE' : 'LINK_OFFLINE'}</div>
      </div>
    </div>
  );
};

export default App;
