import Image from 'next/image';
import { MessageType } from '@/app/utils';

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
  return (
    <div
      className={`flex items-center gap-3  hover:bg-gray-50 box-border  p-4`}
      style={{ ...virtualStyles, transition: 'opacity 0.1s' }}
      ref={(el) => refProp(el)}
      data-index={virtualIndex}
      cy-data={`message-${virtualIndex}`}
    >
      <div className="w-10 h-10 rounded-full relative overflow-hidden border-dotted border-slate-400 border bg-slate-400">
        <Image
          src={profilePicture}
          alt={`${username}'s profile`}
          unoptimized
          fill
          className="object-cover rounded-full"
        />
      </div>

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
