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

export default function Dashboard() {
  const connection = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);

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
    <div className="dashboard">
      <h1>Dashboard</h1>
      <button onClick={() => connection.current?.close()}>Close</button>
      <div className="flex">
        <Sidebar totalEvents={totalEvents} />
        <Feed messages={messages} />
      </div>
    </div>
  );
}
