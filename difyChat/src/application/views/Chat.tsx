import { TextArea } from "antd-mobile"
import NavBar from "./components/Navbar"
import { useMobileOrientation } from "react-device-detect"
import { cn } from "@udecode/cn"
import MInput from "./components/MInputer"

export const chat_list = [
  {
    key: 'key1',
    title: '聊天1',

  },
  {
    key: 'key2',
    title: '聊天12',
    badge: '5',
  },
  {
    key: 'key3',
    title: '聊天3',
    badge: '99+',
  },
  {
    key: 'key12312',
    title: '聊天1',

  },
  {
    key: 'key2124',
    title: '聊天12',
    badge: '5',
  },
  {
    key: 'key5123',
    title: '聊天3',
    badge: '99+',
  },
  {
    key: 'key611',
    title: '聊天1',

  },
  {
    key: 'key6462',
    title: '聊天12',
    badge: '5',
  },
  {
    key: 'eeeewf343232',
    title: '聊天3',
    badge: '99+',
  },
  {
    key: 'key1125',
    title: '聊天1',

  },
  {
    key: 'key25wefwe4347',
    title: '聊天12',
    badge: '5',
  },
  {
    key: 'key35125',
    title: '聊天3',
    badge: '99+',
  },
  {
    key: 'key1626',
    title: '聊天1',

  },
  {
    key: 'key2151',
    title: '聊天12',
    badge: '5',
  },
  {
    key: 'key3643',
    title: '聊天3',
    badge: '99+',
  },
  {
    key: 'key35747',
    title: '聊天3',
    badge: '99+',
  },
  {
    key: 'key112wefewfw5',
    title: '聊天1',

  },
  {
    key: 'key2547',
    title: '聊天12',
    badge: '5',
  },
  {
    key: 'wefwef43243f3',
    title: '聊天3',
    badge: '99+',
  },
  {
    key: '5u45gh45y',
    title: '聊天1',

  },
  {
    key: '1251512512512',
    title: '聊天12',
    badge: '5',
  },
  {
    key: '436',
    title: '聊天3',
    badge: '99+',
  }, {
    key: 'key357443647',
    title: '聊天3',
    badge: '99+',
  },
  {
    key: 'key112125125',
    title: '聊天1',

  },
  {
    key: '1525125',
    title: '聊天12',
    badge: '5',
  },
  {
    key: 'key315215125',
    title: '聊天3',
    badge: '99+',
  },
  {
    key: 'ke1251y1626',
    title: '聊天1',

  },
  {
    key: 'key21251151',
    title: '聊天12',
    badge: '5',
  },
  {
    key: '5125125',
    title: '聊天3',
    badge: '99+',
  },
]
const Chat = () => {
  const { isPortrait } = useMobileOrientation()
  const handleSendData = (v: string) => {
    console.log(v)
  }
  return (

    <div className={cn(' w-full relative box-border')} style={{
      height: isPortrait ? 'calc(100% - 46px)' : '100%'
    }}>
      <div className='chat-container h-full w-full '></div>
      <div className={
        cn('input z-10 absolute w-full bottom-[35px]')}>
        <MInput onSend={handleSendData} />
      </div>

    </div>


  )
}

export default Chat