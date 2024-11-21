import Image from 'next/image';
import { MessageType } from '@/app/page';
import { useState } from 'react';

type VirtualStyles = {
  position: 'absolute';
  top: number;
  left: number;
  width: string;
  transform: string;
};
type MessageProps = MessageType & {
  virtualStyles: VirtualStyles;
  refProp: (node: Element | null | undefined) => void;
  virtualIndex: number;
};

const Message = ({
  username,
  message,
  timestamp,
  profilePicture,
  refProp,
  virtualStyles,
  virtualIndex,
}: MessageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className={`flex items-center gap-3 p-4 hover:bg-gray-50 ${!imageLoaded ? 'opacity-0' : 'opacity-100'}`}
      style={{ ...virtualStyles, transition: 'opacity 0.1s' }}
      ref={(el) => refProp(el)}
      data-index={virtualIndex}
      cy-data={`message-${virtualIndex}`}
    >
      <Image
        src={profilePicture}
        alt={`${username}'s profile`}
        unoptimized
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover"
        onLoad={() => setImageLoaded(true)}
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 justify-between">
          <h3 className="font-semibold">{username}</h3>
          <span className="text-sm text-gray-500">{new Date(timestamp).toLocaleString()}</span>
        </div>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Message;
