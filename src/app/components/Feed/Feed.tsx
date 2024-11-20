import { MessageType } from '@/app/page';
import Message from '../Message';

const Feed = ({ messages }: { messages: MessageType[] }) => {
  return (
    <div className="feed bg-slate-200 rounded overflow-scroll p-4	w-full">
      <h2 className="mb-2">Messages</h2>
      {messages.map((message) => {
        return <Message key={message.id} {...message} />;
      })}
    </div>
  );
};

export default Feed;
