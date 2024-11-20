import Image from 'next/image';
import { MessageType } from '@/app/page';

const Message = ({ username, message, timestamp, profilePicture }: MessageType) => {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-gray-50">
      <Image
        src={profilePicture}
        alt={`${username}'s profile`}
        width={40}
        height={40}
        className="w-10 h-10 rounded-full object-cover"
        unoptimized
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
