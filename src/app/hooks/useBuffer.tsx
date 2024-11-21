import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageType } from '../page';

export const calculateRate = (messages: MessageType[]) => {
  const now = new Date().getTime();
  const oldestMessage = new Date(messages[messages.length - 1]?.timestamp).getTime() || now;
  const timeSinceFirstMessage = now - oldestMessage + 1000;
  return Math.trunc(((messages.length + 1) / (timeSinceFirstMessage / 60000)) * 100) / 100;
};

type BufferState = {
  messages: MessageType[];
  eventsCt: number;
  rate: number;
};

function useBuffer() {
  const messageBuffer = useRef<MessageType[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [bufferState, setBufferState] = useState<BufferState>({
    messages: [],
    eventsCt: 0,
    rate: 0,
  });

  const processBuffer = useCallback(() => {
    const messagesInBuffer = [...messageBuffer.current];
    messageBuffer.current = [];
    if (messagesInBuffer.length > 0) {
      setBufferState((bufferObj) => {
        const newMessages = [...messagesInBuffer, ...bufferObj.messages];
        const trimmedMessages = newMessages.slice(0, 1000);
        return {
          messages: trimmedMessages,
          eventsCt: bufferObj.eventsCt + messagesInBuffer.length,
          rate: calculateRate(trimmedMessages),
        };
      });
    } else {
      setBufferState((bufferObj) => ({
        ...bufferObj,
        rate: calculateRate(bufferObj.messages),
      }));
    }
  }, []);

  const addMessage = useCallback(
    (newMessage: MessageType) => {
      messageBuffer.current.push(newMessage);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(processBuffer, 750);
    },
    [processBuffer]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { bufferState, addMessage };
}

export default useBuffer;
