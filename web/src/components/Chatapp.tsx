'use client'
import dynamic from "next/dynamic";
import { DialogNavigation } from "./Appnav"
import { useState } from "react";
import '@mxmweb/difychat/style.css'
const ChatEs = dynamic(() =>
  import('@mxmweb/difychat').then((mod) => {
    const DynamicComponent = ({ url, token, onActionEmmiter }: { url: string, token: string, onActionEmmiter: (type: string, data?: any) => any }) => (
      <mod.ChatClientProvider>
        <mod.MxMChat url={url} token={token} mock={false} onActionEmmiter={onActionEmmiter} />
      </mod.ChatClientProvider>
    );
    return DynamicComponent; // 返回一个组件，而不是直接返回 JSX
  }), {
  loading: () => <p>Loading chat...</p>,
  ssr: false
});
const Chatapp = ({ data }: any) => {
  const [open, setOpen] = useState(false)
  const handleAppToggle = (type: string) => {
    if (type === 'app_toggle') {
      setOpen(true);
    }
  }

  return (
    <>
      <DialogNavigation open={open} setOpen={setOpen} data={data} />
      <ChatEs url='https://api.dify.ai/v1' token='app-VNDnXOOJfkUAz6gSorRXjbW4' onActionEmmiter={(t) => handleAppToggle(t)} />
    </>
  )
}

export default Chatapp