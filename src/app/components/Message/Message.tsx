interface MessageProps {
  username: string;
  message: string;
  timestamp: string;
  profilePicture: string;
}

const Message = ({ username, message, timestamp, profilePicture }: MessageProps) => {
  return (
    <div className="flex items-center gap-3 p-4 hover:bg-gray-50">
      <img src={profilePicture} alt={`${username}'s profile`} className="w-10 h-10 rounded-full object-cover" />
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
