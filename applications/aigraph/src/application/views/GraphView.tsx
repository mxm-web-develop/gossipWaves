/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { Graph, GraphData } from '@antv/g6';
import { useAppState } from '../store';
import { cancelDefaultGraph, registerDefaultGraph } from '../graph/default';
import MyContextMenu, { contextMenuType } from '../graph/MyContextMenu';
import { ArrowLeft } from 'lucide-react';
import * as Separator from '@radix-ui/react-separator';
import LayoutMenu from './components/LayoutMenu';
import SearchMenu from './components/SearchMenu';
import Download from '../assets/img/Download.png';
import SaveOutlined from '../assets/img/SaveOutlined.png';
import { uniqArr2By } from '../utils/tools';
import { DataID } from '@antv/g6/lib/types';
import Fullscreen from '../assets/img/Fullscreen.png';
import ScaleDown from '../assets/img/scaleDown.png';
import ScaleUp from '../assets/img/scaleUp.png';
import Refresh from '../assets/img/refresh.png';
import './style.css';
import {
  behaviorsConfig,
  edgeStyleConfig,
  layoutConfig,
  nodeStyleConfig,
  pluginsConfig,
} from '../graph/config';
import { message } from 'antd';
import CanvasController from './components/CanvasController';
import AppController from './components/AppController';
import LoadingGraph from './LoadingGraph';
import ErrorGraph from './ErrorGraph';
import { useCommonFn } from '../graph/common';

const ZOOM = 0.1;

export type GraphRefType = {
  add_items: (data: GraphData) => void;
  delete_items: (ids: DataID) => void;
  clear_items: () => void;
  get_items: () => GraphData | any;
  updateNodeById: (id: string, style: any) => void;
};

export enum AI_GRAPH_TYPE {
  SEARCH = 'search',
  SAVE = 'save',
  EXPORT = 'export',
  BACK = 'back',
  CLEAR = 'clear',
  ADD_ITEMS = 'add_items',
  DELETE_ITEMS = 'delete_items',
  CLICK_NODE = 'click_node',
  CLICK_CANVAS = 'click_canvas',
  CLICK_EDGE = 'click_edge',
}

const GraphView = forwardRef((props: {
  initData?: null | GraphData;
  handleEvent?: (type: string, data?: any) => any;
  graphRef?: React.RefObject<GraphRefType | null>;
  createBy?: string;
}, ref:any) => {
  const { handleEvent, graphRef, initData, createBy } = props;
  const { setGraph, graph, status, graphData,setGraphData, changeStatus, graph_type } = useAppState();
  const containerRef = useRef<HTMLDivElement>(null);
  const [targetInfo, setTargetInfo]: any = useState({});
  // const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const isFullScreen = useRef(false);
  const { handleContextMenuEvent, get_items, add_items, delete_items, clear_items, antSelect, updateNodeById } = useCommonFn(graph);


  const handleGraphEvent = (type: string, data?: any) => {
    if (!graph) return message.warning('graph未初始化');
    switch (type) {
      case 'fullScreen':
        const fullscreen: any = graph.getPluginInstance('fullscreen');
        if (isFullScreen.current === true) {
          fullscreen.exit();
        } else {
          fullscreen.request();
        }
        break;
      case 'scaleUp':
        graph.zoomBy(1 + ZOOM);
        break;
      case 'scaleDown':
        graph.zoomBy(1 - ZOOM);
        break;
      case 'refresh':
        graph.zoomTo(1);
        break;
    }
  };

  useEffect(() => {
    if (status === 'app_init') return;
    console.log('初始化检查:', {
      status,
      containerRef: !!containerRef.current,
      ref: !!ref.current
    });
    
    // 确保两个 ref 都存在
    if (!containerRef.current || !ref.current) {
      console.log('等待 DOM 元素准备就绪...');
      return;
    }
    const container = containerRef.current;
    const width = ref.current.clientWidth;
    const height = ref.current.clientHeight;
    console.log('width',width,'height',height,container)
    if (width <= 0 || height <= 0) {
      console.warn('Container has no dimensions:', width, height);
      return;
    }
    
    const newGraph = new Graph({
      container,
      background: '#FAFBFD',
      width,
      height,
      autoFit: {
        type: 'center',
        animation: true,
      },
      node: nodeStyleConfig.default,
      edge: edgeStyleConfig.default,
      layout: layoutConfig.default,
      behaviors: behaviorsConfig.default,
      plugins: pluginsConfig({
        getContextMenu: (a: any, b: any) => {
          const { targetType } = a;
          console.log(a, b, 'getContent', targetType);
          setTargetInfo(a);
          return document.getElementById('context-menu');
        },
        contextMenuClick: (v: any, t: any, c: any) => {
          console.log(v, t, c);
        },
        onScreenEnter: () => {
          isFullScreen.current = true;
        },
        onScreenExit: () => {
          isFullScreen.current = false;
        },
      }).default,
    });
   
    setGraph(newGraph);
    
    // 在这里直接添加数据
    if (graphData) {
      try {
        newGraph.setData(graphData);
        newGraph.render();
        changeStatus('app_wait');
      } catch (error) {
        console.error('初始数据添加失败:', error);
        changeStatus('app_error');
      }
    }
    
    return () => {
      if (newGraph && !newGraph.destroyed) {
        newGraph.destroy();
      }
    };
  }, [status, containerRef.current,graphData]);

  // 移除之前的数据添加 useEffect

  // 注册事件监听
  useEffect(() => {
    if (!graph) return;
    console.log('注册事件监听',graph)
    //registerDefaultGraph(graph, setGraphData, handleEvent);
    
    // return () => {
    //   if (graph && !graph.destroyed) {
    //     cancelDefaultGraph(graph);
    //   }
    // };
  }, [graph]);

  return (
    <div 
      ref={ref} 
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      <div
        ref={containerRef}
        id="graph-container"
        className="relative z-10"
        style={{ width: '100%', height: '100%' }}
      >
        {status === 'app_init' || status === 'data_init' ? (
          <LoadingGraph />
        ) : status === 'app_error' ? (
          <ErrorGraph message="图谱初始化失败" /> 
        ) : status === 'app_wait' && (
          <>
            <CanvasController handleEvent={handleGraphEvent} />
            <AppController handleEvent={handleGraphEvent} />
            <MyContextMenu targetInfo={targetInfo} handleContextMenuEvent={handleContextMenuEvent} />
            <div
              style={{ bottom: '20px', left: '16px' }}
              className="absolute flex justify-start gap-x-3 items-center  opacity-40 text-sm "
            >
              <div className=" flex justify-center items-center gap-x-1">
                <span>节点数:</span>
                <span>{graphData?.nodes?.length}</span>
              </div>
              <Separator.Root className="bg-[#EEEEEE]" style={{ height: '20px', width: '1px' }} />
              <div className=" flex justify-center items-center gap-x-1">
                <span>关系数:</span>
                <span>{graphData?.edges?.length}</span>
              </div>
              {createBy && (
                <>
                  <Separator.Root className="bg-[#EEEEEE]" style={{ height: '20px', width: '1px' }} />
                  <div className=" flex justify-center items-center gap-x-1">
                    <span>创建人:</span>
                    <span>{createBy}</span>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
})

export default GraphView
