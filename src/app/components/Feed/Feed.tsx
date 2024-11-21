import { memo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ConnectionStatus, MessageType } from '@/app/page';
import Message from '../Message';

const Feed = ({ messages, status }: { messages: MessageType[]; status: ConnectionStatus }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: messages.length,
    estimateSize: () => 100,
    getScrollElement: () => parentRef.current,
    overscan: 5,
    measureElement: (element) => {
      return element?.getBoundingClientRect().height || 100;
    },
  });

  return (
    <div className="feed bg-slate-200 rounded p-4	w-full relative" ref={parentRef}>
      <h2 className="mb-2">Messages</h2>
      <div className="overflow-auto h-[calc(100%-2.5rem)] w-full" ref={parentRef}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const message = messages[virtualRow.index];
            return (
              <Message
                key={message.id}
                virtualIndex={virtualRow.index}
                {...message}
                refProp={virtualizer.measureElement}
                virtualStyles={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
      {status !== 'Connected' && (
        <div className=" absolute top-0 left-0 flex justify-center items-center bg-slate-200/40 rounded w-full h-full">
          <div className="flex flex-col w-1/3 items-center bg-white p-6 rounded gap-2">
            {status === 'Connecting...' ? (
              <img src="/loadingSpinner.svg" alt="loading" className="w-10 h-10" />
            ) : (
              <img src="/error.svg" alt="error" className="w-10 h-10" />
            )}
            <span className="text-gray-600">
              {status === 'Connecting...' ? 'Attempting to connect...' : 'Server Disconnected'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Feed);
