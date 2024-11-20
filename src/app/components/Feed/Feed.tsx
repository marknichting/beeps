import Message from '../Message';

const message = {
  username: 'John Doe',
  message: 'Hello, world!',
  timestamp: '2021-01-01',
  profilePicture: 'http://loremflickr.com/201/205/',
};

const Feed = () => {
  return (
    <div className="feed">
      <h2>Feed</h2>
      <Message {...message} />
    </div>
  );
};

export default Feed;
