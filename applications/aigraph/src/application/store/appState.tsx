import { create } from 'zustand';
import { produce } from 'immer';
import { Graph, GraphData } from '@antv/g6';
interface AppState {
  status: 'app_init' | 'data_init' | 'canvas_init' | 'app_wait' | 'app_process' | 'app_error';
  rawData: any;
  graphData: GraphData;
  mode: 'local' | 'server'; //控制网络模式，影响查询和计算的模式
  graph: Graph | null;
  data_type: 'antv' | 'gitech'; //控制图谱数据传入结构类型
  graph_type: 'gitech_finance' | 'default'; //控制图谱样式
  gientechSet?: {
    spaceName: string;
    filedId?: string;
    limit: number;
  };
  // 具体方法替代通用的 setAppState
  changeStatus: (
    status: 'app_init' | 'data_init' | 'canvas_init' | 'app_wait' | 'app_process' | 'app_error'
  ) => void;
  // setMode: (mode: 'local' | 'server') => void;
  setRawData: (data: any) => void;
  setGraph: (graph: Graph | null) => void; // 添加 setGraph 方法声明
  setAppConfig: (config: {
    data_type: 'antv' | 'gitech';
    graph_type: 'gitech_finance' | 'default';
    mode: 'local' | 'server';
  }) => void;
  setGientechSet: (config: { spaceName: string; filedId?: string; limit: number }) => void;
  setGraphData: (data: GraphData) => void; // 添加新方法声明
  //setAppStatus: (status: AppStatus) => void;
}
export const useAppState = create<AppState>((set) => ({
  status: 'app_init',
  graphData: {},
  rawData: [],
  mode: 'local',
  layout: 'force',
  graph: null,
  data_type: 'antv',
  graph_type: 'default',
  // 修改状态的具体方法
  changeStatus: (status) => {
    return set(
      produce((draft) => {
        draft.status = status;
      })
    );
  },
  setGraph: (graph) =>
    set(
      produce((draft) => {
        draft.graph = graph;
      })
    ),

  setRawData: (data) =>
    set(
      produce((draft) => {
        draft.rawData = data;
      })
    ),

  setAppConfig: (config: {
    data_type: 'antv' | 'gitech';
    graph_type: 'gitech_finance' | 'default';
    mode: 'local' | 'server';
  }) =>
    set(
      produce((draft) => {
        draft.mode = config.mode;
        draft.data_type = config.data_type;
        draft.graph_type = config.graph_type;
      })
    ),

  setGientechSet: (config) =>
    set(
      produce((draft) => {
        draft.gientechSet = config;
      })
    ),

  setGraphData: (data) =>
    set(
      produce((draft) => {
        draft.graphData = data;
      })
    ),
}));
