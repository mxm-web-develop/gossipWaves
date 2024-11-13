import { Avatar, Divider, DotLoading } from "antd-mobile"
import { useMobileOrientation } from "react-device-detect"
import { cn } from "@udecode/cn"
import MInput from "./components/MInputer"
import ReactMarkdown from 'react-markdown';
import useAppStore from "../store";
import { useEffect, useRef, useState } from "react";
import { IMessageData, ModuleState } from "../types/chat.types";
import { api_getConversations, api_getMessages } from "../services";
import dayjs from "dayjs";
import NavBar from './components/Navbar'
import PullDown from '@better-scroll/pull-down'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDOM from '@better-scroll/observe-dom'
import ScrollBar from '@better-scroll/scroll-bar'
import { processStreamedData, sendMessageConfig } from "../services/apis/send_message";
import BScroll from "@better-scroll/core";
import { createAxiosInstance } from "../services/axios_instant";
import { ServerBase } from "../services/services.type";
import ChatListItem from "./components/ChatListItem";
import { api_getParameters } from "../services/apis/get_paramets";
const Chat = () => {
  BScroll.use(PullDown)
  BScroll.use(MouseWheel)
  BScroll.use(ObserveDOM)
  BScroll.use(ScrollBar)
  const { isPortrait } = useMobileOrientation()
  const chat_data = useAppStore(state => state.chat_data)
  const setMessegesData = useAppStore(state => state.setMessegesData)
  const setChatData = useAppStore(state => state.setChatData)
  const config = useAppStore(state => state.config_data)
  const app_data = useAppStore(state => state.app_data)
  const [bs, setBs] = useState<BScroll>()
  const chatScroll = useRef<any>(null)
  const [streamMessage, setStreamMessage] = useState<IMessageData | undefined>(undefined)
  const pullingDownHandler = async () => {
    //这里来做所有下拉之后的操作
  }
  useEffect(() => {
    api_getParameters({
      data: {
        user: 'mxm'
      },
      config
    }).then(data => {
      console.log(data, 'zzhzhzhzhzhzhzh')
    })
  }, [])
  useEffect(() => {
    if (chatScroll.current) {
      const bs = new BScroll(chatScroll.current, {
        pullDownRefresh: {
          threshold: 90,
          stop: 40
        },
        mouseWheel: true,
        observeDOM: true,
        scrollbar: true,
      })
      bs.on('pullingDown', pullingDownHandler)
      setBs(bs)
      return () => {
        bs && bs.destroy()
      }
    }
  }, [])
  useEffect(() => {
    if (bs) {
      bs.refresh();
      bs.scrollTo(0, bs.maxScrollY, 800);
    }
  }, [bs, chat_data.current_conversation_messages.data, streamMessage])
  const handleSendData = async (v: string) => {
    const { url, method } = sendMessageConfig;
    const requestData = {
      query: v,
      inputs: {},
      response_mode: 'streaming',
      user: 'mxm',
      conversation_id: chat_data.actived_conversation,
      auto_generate_name: true,
    };

    try {
      const response = await fetch(config.url + url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.token}`,
        },
        body: JSON.stringify(requestData),
      });

      if (!response.body) {
        throw new Error('ReadableStream not supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {

          const chunk = decoder.decode(value, { stream: true });
          processStreamedData(chunk, (data: any) => {
            switch (data['event']) {
              case 'message':

                setStreamMessage(pre => ({
                  ...pre,
                  answer: (pre?.answer || '') + data['answer'],
                  query: v,
                  conversation_id: data['conversation_id'],
                  created_at: data['created_at'],
                  status: 'process',
                  id: data['id']
                }))
                break
              case 'error':
                setStreamMessage(pre => ({
                  ...pre,
                  status: 'error',
                }))
                break;
              case 'message_replace':
                break;

              case 'message_end':

                setStreamMessage(pre => ({
                  ...pre,
                  status: 'done',
                }))
                break;
              case 'message_file':
                break
              case 'agent_message':
                break
              case 'agent_thought':
                break
              case 'tts_message_end':
                break
              case 'tts_message':
              default:
                return
            }
          });
        }
      }
      setStreamMessage(pre => ({
        ...pre,
        status: 'done',
      }))
    } catch (err) {
      console.error(err);
      setStreamMessage(pre => ({
        ...pre,
        status: 'error',
      }))
    }
  }
  useEffect(() => {
    //process,done,error
    if (streamMessage?.status === 'done') {
      setMessegesData(streamMessage)
      setStreamMessage(undefined)
    }
  }, [streamMessage?.status])
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

    <div className={cn(' w-full pb-[65px]  overflow-y-hidden relative box-border', {
      'pt-12': !isPortrait
    })} style={{
      height: isPortrait ? 'calc(100% - 46px)' : '100%'
    }}>
      {/* <NavBar chat_list={chat_data.conversations.data} /> */}
      <div className='chat-container mx-auto py-3 h-full w-full ' ref={chatScroll}>
        <div>
          {
            chat_data.state === ModuleState.Loading && <div>
              数据加载中...
            </div>
          }
          {
            chat_data.current_conversation_messages.data.map((i, index) => <ChatListItem key={i.id} i={i} is_current_stream={false} chat_data={chat_data} />)
          }
          {
            streamMessage && streamMessage.id && <ChatListItem i={streamMessage} is_current_stream={true} chat_data={chat_data} />
          }
        </div>

      </div>
      <div className={
        cn('input z-10 absolute w-full bottom-[0px] pt-[8px] md:max-w-[85%] pb-[20px] backdrop-blur-xs bg-opacity-90')}>
        <MInput onSend={handleSendData} />
      </div>

    </div>


  )
}

export default Chat