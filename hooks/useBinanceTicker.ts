
import { useState, useEffect, useRef, useCallback } from 'react';

export interface TickerData {
  price: string;
  change: string;
  isPump: boolean;
  isDump: boolean;
  volume: string;
}

export const useBinanceTicker = (symbol: string) => {
  const [data, setData] = useState<TickerData | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const lastPriceRef = useRef<number>(0);
  const wsRef = useRef<WebSocket | null>(null);

  const addLog = useCallback((msg: string) => {
    const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs(prev => [`[${time}] > ${msg}`, ...prev].slice(0, 10));
  }, []);

  useEffect(() => {
    const connect = () => {
      addLog(`Initializing stream: ${symbol.toUpperCase()}`);
      const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@ticker`);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        addLog("ACCESS GRANTED. Connection encrypted.");
      };

      ws.onmessage = (event) => {
        const raw = JSON.parse(event.data);
        const currentPrice = parseFloat(raw.c);
        const isPump = currentPrice > lastPriceRef.current;
        const isDump = currentPrice < lastPriceRef.current;

        setData({
          price: currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
          change: parseFloat(raw.P).toFixed(2),
          isPump,
          isDump,
          volume: parseFloat(raw.v).toFixed(0)
        });

        if (Math.random() > 0.95) {
          addLog(`Pulse: ${raw.v} volume processed.`);
        }

        lastPriceRef.current = currentPrice;
      };

      ws.onclose = () => {
        setIsConnected(false);
        addLog("CONNECTION SEVERED. Retrying...");
        setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        addLog("SYSTEM_ERROR: Socket failure.");
      };
    };

    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [symbol, addLog]);

  return { data, logs, isConnected };
};
