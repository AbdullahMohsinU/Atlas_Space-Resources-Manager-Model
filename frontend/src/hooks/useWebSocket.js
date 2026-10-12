import { useState, useEffect, useRef } from 'react';

export function useWebSocket(url, bufferSize = 30) {
  const [data, setData] = useState(null);
  const [buffer, setBuffer] = useState([]);
  const [status, setStatus] = useState('CONNECTING');
  const wsRef = useRef(null);

  useEffect(() => {
    let reconnectTimeout;
    
    const connect = () => {
      setStatus('CONNECTING');
      
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          setStatus('CONNECTED');
        };

        ws.onmessage = (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            setData(parsedData);
            setBuffer(prev => {
              const newBuffer = [...prev, parsedData];
              if (newBuffer.length > bufferSize) {
                return newBuffer.slice(newBuffer.length - bufferSize);
              }
              return newBuffer;
            });
          } catch (e) {
            console.error('Failed to parse WebSocket message', e);
          }
        };

        ws.onclose = () => {
          setStatus('DISCONNECTED');
          reconnectTimeout = setTimeout(connect, 3000);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          ws.close();
        };
      } catch (error) {
        setStatus('DISCONNECTED');
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimeout);
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, bufferSize]);

  return { data, buffer, status };
}
