import { GraphData } from "@antv/g6";
import { DataID } from "@antv/g6/lib/types";
import { message } from "antd";
import { useAppState } from "../store/appState";

export const useCommonFn =(graph:any)=>{


  const { changeStatus } = useAppState();
  const get_items = (): GraphData | any => {
    if (!graph) return console.error('图谱未渲染完成');
    return graph.getData();
  };

  const add_items = (data: GraphData) => {
    if (!graph || graph.destroyed) {
      console.error('图谱未渲染完成或已销毁');
      return;
    }
    
    try {
      const { nodes = [], edges = [] } = data;
      
      // 使用 changeData 而不是 setData，这样可以保持现有数据
      graph.addData({
        nodes,
        edges
      });
      
      graph.render();
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
    allNodeData.forEach((element:any) => {
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

  const handleContextMenuEvent = (event: any) => {
    console.log(event);
  };

  return {
    handleContextMenuEvent,
    get_items,
    add_items,
    delete_items,
    clear_items,
    antSelect,
    updateNodeById
  }
}