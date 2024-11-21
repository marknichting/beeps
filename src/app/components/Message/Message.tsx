import Image from 'next/image';
import { MessageType } from '@/app/page';

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
      className="flex items-center gap-3 p-4 hover:bg-gray-50"
      style={virtualStyles}
      ref={(el) => refProp(el)}
      data-index={virtualIndex}
    >
      <Image
        src={profilePicture}
        alt={`${username}'s profile`}
        unoptimized
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{username}</h3>
          <span className="text-sm text-gray-500">{timestamp}</span>
        </div>
        <p className="text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Message;
