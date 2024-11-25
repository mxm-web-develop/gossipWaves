'use client'

// import { useEffect } from "react";

import dynamic from 'next/dynamic'
import '@mxmweb/difychat/style.css'
// url="/myproxy"
// token="app-jRRwbSXPpFdDUahm7QmPdyFq"
// //token='app-H9ftP5wGNWhlqcGfy1CgyDcf'
// mock={false}
const DynamicHeader = dynamic(() =>
  import('@mxmweb/difychat').then((mod) => {
    const DynamicComponent = ({ url, token }: { url: string, token: string }) => (
      <mod.ChatClientProvider>
        <mod.MxMChat url={url} token={token} mock={false} />
      </mod.ChatClientProvider>
    );
    return DynamicComponent; // 返回一个组件，而不是直接返回 JSX
  }), {
  loading: () => <p>Loading chat...</p>,
  ssr: false
}
);
const ChatPage: React.FC = () => {
  //   useEffect(() => {
  //     import('@mxmweb/testimport').then((mod) => {

  //       const a = mod.PureFunction(4, 154)
  //       console.log(a)
  //     })
  //   }, [])
  return (
    <DynamicHeader url='https://api.dify.ai/v1' token='app-jRRwbSXPpFdDUahm7QmPdyFq' />
  );
};

export default ChatPage;