import { memo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ConnectionStatus, MessageType } from '@/app/utils';
import Message from '../Message';

const Feed = ({
  messages,
  modalProps,
  status,
}: {
  messages: MessageType[];
  modalProps: [boolean, () => void];
  status: ConnectionStatus;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [showModal, handleDismiss] = modalProps;

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
    <div className="feed bg-slate-200 rounded p-4	w-full relative">
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
                id={message.id}
                username={message.username}
                message={message.message}
                profilePicture={message.profilePicture}
                timestamp={message.timestamp}
                refProp={virtualizer.measureElement}
                virtualIndex={virtualRow.index}
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
      {showModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200/40 rounded">
          <div className="flex flex-col items-center w-1/3 bg-white p-6 rounded gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={status === 'Connecting...' ? '/loadingSpinner.svg' : '/error.svg'}
              alt={status === 'Connecting...' ? 'loading' : 'error'}
              className="w-10 h-10"
            />
            <span className="text-gray-600 text-center">
              {status === 'Connecting...' ? 'Attempting to connect...' : 'Server Disconnected'}
            </span>
            <button className="bg-blue-500 text-white px-4 py-1 rounded-md" onClick={handleDismiss}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Feed);
