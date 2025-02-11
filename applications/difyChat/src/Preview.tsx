import { MxMChat, ChatClientProvider } from "./application/lib_enter";

function Preview() {
  console.log('当前版本:', import.meta.env.VITE_APP_VERSION);
  return (
    <ChatClientProvider>
      <MxMChat
        url="/myproxy"
        token="app-jRRwbSXPpFdDUahm7QmPdyFq"
        //token='app-H9ftP5wGNWhlqcGfy1CgyDcf'
        username="admin"
        mock={false}
      />
    </ChatClientProvider>
  )
}
//app-H9ftP5wGNWhlqcGfy1CgyDcf

export default Preview
