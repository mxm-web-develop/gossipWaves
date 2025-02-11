/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-case-declarations */
import { GraphData } from '@antv/g6';
import { DataID } from '@antv/g6/lib/types';
import { message } from 'antd';
import { useAppState } from '../store/appState';
import { contextMenuType } from './MyContextMenu';
import { AI_GRAPH_TYPE } from '../views/GraphView';

export const useCommonFn = (graph: any, handleEvent: any, targetInfo: any) => {
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
      const { nodes = [], edges = [] } = data;

      // 使用 changeData 而不是 setData，这样可以保持现有数据
      _graph.addData({
        nodes,
        edges,
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

  const handleContextMenuEvent = (event: any, data?: any) => {
    console.log(event, data);
    switch (event) {
      case contextMenuType['NODE:ONCE']:
        // Handle NODE:ONCE event
        break;
      case contextMenuType['NODE:SECOND_DEGREE']:
        // Handle NODE:SECOND_DEGREE event
        break;
      case contextMenuType['NODE:THIRD_DEGREE']:
        // Handle NODE:THIRD_DEGREE event
        break;
      case contextMenuType['NODE:FOUR_DEGREE']:
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
