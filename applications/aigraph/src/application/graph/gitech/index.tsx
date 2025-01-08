import { Graph } from '@antv/g6';
const default_size = 18;
export const registerGitechGraph = (
  graph: Graph,
  data: any,
  data_type?: 'gitech_finance' | 'default'
) => {
  if (!graph || !data) return;
  const dataType = data_type || 'default';
  // 先清空数据
  graph.clear();

  // 设置默认布局
  graph.setLayout({
    type: 'dagre',
    rankdir: 'LR',
    nodesep: 20,
    ranksep: 50,
  });

  //数据转换

  // 设置行为
  graph.setBehaviors([
    'AutoAdaptLabel',
    'Drag-Canvas', // 允许画布拖拽
    'Zoom-Canvas', // 允许画布缩放
    'Drag-Node', // 允许节点拖拽
    'Click-Select', // 点击选中节点
    'Hover', // 鼠标悬停交互
  ]);
  // 设置插件
  graph.setPlugins([]);

  // 设置数据
  graph.updateData({
    //设置节点相关，方法接受基本节点数据，返回完整样式节点数据
    nodes: [],
    //设置边相关
    edges: [],
    combos: [],
  });

  // 在渲染前进行布局和位置调整
  graph.fitCenter();

  // 最后执行渲染
  graph.render();
};
