'use client';

import { useEffect, useRef, useState } from 'react';
import Feed from './components/Feed/Feed';
import Sidebar from './components/Sidebar';
import useBuffer from './hooks/useBuffer';
import useScreenSize from './hooks/useScreenSize';

export type MessageType = {
  id: string;
  username: string;
  message: string;
  timestamp: number;
  profilePicture: string;
};

const getConnectionStatus = (readyState?: number) => {
  switch (readyState) {
    case WebSocket.OPEN:
      return 'Connected';
    case WebSocket.CONNECTING:
      return 'Connecting...';
    case WebSocket.CLOSING:
      return 'Disconnected';
    case WebSocket.CLOSED:
      return 'Disconnected';
    default:
      return 'Unknown';
  }
};

export type ConnectionStatus = 'Connected' | 'Connecting...' | 'Disconnected' | 'Disconnecting' | 'Unknown';
const MAX_RECONNECT_ATTEMPTS = 5;
const INITIAL_RECONNECT_DELAY = 1000;

export default function Dashboard() {
  const connection = useRef<WebSocket | null>(null);
  const timeElapsed = useRef(0);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const [status, setStatus] = useState<ConnectionStatus>('Connecting...');
  const { bufferState, addMessage } = useBuffer();
  const isLargerThanMd = useScreenSize('md', true);

  const connect = () => {
    // const socket = new WebSocket('ws://beeps.gg/stream');
    const socket = new WebSocket('ws://localhost:8080');
    connection.current = socket;

    // Connection opened
    const handleOpen = (event: Event) => {
      setStatus('Connected');
      reconnectAttempts.current = 0;
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      timeElapsed.current = new Date().getTime();
      if (
        event.currentTarget &&
        'readyState' in event.currentTarget &&
        typeof event.currentTarget.readyState === 'number'
      ) {
        setStatus(getConnectionStatus(event.currentTarget.readyState));
      }
    };
    socket.addEventListener('open', handleOpen);
    // Listen for messages
    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      const parsedData = JSON.parse(event.data);
      addMessage({
        id: parsedData.id,
        username: parsedData.user.username,
        message: parsedData.message,
        timestamp: parsedData.timestamp,
        profilePicture: parsedData.user.image_url,
      });
    };

    socket.addEventListener('message', handleMessage);
    socket.addEventListener('error', (event) => {
      // log error to monitoring service
    });

    socket.addEventListener('close', (event) => {
      if (!event.wasClean && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current);
        reconnectTimeout.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          setStatus('Connecting...');
          connect();
        }, delay);
        return;
      }
      setStatus('Disconnected');
    });
  };

  useEffect(() => {
    connect();

    return () => {
      if (connection.current?.readyState === WebSocket.OPEN) connection.current?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      connection.current = null;
      reconnectAttempts.current = 0;
    };
  }, [addMessage]);

  return (
    <div id="dashboard" className="flex flex-col gap-4 h-full max-w-[1000px] mx-auto">
      <div className="flex justify-between items-center">
        <h1>Dashboard</h1>
        <button onClick={() => connection.current?.close()}>Close</button>
      </div>
      <div className={`grow flex ${isLargerThanMd ? 'flex-row' : 'flex-col'} gap-4 max-h-[calc(100vh-10rem)]`}>
        <Sidebar
          connectionStatus={status}
          timeElapsed={status === 'Connected' ? Math.round((new Date().getTime() - timeElapsed.current) / 1000) : 0}
          totalEvents={bufferState.eventsCt}
          rate={bufferState.rate}
        />
        <Feed messages={bufferState.messages} status={status} />
      </div>
    </div>
  );
}
