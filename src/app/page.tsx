'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
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

type ConnectionStatus = 'Connected' | 'Connecting...' | 'Disconnected' | 'Disconnecting' | 'Unknown';

type State = {
  messages: MessageType[];
  totalEvents: number;
  rate: number;
};

const initialState: State = {
  messages: [],
  totalEvents: 0,
  rate: 0,
};

type Action = {
  type: 'newMessage' | 'updateRate';
  payload?: MessageType;
};

const calculateRate = (state: typeof initialState) => {
  const now = new Date().getTime();
  const oldestMessage = new Date(state.messages[state.messages.length - 1]?.timestamp).getTime() || now;
  const timeSinceFirstMessage = now - oldestMessage + 1000;
  return Math.trunc(((state.messages.length + 1) / (timeSinceFirstMessage / 60000)) * 100) / 100;
};

const eventsReducer = (state: typeof initialState, action: Action) => {
  switch (action.type) {
    case 'newMessage':
      if (!action.payload) return state;
      return {
        ...state,
        totalEvents: state.totalEvents + 1,
        messages: [action.payload, ...state.messages.slice(0, 100)],
      };
    case 'updateRate':
      return { ...state, rate: calculateRate(state) };
    default:
      return state;
  }
};

export default function Dashboard() {
  const connection = useRef<WebSocket | null>(null);
  const timeElapsed = useRef(0);
  const [status, setStatus] = useState<ConnectionStatus>('Connecting...');
  const [state, eventsDispatch] = useReducer(eventsReducer, initialState);

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
      eventsDispatch({
        type: 'newMessage',
        payload: {
          id: parsedData.id,
          username: parsedData.user.username,
          message: parsedData.message,
          timestamp: parsedData.timestamp,
          profilePicture: parsedData.user.image_url,
        },
      });
    };

    socket.addEventListener('message', handleMessage);

    socket.addEventListener('close', () => {
      setStatus('Disconnected');
    });
    const rateTimer = setInterval(() => {
      console.log('rate update');
      eventsDispatch({ type: 'updateRate' });
    }, 1000);

    return () => {
      if (socket.readyState === WebSocket.OPEN) socket.close();
      connection.current = null;
      clearInterval(rateTimer);
    };
  }, []);

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
          totalEvents={state.totalEvents}
          rate={state.rate}
        />
        <Feed messages={state.messages} />
      </div>
    </div>
  );
}
