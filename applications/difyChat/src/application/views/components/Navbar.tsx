import { NavBar, Popup } from "antd-mobile"
import { AddSquareOutline, AppstoreOutline } from "antd-mobile-icons"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { useMobileOrientation } from "react-device-detect"
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDOM from '@better-scroll/observe-dom'
import ScrollBar from '@better-scroll/scroll-bar'
import DataSortedConversationList from "./DataSortedConversationList"
import { IChatSortRule, ModuleState } from "../../types/chat.types"
import useAppStore from "../../store"
import { LayoutList } from 'lucide-react'
import { api_stopChatMessages } from "@/application/services/apis/stop_chatmessage"
interface IHSideBar {
  children?: ReactNode
  user?: string
  chat_list: any[]
  sortRule?: IChatSortRule,
  onActionEmmiter?: (type: string, data?: any) => any
}


const NvaBar = (props: IHSideBar) => {
  BScroll.use(PullDown)
  BScroll.use(MouseWheel)
  BScroll.use(ObserveDOM)
  BScroll.use(ScrollBar)
  const { chat_list } = props
  const { isPortrait } = useMobileOrientation()
  const chat_data = useAppStore(state => state.chat_data)
  const app_data = useAppStore(state => state.app_data)
  const [open, setOpen] = useState(false)
  const scrollBarH = useRef<any>(null)
  const scrollBarP = useRef<any>(null)
  const setChatData = useAppStore(state => state.setChatData)
  const toggleSystem = () => {
    console.log('app_toggle')
    props.onActionEmmiter && props.onActionEmmiter('app_toggle', {
      user: props.user,
      app_data: app_data
    })
  }
  const createNewConversation = async () => {
    // if (chat_data.current_taskId && chat_data.state === ModuleState.Process) {
    //   const stop = await api_stopChatMessages({
    //     data: {
    //       user: 'mxm',
    //       task_id: chat_data.current_taskId
    //     },
    //     config: config
    //   })
    //   if (stop && stop.result && stop.result === 'success') {
    //     setChatData(pre => ({
    //       ...pre,
    //       actived_conversation: '',
    //       current_conversation_messages: {
    //         has_more: false,
    //         limit: 20,
    //         data: []
    //       }
    //     }))
    //   }

    // } else {
    //   setChatData(pre => ({
    //     ...pre,
    //     actived_conversation: '',
    //     current_conversation_messages: {
    //       has_more: false,
    //       limit: 20,
    //       data: []
    //     }
    //   }))
    // }

    setChatData(pre => ({
      ...pre,
      actived_conversation: '',
      current_conversation_messages: {
        has_more: false,
        limit: 20,
        data: []
      }
    }))
    console.log(chat_data)

  }
  const title = useMemo(() => {
    // 检查 chat_data 和 conversations 是否存在
    if (chat_data && chat_data.actived_conversation && chat_data.conversations && chat_data.conversations.data.length > 0) {
      // 获取 id 和 chat_data.actived_conversation 一致的对话
      const activeConversation = chat_data.conversations.data.find(conversation => conversation.id === chat_data.actived_conversation);
      // 如果找到了对话，返回对话的名称，否则返回默认标题
      return activeConversation ? activeConversation.name : '新的聊天';
    }
    return '新的聊天'; // 如果没有对话数据，返回默认标题
  }, [chat_data.actived_conversation, chat_data.conversations]);
  // const scrollInstance = useRef<BScroll>(null) // Add this line to hold the scroll instance
  useEffect(() => {
    if (!isPortrait && scrollBarH.current) { // Check if scrollBar.current exists
      const vs = new BScroll(scrollBarH.current, {
        pullDownRefresh: true,
        mouseWheel: true,
        observeDOM: true,
        scrollbar: true,
      })
      // Destroy the BetterScroll instance when the component unmounts
      return () => {
        vs && vs.destroy()
      }
    } else if (isPortrait && open) { // Check if scrollBar2.current exists

      setTimeout(() => {
        if (scrollBarP.current) {
          const pv = new BScroll(scrollBarP.current, {
            pullDownRefresh: true,
            mouseWheel: true,
            observeDOM: true,
            scrollbar: true,
          })
          return () => {
            pv && pv.destroy()
          }
        }
      }, 0);
    }
  }, [isPortrait, open])
  if (isPortrait) {
    return (
      <div>
        <Popup
          visible={open}
          onMaskClick={() => {
            setOpen(false)
          }}
          position='right'
          bodyStyle={{ width: '60vw', height: '100vh' }} // Set the height to 100vh
        >
          <div className='sidebar bg-theme-black w-full h-full' >
            <div className="chat-list-container flex-col overflow-y-hidden h-full" ref={scrollBarP}>
              {/* <ConversationList chat_list={chat_list} /> */}
              <div className="px-5">
                <DataSortedConversationList setOpen={setOpen} data={chat_list} />
              </div>
            </div>
          </div>
        </Popup>
        <NavBar
          left={<AppstoreOutline fontSize={24} />} backIcon={null}
          right={<div className="flex justify-end gap-x-2">
            <LayoutList size={24} onClick={() => setOpen(true)} />
            {/* <AlignJustify  fontSize={24} /> */}
            <AddSquareOutline fontSize={24} onPointerDown={createNewConversation} /></div>}>
          <div className=" text-sm flex items-center justify-center w-full px-5">
            <span className="whitespace-nowrap truncate ">{title}</span>
          </div>
        </NavBar>
      </div>
    )
  } else {
    return (
      <>
        <div className="absolute right-0 top-0 py-5 px-5 text-theme-white z-50">
          <div className="flex gap-x-3">

            <AddSquareOutline
              onPointerDown={createNewConversation}
              fontSize={24} className="cursor-pointer text-theme-white hover:text-white" />
            <AppstoreOutline onPointerDown={toggleSystem} fontSize={24} className="cursor-pointer text-theme-white hover:text-white" />
          </div>
        </div>
        <div className='sidebar bg-theme-black w-[210px] h-full' >
          <div className="chat-list-container flex-col overflow-y-hidden h-full" ref={scrollBarH}>
            <div className="px-5"> <DataSortedConversationList data={chat_list} /></div>
          </div>
        </div>
      </>
    )
  }

}

export default NvaBar