# mxm 组件库文档

## 安装

`npm i @mxmweb/difychat`

## 更新说明

1. 升级 react + react dom 到 19 版本，方便 nextjs 引入
2. 抛出 onActionEmmiter(type,data)， type: 'app_toggle'

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
