/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Graph } from '@antv/g6';
import { AI_GRAPH_TYPE } from '../../views/GraphView';

export const registerDefaultGraph = (
  graph: Graph,
  setGraphData: (arg: any) => void,
  handleEvent?: (type: string, data?: any) => any
) => {
  try {
    graph.on('node:click', (e: any) => {
      const id = e.target.id;
      handleEvent && handleEvent(AI_GRAPH_TYPE.CLICK_NODE, graph.getElementData(id));
    });
    graph.on('edge:click', (e: any) => {
      const id = e.target.id;
      handleEvent && handleEvent(AI_GRAPH_TYPE.CLICK_EDGE, graph.getElementData(id));
    });
    graph.on('canvas:click', (e: any) => {
      handleEvent && handleEvent(AI_GRAPH_TYPE.CLICK_CANVAS, e);
    });
    graph.on('node:contextmenu', (e: any) => {
      if (e?.target?.id) {
        graph.setElementState(e.target.id, 'selected');
      }
    });
    // 监听keydown事件
    graph.on('keydown', (evt: any) => {
      // 当按下shift键时，兼容苹果和windows，判断shift被摁下
      if (evt?.key === 'Shift') {
        graph.updateBehavior({ key: 'drag-canvas', enable: false });
      }
    });
    graph.on('keyup', (evt: any) => {
      graph.updateBehavior({ key: 'drag-canvas', enable: true });
    });

    graph.on('afterdraw', function (event: any) {
      // graph.fitCenter({
      //   duration: 830,
      // });
      setGraphData(graph.getData());
    });

    let startTimeRender = 0;
    graph.on('beforelayout', function () {
      startTimeRender = new Date().valueOf();
      console.log('-----------------------layout开始-----------------', graph.getData());
    });
    graph.on('afterlayout', function () {
      console.log(new Date().valueOf() - startTimeRender);
      console.log('-----------------------layout用时-----------------', graph.getData());
    });
    graph.on('brush-select', (evt: any) => {
      console.log('框选开始', evt);
      // 处理框选开始的逻辑
    });
  } catch (error) {
    console.error('Graph update failed:', error);
    throw error;
  }
};

export const cancelDefaultGraph = (graph: Graph) => {
  try {
    graph.off('node:click', () => {});
    graph.off('edge:click', () => {});
    graph.off('canvas:click', () => {});
    graph.off('node:contextmenu', (e: any) => {});
    graph.off('keydown', (evt: any) => {});
    graph.off('keyup', (evt: any) => {});
    graph.off('afterdraw', function (event: any) {});
    graph.off('beforelayout', function () {});
    graph.off('afterlayout', function () {});
    graph.off('brush-select', (evt: any) => {});
  } catch (error) {
    console.error('Graph update failed:', error);
    throw error;
  }
};
