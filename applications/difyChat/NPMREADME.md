# mxm 组件库文档

## 安装

npm i @mxmweb/difychat

## 使用

```ts
import { MxMChat, ChatClientProvider } from './application/lib_enter';
import '@mxmweb/difychat/styles.css';
function Preview() {
  return (
    <ChatClientProvider>
      <MxMChat url="/myproxy" token="app-jRRwbSXPpFdDUahm7QmPdyFq" mock={false} />
    </ChatClientProvider>
  );
}

export default App;
```
