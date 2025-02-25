import { create } from 'zustand';
//import { AppState, States, Modules, ChatData, FlowData, HomeData, SettingData, Configs } from './system.type';
import { produce } from 'immer';


interface State {
 
}

// 创建一个 zustand store
const useAppStore = create<State>((set) => ({

}));

export default useAppStore;