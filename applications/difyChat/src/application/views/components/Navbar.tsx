import { NavBar, Popup, SideBar } from "antd-mobile"
import { AddSquareOutline, AppstoreOutline, UnorderedListOutline } from "antd-mobile-icons"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import { useMobileOrientation } from "react-device-detect"
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDOM from '@better-scroll/observe-dom'
import ScrollBar from '@better-scroll/scroll-bar'
import DataSortedConversationList from "./DataSortedConversationList"
import { IChatSortRule } from "../../types/chat.types"
import useAppStore from "../../store"
import { AlignJustify } from 'lucide-react'
interface IHSideBar {
  children?: ReactNode
  chat_list: any[]
  sortRule?: IChatSortRule
}

const ConversationList = ({ chat_list }: any) => (
  <div> {/* Add this div as the inner container */}
    {chat_list.map((item: any) => (
      <div
        className="chat-item cursor-pointer text-theme-white px-5 box-border py-5 "
        key={item.id}
      >{item.title}</div>
    ))}
  </div>
)

const NvaBar = (props: IHSideBar) => {
  BScroll.use(PullDown)
  BScroll.use(MouseWheel)
  BScroll.use(ObserveDOM)
  BScroll.use(ScrollBar)
  const { chat_list } = props
  const { isPortrait } = useMobileOrientation()
  const chat_data = useAppStore(state => state.chat_data)
  const [open, setOpen] = useState(false)
  const scrollBarH = useRef<any>(null)
  const scrollBarP = useRef<any>(null)
  const setChatData = useAppStore(state => state.setChatData)
  console.log(chat_data)
  const createNewConversation = () => {
    setChatData(pre => ({
      ...pre,
      actived_conversation: '',
      current_conversation_messages: {
        has_more: false,
        limit: 20,
        data: []
      }
    }))
  }
  const title = useMemo(() => {
    // 检查 chat_data 和 conversations 是否存在
    if (chat_data && chat_data.conversations && chat_data.conversations.data.length > 0) {
      // 获取第一个对话的标题
      const activeConversation = chat_data.conversations.data[0];
      return activeConversation.name;
    }
    return ''; // 如果没有对话数据，返回默认标题
  }, [chat_data]); // 依赖于 chat_data，只有当 chat_data 改变时才重新计算

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

          console.log(pv)
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
          position='left'
          bodyStyle={{ width: '60vw', height: '100vh' }} // Set the height to 100vh
        >
          <div className='sidebar bg-theme-black w-full h-full' >
            <div className="chat-list-container flex-col overflow-y-hidden h-full" ref={scrollBarP}>
              {/* <ConversationList chat_list={chat_list} /> */}
              <div>
                <DataSortedConversationList data={chat_list} />
              </div>

            </div>
          </div>
        </Popup>

        <NavBar
          left={<AlignJustify onClick={() => setOpen(true)} fontSize={24} />} backIcon={null}
          right={<div className="flex justify-end gap-x-2">
            <AppstoreOutline fontSize={24} />
            <AddSquareOutline fontSize={24} /></div>}>
          <div className=" text-sm">{title}</div>
        </NavBar>
      </div>
    )
  } else {
    return (
      <>
        <div className="absolute right-0 top-0 py-5 px-5 text-theme-white z-50">
          <div className="flex gap-x-3">
            <AppstoreOutline fontSize={32} className="cursor-pointer text-theme-white hover:text-white" />
            <AddSquareOutline
              onClick={createNewConversation}
              fontSize={32} className="cursor-pointer text-theme-white hover:text-white" />
          </div>

        </div>
        <div className='sidebar bg-theme-black w-[210px] h-full' >
          <div className="chat-list-container flex-col overflow-y-hidden h-full" ref={scrollBarH}>
            <div> <DataSortedConversationList data={chat_list} /></div>
          </div>
        </div>
      </>
    )
  }

}

export default NvaBar