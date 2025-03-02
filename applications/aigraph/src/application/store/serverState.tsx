import { create } from 'zustand'
import axios from 'axios'

interface ServerState {
  // 服务器连接状态
  connectionStatus: 'unable' | 'setted' | 'connected' | 'error';
  url: string | null;
  token: string | null;

  // Actions
  setUrl: (url: string) => void;
  setToken: (token: string) => void;
  testConnection: () => Promise<string>;
  resetState: () => void;
}

const initialState = {
  connectionStatus: 'unable',
  url: null,
  token: null,
}

export const useServerState = create<ServerState>((set, get) => ({
  ...initialState,
  connectionStatus: 'unable',
  // 设置 URL
  setUrl: (url: string) => {
    set((state) => ({
      url,
      connectionStatus: url && state.token ? 'setted' : 'unable',
    }));
  },
  // 设置 Token
  setToken: (token: string) => {
    set((state) => ({
      token,
      connectionStatus: state.url ? 'setted' : 'unable',
    }));
  },
  // 测试连接
  testConnection: async () => {
    const { url, token } = get(); // 修正为获取整个状态
    console.log(url, token, 'from')
    if (!url) {
      set({ connectionStatus: 'unable' });
      return 'unable'
    }
    try {
      const requestUrl = `${url}/search/ping`;
      console.log(requestUrl, 'requestUrl');
      const res  = await axios.get(requestUrl);
      console.log(requestUrl,res, 'res');
      set({ connectionStatus: 'connected' });
      return 'connected'  
    } catch (error) {
      console.error('Connection error:', error);  // 添加详细的错误日志
      set({ connectionStatus: 'error' });
      return 'error'
    }
  },

  // 重置状态
  resetState: () => set(initialState as ServerState),
}))

// 导出选择器
export const selectConnectionStatus = (state: ServerState) => state.connectionStatus;
