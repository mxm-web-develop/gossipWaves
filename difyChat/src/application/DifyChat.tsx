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
import Chat, { chat_list } from './views/Chat'
import { cn } from '@udecode/cn'
import { useEffect } from 'react'
import { api_getConversations } from './services'


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

}) => {
  const { isPortrait } = useMobileOrientation()
  console.log(props)
  useEffect(() => {
    api_getConversations({
      data: {
        user: 'bbq'
      },
      config: {
        url: 'https://api.dify.ai/v1',
        token: 'app-oo9gDHKOTUN3eDX7oXMvkIv8'
      }
    })
  }, [])
  return (
    <div className=' h-[100dvh] w-[100dvw] absolute top-0 left-0 '>
      <div style={{ background: '#ace0ff' }}>
        <SafeArea position='top' />
      </div>
      <div className=' bg-theme-dark relative h-full w-full '>
        <div className={cn('w-full h-full relative', {
          'flex': !isPortrait
        })} >
          <NavBar chat_list={chat_list} />
          <Chat />

        </div>

        {/* <div className=' absolute bottom-0 w-full left-0'>
          <TabBar className=' bg-theme-black py-2'>
            {tabs.map(item => (
              <TabBar.Item
                key={item.key}
                icon={item.icon}
                title={item.title}
                badge={item.badge}
              />
            ))}
          </TabBar>
        </div> */}
      </div>
      <div style={{ background: '#ace0ff' }}>
        <SafeArea position='bottom' />
      </div>
    </div>
  )
}

export default DifyChat