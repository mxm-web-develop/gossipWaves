'use client'
import dynamic from 'next/dynamic';
import React from 'react'
//import * as dify from '@mxmweb/difychat'
// import '@mxmweb/difychat/style.css'

const DynamicHeader = dynamic(() => import('@mxmweb/difychat'), {
  ssr: false
})

const ChatPage: React.FC = () => {
  // console.log(dify)
  return <DynamicHeader />
}

export default ChatPage

