import dynamic from 'next/dynamic';
const ChatApp = dynamic(() =>
  import('@/components/Chatapp').then((mod) => mod.default), {
  loading: () => <p>Loading chat...</p>,
});
const ChatPage = () => {
  return (
    <ChatApp />
  );
};

export default ChatPage