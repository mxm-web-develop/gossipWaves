/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useImperativeHandle, useRef, useState } from 'react';
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

function GraphView(props: {
  initData?: null | GraphData;
  handleEvent?: (type: string, data?: any) => any;
  graphRef?: React.RefObject<GraphRefType | null>;
  createBy?: string;
}) {
  const { handleEvent, graphRef, initData, createBy } = props;
  const { setGraph, graph, status, graphData,setGraphData, changeStatus, graph_type } = useAppState();
  const containerRef = useRef<HTMLDivElement>(null);
  const [targetInfo, setTargetInfo]: any = useState({});
  // const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const isFullScreen = useRef(false);



  const get_items = (): GraphData | any => {
    if (!graph) return console.error('图谱未渲染完成');
    return graph.getData();
  };

  const add_items = (data: GraphData) => {
    if (!graph) return console.error('图谱未渲染完成');
    graph.addData((prev: GraphData) => {
      const { nodes: oldNodes, edges: oldEdges } = prev;
      const { nodes, edges } = data;
      const newNodes = uniqArr2By(oldNodes || [], nodes || [], 'id');
      const newEdges = uniqArr2By(oldEdges || [], edges || [], 'id');
      return {
        nodes: newNodes,
        edges: newEdges,
      };
    });
    graph.render();
  };

  const delete_items = (ids: DataID) => {
    if (!graph) return console.error('图谱未渲染完成');
    graph.removeData(ids);
    graph.draw();
  };

  const clear_items = () => {
    if (!graph) return console.error('图谱未渲染完成');
    graph.clear();
  };

  const antSelect = () => {
    if (!graph) return message.warning('graph未初始化');
    const allNodeData = graph.getNodeData();
    const nodeData = graph.getElementDataByState('node', 'selected');
    const selectedId: any = nodeData.map((item: any) => item.id);
    allNodeData.forEach((element) => {
      const id = element.id;
      if (selectedId.includes(id)) {
        graph.setElementState(id, []);
      } else {
        graph.setElementState(id, ['selected']);
      }
    });

    graph.setElementState(selectedId, []);
  };

  const updateNodeById = (id: string, style: any) => {
    if (!graph) return message.warning('graph未初始化');
    graph.updateNodeData([{ id, style: { ...style } }]);
    graph.draw();
  };

  const handleContextMenuEvent = (type: string, data?: any) => {
    if (!graph) return message.warning('graph未初始化');
    let id = '';
    switch (type) {
      case contextMenuType['NODE:ANT_SELECT']:
        antSelect();
        break;
      case contextMenuType['NODE:DELETE']:
        id = targetInfo?.target?.id;
        if (!id) return;
        const params = targetInfo.targetType === 'node' ? { nodes: [id] } : { edges: [id] };
        delete_items(params);
        break;
      case contextMenuType['NODE:VIEW']:
      case contextMenuType['NODE:ONCE']:
      case contextMenuType['NODE:SECOND_DEGREE']:
      case contextMenuType['NODE:THIRD_DEGREE']:
      case contextMenuType['NODE:FOUR_DEGREE']:
        id = targetInfo?.target?.id;
        if (!id) return;
        const nodeData = graph.getNodeData(id);
        handleEvent && handleEvent(type, nodeData);
        break;
    }
  };

  // useImperativeHandle(graphRef, () => ({
  //   add_items,
  //   delete_items,
  //   clear_items,
  //   get_items,
  //   updateNodeById,
  // }));

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
    changeStatus('canvas_init')
    console.log('进来了',status)
    if (!containerRef.current) return;
    const parentElement = containerRef.current.parentElement;
   console.log('parentElement',parentElement)
    if (!parentElement) return;
    const width = parentElement.clientWidth;
    const height = parentElement.clientHeight;
    if (width <= 0 || height <= 0) return;
    const newGraph = new Graph({
      container: containerRef.current,
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
   
    newGraph.render();
    setGraph(newGraph);
    changeStatus('app_wait')
    return () => {
      newGraph.destroy();
    };
  }, [status,graphData]);

  useEffect(() => {
    console.log('画布初始化了',graph)
    if (!initData || !graph) return;
    add_items(initData);
  }, [initData, graph]);

  // useEffect(() => {
  //   if (graph) {
  //     registerDefaultGraph(graph, setGraphData, handleEvent);
  //   }
  //   return () => {
  //     if (graph) {
  //       cancelDefaultGraph(graph);
  //     }
  //   };
  // }, [graph]);

  return (
    <>
      {status === 'app_init' || status === 'data_init' && (
        <LoadingGraph />
      )}
      {status === 'app_error' && (
        <ErrorGraph message="图谱初始化失败" /> 
      )}
      {
        status === 'app_wait' && (
          <>
          <div
            ref={containerRef}
            id="graph-container"
            className="relative z-10"
            style={{ width: '100%', height: '100%' }}
      >
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
        <CanvasController handleEvent={handleGraphEvent} />
        <AppController handleEvent={handleGraphEvent} /> 
        </div>
          <MyContextMenu targetInfo={targetInfo} handleContextMenuEvent={handleContextMenuEvent} />
        </>
      )}
    </>
  );
}

export default GraphView;
