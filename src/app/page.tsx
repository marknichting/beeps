'use client';

import { useEffect, useRef, useState } from 'react';
import Feed from './components/Feed/Feed';
import Sidebar from './components/Sidebar';

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

type ConnectionStatus = 'Connected' | 'Connecting...' | 'Disconnected' | 'Unknown';

export default function Dashboard() {
  const connection = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [status, setStatus] = useState<ConnectionStatus>('Connecting...');

  useEffect(() => {
    const socket = new WebSocket('ws://beeps.gg/stream');

    // Connection opened
    const handleOpen = (event: Event) => {
      socket.send('Connection established');
      console.log(event);
    };

    socket.addEventListener('open', handleOpen);

    // Listen for messages
    const handleMessage = (event: MessageEvent) => {
      // console.log('Message from server ', event.data);
      const parsedData = JSON.parse(event.data);
      const newMessage = {
        id: parsedData.id,
        username: parsedData.user.username,
        message: parsedData.message,
        timestamp: parsedData.timestamp,
        profilePicture: parsedData.user.image_url,
      };
      setMessages((prevMessages) => [newMessage, ...prevMessages]);
      setTotalEvents((prevTotalEvents) => prevTotalEvents + 1);
    };
    socket.addEventListener('message', handleMessage);

    connection.current = socket;

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      connection.current = null;
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex justify-between items-center">
        <h1>Dashboard</h1>

        <button onClick={() => connection.current?.close()}>Close</button>
      </div>
      <div className="grow flex gap-4 max-h-[calc(100vh-10rem)]">
        <Sidebar connectionStatus={status} totalEvents={totalEvents} />
        <Feed messages={messages} />
      </div>
    </div>
  );
}
