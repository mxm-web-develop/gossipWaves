import { NavBar, Popup, SideBar } from "antd-mobile"
import { AddSquareOutline, AppstoreOutline } from "antd-mobile-icons"
import { ReactNode, useEffect, useRef, useState } from "react"
import { useMobileOrientation } from "react-device-detect"
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import MouseWheel from '@better-scroll/mouse-wheel'
import ObserveDOM from '@better-scroll/observe-dom'
import ScrollBar from '@better-scroll/scroll-bar'
import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll"

interface IHSideBar {
  children?: ReactNode
  chat_list: any[]
}

const ConversationList = ({ chat_list }: any) => (
  <div> {/* Add this div as the inner container */}
    {chat_list.map((item: any) => (
      <div
        className="chat-item cursor-pointer text-theme-white px-5 box-border py-5 "
        key={item.key}
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
  const [open, setOpen] = useState(false)
  const scrollBar = useRef<any>(null)
  const scrollBar2 = useRef<any>(null)
  // const scrollInstance = useRef<BScroll>(null) // Add this line to hold the scroll instance
  useEffect(() => {

  }, [open])
  useEffect(() => {
    if (!isPortrait && scrollBar.current) { // Check if scrollBar.current exists
      const vs = new BScroll(scrollBar.current, {
        pullDownRefresh: true,
        mouseWheel: true,
        observeDOM: true,
        scrollbar: true,
      })

      // Destroy the BetterScroll instance when the component unmounts
      return () => {
        vs && vs.destroy()
      }
    } else if (isPortrait && open && scrollBar2.current) { // Check if scrollBar2.current exists
      const pv = new BScroll(scrollBar2.current, {
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
            <div className="chat-list-container flex-col overflow-y-hidden h-full" ref={scrollBar}>
              <ConversationList chat_list={chat_list} />
            </div>
          </div>
        </Popup>

        <NavBar left={<AppstoreOutline onClick={() => setOpen(true)} fontSize={24} />} backIcon={null} right={<div className="flex justify-end"><AddSquareOutline fontSize={24} /></div>}>
          <div>标题</div>
        </NavBar>
      </div>
    )
  } else {
    return (
      <>
        <div className="absolute right-0 top-0 py-5 px-5 text-theme-white z-50">
          <AddSquareOutline fontSize={32} className="cursor-pointer text-theme-white hover:text-white" />
        </div>
        <div className='sidebar bg-theme-black w-[180px] h-full' >

          <div className="chat-list-container flex-col overflow-y-hidden h-full" ref={scrollBar}>
            <ConversationList chat_list={chat_list} />
          </div>

        </div>
      </>
    )
  }

}

export default NvaBar