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
  const { setGraph, graph } = useAppState();
  const containerRef = useRef<HTMLDivElement>(null);
  const [targetInfo, setTargetInfo]: any = useState({});
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
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

  useImperativeHandle(graphRef, () => ({
    add_items,
    delete_items,
    clear_items,
    get_items,
    updateNodeById,
  }));

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
    if (!containerRef.current) return;
    const parentElement = containerRef.current.parentElement;
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
    return () => {
      newGraph.destroy();
    };
  }, []);

  useEffect(() => {
    console.log('graph', graph);
    if (!initData || !graph) return;
    add_items(initData);
  }, [initData, graph]);

  useEffect(() => {
    if (graph) {
      registerDefaultGraph(graph, setGraphData, handleEvent);
    }
    return () => {
      if (graph) {
        cancelDefaultGraph(graph);
      }
    };
  }, [graph]);

  return (
    <>
      <div
        ref={containerRef}
        id="graph-container"
        className="relative"
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
        <div
          style={{ top: '80px', width: '44px' }}
          className="absolute right-[15px] border-[1px] border-solid border-[#EEEEEE] rounded-[4px] bg-white"
        >
          {[
            { img: Fullscreen, type: 'fullScreen' },
            { img: ScaleUp, type: 'scaleUp' },
            { img: ScaleDown, type: 'scaleDown' },
            { img: Refresh, type: 'refresh' },
          ].map((item, index: number) => {
            return (
              <div
                style={{ borderTop: index !== 0 ? '1px solid #eeeeee' : 'none' }}
                className={`graphBtns w-full h-[44px] flex justify-center items-center cursor-pointer`}
                onClick={() => handleGraphEvent(item.type)}
              >
                <img src={item.img} width={20} height={20} />
              </div>
            );
          })}
        </div>
        <div className=" absolute top-5" style={{ left: '16px' }}>
          <div
            style={{ padding: '4px 16px' }}
            className="flex items-center justify-between hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-md"
          >
            <ArrowLeft color="#2468F2" size={16} className="mr-[6px]" />
            <div
              className="   text-sm"
              onClick={() => handleEvent && handleEvent(AI_GRAPH_TYPE.BACK)}
            >
              返回
            </div>
          </div>
        </div>
        <div className="tool-bar absolute top-5 right-[15px]">
          <div className="flex items-center justify-between" style={{ columnGap: '16px' }}>
            <div
              style={{ borderRadius: '4px' }}
              className="flex items-center border border-solid border-[#EEEEEE] justify-between bg-white"
            >
              <LayoutMenu />
              <Separator.Root className="bg-[#EEEEEE]" style={{ height: '20px', width: '1px' }} />
              <SearchMenu handleEvent={handleEvent} />
              {/* <DisplayMenu /> */}
            </div>

            <div
              style={{ padding: '4px 16px' }}
              className="flex items-center justify-between hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-[4px]"
            >
              <img src={SaveOutlined} width={16} height={16} className="mr-[6px]" />
              <div
                className="text-sm text-[#555555]"
                onClick={() => handleEvent && handleEvent(AI_GRAPH_TYPE.SAVE)}
              >
                保存
              </div>
            </div>
            <div
              style={{ padding: '4px 16px' }}
              className="flex items-center justify-between hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-[4px]"
            >
              <img src={Download} width={16} height={16} className="mr-[6px]" />
              <div
                className="text-sm text-[#555555]"
                onClick={() => handleEvent && handleEvent(AI_GRAPH_TYPE.EXPORT)}
              >
                导出
              </div>
            </div>
          </div>
        </div>
      </div>

      <MyContextMenu targetInfo={targetInfo} handleContextMenuEvent={handleContextMenuEvent} />
    </>
  );
}

export default GraphView;
