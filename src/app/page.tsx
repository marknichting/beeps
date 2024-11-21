'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import Feed from './components/Feed/Feed';
import Sidebar from './components/Sidebar';
import useBuffer from './hooks/useBuffer';
import useScreenSize from './hooks/useScreenSize';
import {
  statusReducer,
  getConnectionStatus,
  isWebSocketMessage,
  INITIAL_RECONNECT_DELAY,
  MAX_RECONNECT_ATTEMPTS,
  initialStatus,
} from './utils';

export default function Dashboard() {
  const connection = useRef<WebSocket | null>(null);
  const timeElapsed = useRef(0);
  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const [statusState, dispatchStatus] = useReducer(statusReducer, initialStatus);
  const { bufferState, addMessage } = useBuffer();
  const isLargerThanMd = useScreenSize('md', true);

  const connect = useCallback(() => {
    const socket = new WebSocket('ws://beeps.gg/stream');
    connection.current = socket;

    const handleOpen = (event: Event) => {
      dispatchStatus({ type: 'Connected' });
      reconnectAttempts.current = 0;
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      timeElapsed.current = new Date().getTime();
      if (
        event.currentTarget &&
        'readyState' in event.currentTarget &&
        typeof event.currentTarget.readyState === 'number'
      ) {
        dispatchStatus({ type: getConnectionStatus(event.currentTarget.readyState) });
      }
    };

    const handleMessage = (event: MessageEvent) => {
      if (!event.data) return;
      const parsedData = JSON.parse(event.data);
      console.log('adding message to buffer');
      if (isWebSocketMessage(parsedData)) {
        addMessage({
          id: parsedData.id,
          username: parsedData.user.username,
          message: parsedData.message,
          timestamp: parsedData.timestamp,
          profilePicture: parsedData.user.image_url,
        });
      }
    };

    const handleClose = (event: CloseEvent) => {
      if (!event.wasClean && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempts.current);
        reconnectTimeout.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          dispatchStatus({ type: 'Connecting...' });
          connect();
        }, delay);
        return;
      }
      dispatchStatus({ type: 'Disconnected' });
    };

    socket.addEventListener('close', handleClose);
    socket.addEventListener('open', handleOpen);
    socket.addEventListener('message', handleMessage);
    socket.addEventListener('error', () => {
      /* log error to monitoring service*/
    });
  }, [addMessage]);

  useEffect(() => {
    connect();

    return () => {
      if (connection.current?.readyState === WebSocket.OPEN) connection.current?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      connection.current = null;
      reconnectAttempts.current = 0;
    };
  }, [connect]);

  return (
    <div id="dashboard" className="flex flex-col gap-4 h-full max-w-[1000px] mx-auto">
      <div className="flex justify-between items-center">
        <h1>Dashboard</h1>
        {/* 
        for development purposes only 
        <button onClick={() => connection.current?.close()}>Close</button>
        */}
      </div>
      <div className={`grow flex ${isLargerThanMd ? 'flex-row' : 'flex-col'} gap-4 max-h-[calc(100vh-10rem)]`}>
        <Sidebar
          connectionStatus={statusState.status}
          timeElapsed={
            statusState.status === 'Connected' ? Math.round((new Date().getTime() - timeElapsed.current) / 1000) : 0
          }
          totalEvents={bufferState.eventsCt}
          rate={bufferState.rate}
        />
        <Feed
          messages={bufferState.messages}
          status={statusState.status}
          modalProps={[statusState.showModal, () => dispatchStatus({ type: 'close modal' })]}
        />
      </div>
    </div>
  );
}
