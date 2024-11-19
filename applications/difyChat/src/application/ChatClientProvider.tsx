
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 创建一个默认的 QueryClient 实例
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});


const ChatClientProvider = ({ children, client }: { children: ReactNode; client?: QueryClient }) => {
  return (
    <QueryClientProvider client={client || defaultQueryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ChatClientProvider;