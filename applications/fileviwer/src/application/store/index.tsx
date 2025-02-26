import { create } from 'zustand';
import { AppStatev1029, AppStatus } from './system.type';
import { enableMapSet } from 'immer';
import { produce } from 'immer';
enableMapSet();
interface State {
  appState: AppStatev1029;
  setAppState: (state: (prevState: AppStatev1029) => Partial<AppStatev1029>) => void;
  setAppStatus: (status: AppStatus) => void;
  currentRequestAbortControllers: Map<string, AbortController>;
  // 修改 setCurrentRequestAbortController 方法以接受一个 id 和一个 AbortController 实例
  setCurrentRequestAbortController: (id: string, controller: AbortController | null) => void;
  // 添加一个新的方法来移除一个 AbortController 实例
  //removeCurrentRequestAbortController: (id: string) => void;
  // 添加一个新的方法来取消所有请求
  abortAllRequests: () => void;
}
export const useStateStore = create<State>((set) => ({
  appState: {
    parse_form: 'txt',
    file_url: '',
    display_file_type: 'txt',
    status: AppStatus.UNLOAD,
    data: [],
    page_manager: {
      total: 0,
      current: 0,
    },
  },
  currentRequestAbortControllers: new Map(),
  setAppState: (state) =>
    set(
      produce((draft: State) => {
        draft.appState = { ...draft.appState, ...state(draft.appState) };
      })
    ),
  setAppStatus: (status: AppStatus) =>
    set(
      produce((draft: State) => {
        // 指定 draft 的类型
        draft.appState.status = status;
      })
    ),
  setCurrentRequestAbortController: (id, controller) =>
    set(
      produce((draft: State) => {
        if (controller) {
          draft.currentRequestAbortControllers.set(id, controller);
        } else {
          draft.currentRequestAbortControllers.delete(id);
        }
      })
    ),
  abortAllRequests: () =>
    set(
      produce((draft: State) => {
        draft.currentRequestAbortControllers.forEach((controller) => {
          controller.abort();
        });
        draft.currentRequestAbortControllers.clear();
      })
    ),
}));
