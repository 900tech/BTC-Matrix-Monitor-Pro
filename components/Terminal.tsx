
import React, { useState, useEffect } from 'react';
import { TickerData } from '../hooks/useBinanceTicker';

interface TerminalProps {
  data: TickerData | null;
  logs: string[];
  isConnected: boolean;
}

const Terminal: React.FC<TerminalProps> = ({ data, logs, isConnected }) => {
  const [glitchPrice, setGlitchPrice] = useState<string | null>(null);

  // Random price glitch effect for hacker aesthetic
  useEffect(() => {
    if (!data) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const chars = '$@#%&?!0123456789';
        let noise = '';
        for (let i = 0; i < data.price.length; i++) {
          noise += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setGlitchPrice(noise);
        setTimeout(() => setGlitchPrice(null), 80);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [data]);

  const priceColor = data?.isDump ? 'text-[#ff3333]' : data?.isPump ? 'text-white' : 'text-[#00ff41]';
  const priceShadow = data?.isDump 
    ? '0 0 20px #ff3333' 
    : data?.isPump 
      ? '0 0 30px #fff, 0 0 10px #00ff41' 
      : '0 0 15px #00ff41';

  return (
    <div className="relative bg-black/85 border-2 border-[#008f11] p-4 sm:p-8 flex flex-col w-full max-w-[900px] h-fit max-h-full overflow-hidden shadow-[0_0_30px_rgba(0,143,17,0.3)] backdrop-blur-sm landscape:flex-row landscape:gap-6 landscape:items-stretch">
      
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff41]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff41]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff41]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff41]" />

      {/* Main Stats Area */}
      <div className="flex-1 flex flex-col justify-center items-center text-center landscape:text-left landscape:items-start">
        <div className="text-xs sm:text-lg tracking-[4px] opacity-70 mb-2 flex items-center gap-2">
          SYSTEM_OVERRIDE: MONITORING_STREAM
          <span className="w-2 h-4 bg-[#00ff41] animate-pulse" />
        </div>

        <div className="text-[10px] sm:text-xs text-[#008f11] uppercase tracking-widest mt-4">
          BITCOIN_VALUE_DETECTED
        </div>
        
        <div 
          className={`text-5xl sm:text-7xl lg:text-8xl font-bold transition-all duration-300 my-2 sm:my-4 ${priceColor} select-none truncate max-w-full`}
          style={{ textShadow: priceShadow }}
        >
          {data ? (glitchPrice ? `$${glitchPrice}` : `$${data.price}`) : 'LOADING...'}
        </div>

        <div className="flex flex-wrap gap-4 sm:gap-8 justify-center landscape:justify-start">
          <div>
            <div className="text-[10px] text-[#008f11] uppercase">24h Change</div>
            <div className={`text-xl sm:text-3xl ${data?.change.startsWith('-') ? 'text-[#ff3333]' : 'text-[#00ff41]'}`}>
              {data ? (parseFloat(data.change) > 0 ? `+${data.change}` : data.change) : '--.--'}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#008f11] uppercase">24h Volume</div>
            <div className="text-xl sm:text-3xl text-[#00ff41] opacity-80">
              {data ? data.volume : '----'} BTC
            </div>
          </div>
        </div>
      </div>

      {/* Console Logs Area */}
      <div className="mt-6 border-t border-dashed border-[#008f11]/40 pt-4 flex flex-col h-32 sm:h-40 landscape:mt-0 landscape:border-t-0 landscape:border-l landscape:pl-6 landscape:h-auto landscape:w-64 flex-shrink-0">
        <div className="text-[10px] text-[#008f11] uppercase mb-2 opacity-50">System Logs</div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden font-mono text-[10px] sm:text-xs leading-tight">
          {logs.map((log, i) => (
            <div key={i} className={`mb-1 ${i === 0 ? 'text-[#00ff41]' : 'text-[#008f11] opacity-70'}`}>
              {log}
            </div>
          ))}
          {!isConnected && <div className="text-[#ff3333] animate-pulse">!! FATAL: DISCONNECTED !!</div>}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
