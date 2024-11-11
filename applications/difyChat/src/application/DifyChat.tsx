import './style.css'
import { SafeArea, SideBar } from 'antd-mobile'
import { Badge, TabBar } from 'antd-mobile'
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import './sidebar.style.css'
import { useMobileOrientation } from 'react-device-detect';

import NavBar from './views/components/Navbar'
import Chat from './views/Chat'
import { cn } from '@udecode/cn'
import { useEffect } from 'react'
import { api_getConversations, api_getMessages } from './services'
import useAppStore from './store' // 导入 store
import { ModuleState } from './types/chat.types'

const tabs = [
  {
    key: 'home',
    title: 'Home',
    icon: <AppOutline />,
  },
  {
    key: 'todo',
    title: 'Chat',
    icon: <UnorderedListOutline />,
    badge: '5',
  },
  {
    key: 'message',
    title: 'Flow',
    icon: (active: boolean) =>
      active ? <MessageFill /> : <MessageOutline />,
    badge: Badge.dot,
  },
  {
    key: 'personalCenter',
    title: 'Setting',
    icon: <UserOutline />,
  },
]

const DifyChat = (props: {
  children?: React.ReactNode
  className?: string
  url?: string
  token?: string
  mock?: boolean
}) => {
  const { isPortrait } = useMobileOrientation()
  const app_data = useAppStore(state => state.app_data)
  const config = useAppStore(state => state.config_data)
  const chat_data = useAppStore(state => state.chat_data)
  const setChatData = useAppStore(state => state.setChatData)
  const initializeApp = useAppStore((state) => state.initializeApp) // 获取 initializeApp 方法
  const setAppData = useAppStore(state => state.setAppData)
  const { url, token, mock } = props

  useEffect(() => {
    // 初始化应用程序
    const configs = {
      url: url || 'demo',
      token: token || '',
      mock: mock || false,
    }
    initializeApp(configs) // 调用 initializeApp 方法
  }, [])



  return (
    <div className=' h-[100dvh] w-[100dvw] absolute top-0 left-0 '>
      <div style={{ background: '#ace0ff' }}>
        <SafeArea position='top' />
      </div>
      {
        !app_data.initial_ready ? <div>app loading</div> :
          <div className=' bg-theme-dark relative h-full w-full '>
            <div className={cn('w-full h-full relative', {
              'flex': !isPortrait
            })} >
              <NavBar chat_list={chat_data.conversations.data} />
              <Chat />
            </div>
          </div>
      }
      <div style={{ background: '#ace0ff' }}>
        <SafeArea position='bottom' />
      </div>
    </div>
  )
}

export default DifyChat