// src/app/chat/page.tsx
import DifyChat from '@/components/DifyChat';
import React, { Suspense } from 'react';

const ChatPage: React.FC = () => {
  return (
    <Suspense fallback={<div>loading lalalal</div>}>
      <DifyChat
        url={process.env.NEXT_PUBLIC_CHAT_URL || '/myproxy'}
        token={process.env.NEXT_PUBLIC_CHAT_TOKEN || 'app-jRRwbSXPpFdDUahm7QmPdyFq'}
        mock={process.env.NEXT_PUBLIC_CHAT_MOCK === 'flase'}
      />
    </Suspense>
  );
};

export default ChatPage;