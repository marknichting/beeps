import { MessageType } from '@/app/page';
import Message from '../Message';

const Feed = ({ messages }: { messages: MessageType[] }) => {
  return (
    <div className="feed">
      <h2>Feed</h2>
      {messages.map((message) => {
        return <Message key={message.id} {...message} />;
      })}
    </div>
  );
};

export default Feed;
