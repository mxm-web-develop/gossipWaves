import { Graph } from '@antv/g6';

export const registerDefaultGraph = (graph: Graph, setGraphData: (arg: any) => void) => {
  try {
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
