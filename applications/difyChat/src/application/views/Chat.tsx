import { Avatar, Divider, DotLoading } from "antd-mobile"
import { useMobileOrientation } from "react-device-detect"
import { cn } from "@udecode/cn"
import MInput from "./components/MInputer"
import ReactMarkdown from 'react-markdown';
import useAppStore from "../store";
import { useEffect, useState } from "react";
import { ModuleState } from "../types/chat.types";
import { api_getConversations, api_getMessages } from "../services";
import dayjs from "dayjs";
import NavBar from './components/Navbar'
import { api_sendMessage } from "../services/apis/send_message";
const Chat = () => {
  const { isPortrait } = useMobileOrientation()
  const chat_data = useAppStore(state => state.chat_data)
  const setChatData = useAppStore(state => state.setChatData)
  const config = useAppStore(state => state.config_data)
  const app_data = useAppStore(state => state.app_data)
  const [streamMessage, setStreamMessage] = useState<IM>()
  const handleSendData = (v: string) => {
    console.log(v, 'kdfkdkfkdfkdfkdfkdfkdfk')
    api_sendMessage({
      data: {
        query: v,
        user: 'mxm',
        conversation_id: chat_data.actived_conversation,
      },
      config
    }).then(data => {
      // 假设 data 是一个流
      // 直接处理 data

      console.log(typeof data)
      const messages = data.split('\n\n').filter(Boolean).map(chunk => JSON.parse(chunk.slice(5)));
      messages.forEach(message => {
        // 处理每个 message
        console.log("Message:", message.answer);
        // 更新 streamMessage 状态
        setStreamMessage(message);
      });
    })
  }
  //初始化聊天历史数据
  useEffect(() => {
    if (app_data.initial_ready) {
      api_getConversations({
        data: {
          user: 'mxm'
        },
        config: {
          url: config.url,
          token: config.token
        }
      }).then(data => {
        console.log(data, 'dfdfdf')
        const activeId = data.data && data.data.length > 0 ? data.data[0].id : ''
        setChatData(pre => ({
          ...pre,
          conversations: data as any,
          actived_conversation: activeId
        }))
      })
    }
  }, [app_data.initial_ready, config])
  //聊天数据message
  useEffect(() => {
    if (chat_data.actived_conversation) {
      setChatData(pre => ({
        ...pre,
        state: ModuleState.Loading,
        current_conversation_messages: {
          has_more: pre.current_conversation_messages.has_more,
          limit: pre.current_conversation_messages.limit,
          data: []
        }
      }))
      console.log('获取聊天数据')
      api_getMessages({
        data: {
          user: 'mxm',
          conversation_id: chat_data.actived_conversation
        },
        config: config
      }).then(data => {
        console.log(data.data)
        setChatData(pre => ({
          ...pre,
          current_conversation_messages: {
            has_more: data.has_more,
            limit: data.limit,
            data: data.data as any
          },
          state: ModuleState.Waiting
        }))
      })
    }
  }, [
    chat_data.actived_conversation
  ])
  return (

    <div className={cn(' w-full  relative box-border', {
      'pt-12': !isPortrait
    })} style={{
      height: isPortrait ? 'calc(100% - 46px)' : '100%'
    }}>
      {/* <NavBar chat_list={chat_data.conversations.data} /> */}
      <div className='chat-container mx-auto py-3 h-full w-full '>
        {
          chat_data.state === ModuleState.Loading && <div>
            数据加载中...
          </div>
        }

        {
          chat_data.current_conversation_messages.data.map((i, index) => (
            <div key={i.id}>
              <Divider
                className=" text-theme-white  bg-transparent"
                style={{
                  opacity: 0.2,
                  borderStyle: 'dashed',
                }}
                contentPosition='left'>
                <div className=" text-xs flex">
                  <p>{dayjs.unix(i.created_at).format('YY-MM-DD HH:mm')}</p>
                </div> </Divider>
              <div className=" text-theme-black mx-5 flex items-center pb-1 gap-x-1">
                {/* <Avatar className=" " style={{ '--size': '24px' }} src='' /> */}
                <div className="relative text-theme-white py-2 rounded-lg max-w-[100%]">
                  {/* <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
              <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
            </div> */}
                  <p>{i.query}</p>
                </div>
              </div>

              <div className=" text-theme-black mx-5 flex items-center pb-5 gap-x-5">
                <Avatar className=" " style={{ '--size': '24px' }} src='' />
                <div className="relative bg-white p-4 rounded-lg max-w-[80%]">
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white"></div>
                  </div>
                  {chat_data.state === ModuleState.Process && index === chat_data.current_conversation_messages.data.length && <DotLoading color='primary' />}
                  <ReactMarkdown>{i.answer}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        }


      </div>
      <div className={
        cn('input z-10 absolute w-full bottom-[35px]')}>
        <MInput onSend={handleSendData} />
      </div>

    </div>


  )
}

export default Chat