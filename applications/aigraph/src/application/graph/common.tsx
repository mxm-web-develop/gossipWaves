/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-case-declarations */
import { GraphData } from '@antv/g6';
import { DataID } from '@antv/g6/lib/types';
import { message } from 'antd';
import { useAppState } from '../store/appState';
import { contextMenuType } from './MyContextMenu';
import { AI_GRAPH_TYPE } from '../views/GraphView';
import { uniqArr2By, uniqBy } from '../utils/tools';
import { nodeStepSearch } from '../services/apis/whole_graph_search';
import { transformGientechToG6 } from '../utils/convertData';

export const useCommonFn = ({
  graph,
  handleEvent,
  targetInfo,
  gientechSet,
  url,
  token,
}: {
  graph: any;
  handleEvent: any;
  targetInfo: any;
  gientechSet: any;
  url: null | string;
  token: null | string;
}) => {
  const { changeStatus } = useAppState();
  const get_items = (): GraphData | any => {
    if (!graph) return console.error('图谱未渲染完成');
    return graph.getData();
  };

  const add_items = (data: GraphData, sgraph?: any) => {
    const _graph = sgraph || graph;
    if (!_graph || _graph.destroyed) {
      console.error('图谱未渲染完成或已销毁');
      return;
    }

    try {
      if (!_graph) return console.error('图谱未渲染完成');
      _graph.addData((prev: GraphData) => {
        const { nodes: oldNodes, edges: oldEdges } = prev;
        const { nodes, edges } = data;
        let newNodes = uniqArr2By(oldNodes || [], nodes || [], 'id');
        let newEdges = uniqArr2By(oldEdges || [], edges || [], 'id');
        newNodes = uniqBy(newNodes, 'id');
        newEdges = uniqBy(newEdges, 'id');
        return {
          nodes: newNodes,
          edges: newEdges,
        };
      });
      _graph.render();
    } catch (error) {
      console.error('添加数据时发生错误:', error);
      changeStatus('app_error');
    }
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
    allNodeData.forEach((element: any) => {
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
  const nodeStepSearchFn = async (step: number) => {
    if (!url || !token) return;
    try {
      const nodeData = graph.getElementDataByState('node', 'selected');
      const res = await nodeStepSearch(
        {
          baseURL: url,
          token: token || '',
        },
        { spaceName: gientechSet.spaceName, step, nodes: nodeData }
      );
      console.log('====================================');
      console.log('step------>', res);
      console.log('====================================');
      const gData = transformGientechToG6(res);
      add_items(gData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleContextMenuEvent = (event: any, data?: any) => {
    console.log(event, data);
    switch (event) {
      case contextMenuType['NODE:ONCE']:
        nodeStepSearchFn(1);
        // Handle NODE:ONCE event
        break;
      case contextMenuType['NODE:SECOND_DEGREE']:
        nodeStepSearchFn(2);
        // Handle NODE:SECOND_DEGREE event
        break;
      case contextMenuType['NODE:THIRD_DEGREE']:
        nodeStepSearchFn(3);
        // Handle NODE:THIRD_DEGREE event
        break;
      case contextMenuType['NODE:FOUR_DEGREE']:
        nodeStepSearchFn(4);
        // Handle EDGE:ONCE event
        break;
      case contextMenuType['NODE:ANT_SELECT']:
        antSelect();
        break;
      case contextMenuType['NODE:DELETE']:
        const nodeData = graph.getElementDataByState('node', 'selected');
        const selectedId: any[] = nodeData.map((item: any) => item.id);
        delete_items({ nodes: selectedId });
        break;
      case contextMenuType['NODE:VIEW']:
        handleEvent &&
          targetInfo?.target?.id &&
          handleEvent(AI_GRAPH_TYPE.CLICK_NODE, graph.getElementData(targetInfo.target.id));
        break;
      default:
        console.warn('Unknown context menu event type:', event.type);
    }
  };

  return {
    handleContextMenuEvent,
    get_items,
    add_items,
    delete_items,
    clear_items,
    antSelect,
    updateNodeById,
  };
};
