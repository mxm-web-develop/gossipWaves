import { create } from 'zustand';
//import { AppState, States, Modules, ChatData, FlowData, HomeData, SettingData, Configs } from './system.type';
import { produce } from 'immer';
import { Configs } from '../types/config.types';
import { AppState, Modules, States } from '../types/system';
import { ChatData, IMessageData, ModuleState } from '../types/chat.types';


interface State {
  app_data: AppState;
  setAppData: (state: (preState: AppState) => Partial<AppState>) => void;
  chat_data: ChatData;
  setChatData: (data: (preData: ChatData) => Partial<ChatData>) => void;
  config_data: Configs;
  setConfigData: (data: (preData: Configs) => Partial<Configs>) => void;
  initializeApp: (configs: Configs) => States;
  setMessegesData: (data: IMessageData) => void
}

// 创建一个 zustand store
const useAppStore = create<State>((set) => ({
  app_data: {
    //current_module: Modules.Chat,
    initial_ready: false,
    app_state: States.Loading,
  },
  config_data: {
    url: '',
    token: '',
    mock: false,
  },
  chat_data: {
    state: ModuleState.Loading,
    current_conversation_messages: {
      has_more: false,
      limit: 30,
      data: []
    },
    conversations: {
      has_more: false,
      limit: 30,
      data: []
    },
    sortRules: [{ label: '当天', dayPeriod: 1 }, { label: '本周', dayPeriod: 7 }]
  },

  setAppData: (state) => set(produce((draft: State) => {
    Object.assign(draft.app_data, state(draft.app_data));
  })),
  setChatData: (data) => set(produce((draft: State) => {
    Object.assign(draft.chat_data, data(draft.chat_data));
  })),
  setMessegesData: (data: IMessageData) => set(produce((draft: State) => {
    draft.chat_data.current_conversation_messages.data.push(data);
  })),
  setConfigData: (data) => set(produce((draft: State) => {
    Object.assign(draft.config_data, data(draft.config_data));
  })),
  initializeApp: (configs: Configs) => {
    set(produce((draft: State) => {
      draft.config_data = configs; // 使用传入的配置数据
      draft.app_data.initial_ready = true
      draft.app_data.app_state = States.Waiting;
    }));
    return States.Waiting; // 返回更新后的状态
  },
}));

export default useAppStore;