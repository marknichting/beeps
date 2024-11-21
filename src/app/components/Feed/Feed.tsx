import { memo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MessageType } from '@/app/page';
import Message from '../Message';

const Feed = ({ messages }: { messages: MessageType[] }) => {
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
    <div className="feed bg-slate-200 rounded  overflow-auto p-4	w-full" ref={parentRef}>
      <h2 className="mb-2">Messages</h2>
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
  );
};

export default memo(Feed);
