'use client';

import { useEffect, useRef, useState } from 'react';
import Feed from './components/Feed/Feed';
import Sidebar from './components/Sidebar';
import useBuffer from './hooks/useBuffer';

export type MessageType = {
  id: string;
  username: string;
  message: string;
  timestamp: string;
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

type ConnectionStatus = 'Connected' | 'Connecting...' | 'Disconnected' | 'Disconnecting' | 'Unknown';

export default function Dashboard() {
  const connection = useRef<WebSocket | null>(null);
  const timeElapsed = useRef(0);
  const [status, setStatus] = useState<ConnectionStatus>('Connecting...');
  const { bufferState, addMessage } = useBuffer();

  useEffect(() => {
    const socket = new WebSocket('ws://beeps.gg/stream');
    connection.current = socket;

    // Connection opened
    const handleOpen = (event: Event) => {
      setStatus('Connected');
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

    socket.addEventListener('close', () => {
      setStatus('Disconnected');
    });

    return () => {
      if (socket.readyState === WebSocket.OPEN) socket.close();
      connection.current = null;
    };
  }, [addMessage]);

  return (
    <div id="dashboard" className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h1>Dashboard</h1>
        <button onClick={() => connection.current?.close()}>Close</button>
      </div>
      <div className="grow flex gap-4 max-h-[calc(100vh-10rem)]">
        <Sidebar
          connectionStatus={status}
          timeElapsed={status === 'Connected' ? Math.round((new Date().getTime() - timeElapsed.current) / 1000) : 0}
          totalEvents={bufferState.eventsCt}
          rate={bufferState.rate}
        />
        <Feed messages={bufferState.messages} />
      </div>
    </div>
  );
}
