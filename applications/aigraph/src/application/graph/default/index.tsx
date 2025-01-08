import { Graph, IEvent, GraphEvent, CanvasEvent } from '@antv/g6';
import MyContextMenu from '../MyContextMenu';
import { createRoot } from 'react-dom/client';
import { createElement } from 'react';
import { color_palette } from './constant';
import { CustomTooltip } from '../../views/components/Tooltip';

// register(ExtensionCategory.BEHAVIOR, 'AutoAdaptLabel', AutoAdaptLabel);

const default_size = 48;
export const registerDefaultGraph = (
  graph: Graph,
  data: any,
  setTargetType: (targetType: string) => void,
  data_type?: 'gitech_finance' | 'default'
) => {
  if (!graph || !data) return;
  const dataType = data_type || 'default';
  const [width, height] = graph.getSize();
  const centerX = width / 2;
  const centerY = height / 2;
  // 先清空数据
  graph.clear();
  const processedNodes = data.nodes.map((node: any) => ({
    ...node,

    style: {
      ...node.style,
      x: node?.x ?? centerX,
      y: node?.y ?? centerY,
    },
  }));

  graph.setNode({
    style: {
      size: default_size,
    },
    state: {
      // 选中状态：突出显示，带阴影
      selected: {
        // 基础样式
        fill: (node) => {
          // 获取节点原有填充色并加深
          console.log(node, 'node');
          return '#1890FF';
        },
        stroke: '#1890FF', // 描边色
        lineWidth: 2, // 描边宽度
        opacity: 1, // 透明度

        // 阴影效果
        // shadowColor: '#1890FF', // 阴影颜色
        shadowBlur: 10, // 阴影模糊度
        shadowOffsetX: 0, // 阴影X偏移
        shadowOffsetY: 0, // 阴影Y偏移

        // 标签样式
        labelCfg: {
          style: {
            fill: '#1890FF', // 文字颜色
            fontSize: 14, // 文字大小
            fontWeight: 500, // 文字粗细
          },
        },

        // 动画配置
        animate: {
          duration: 300,
          easing: 'easeCubic',
        },
      },
    },
    palette: {
      type: 'group', // 指定色板类型为分类色板
      field: 'category', // 指定数据中的分组字段
      color: color_palette, // 使用 tableau 色板
    },
    animation: {
      enter: 'fade', // 使用渐变动画
      update: 'translate', // 使用平移动画
      exit: 'fade', // 使用渐变动画
    },
  });
  // 设置默认布局
  graph.setLayout({
    type: 'force',
    animation: true,
    //animated: true, // 启用布局动画
    // preventOverlap: true,
  });
  graph.addData({
    nodes: processedNodes,
    edges: data.edges,
  });
  // 设置行为
  graph.setBehaviors((behaviors) => {
    console.log(behaviors, '默认行为');
    return [
      ...behaviors,
      {
        key: 'brush-select',
        type: 'brush-select',
        enable: true,
        enableElements: ['node'], // 指定按键
        state: 'selected',
      },
      { key: 'AutoAdaptLabel', type: 'AutoAdaptLabel', enable: true },
      { key: 'zoom-canvas', type: 'zoom-canvas', enable: true },
      { key: 'drag-element', type: 'drag-element', enable: true, cursor: 'grabbing' },
      { key: 'drag-canvas', type: 'drag-canvas', enable: true, cursor: 'grab' },
      { key: 'click-select', type: 'click-select', animation: true, multiple: true },
      { key: 'focus-element', type: 'focus-element', enable: true, animation: true },
      { key: 'hover-activate', type: 'hover-activate', enable: true },
    ];
  });

  graph.setPlugins((p) => {
    return [
      ...p,
      // { key: 'background', type: 'background', enable: true },
      // { key: 'timebar', type: 'timebar', enable: true },
      // { key: 'minimap', type: 'minimap', enable: true },
      {
        key: 'legend',
        type: 'legend',
        enable: true,
        nodeField: 'category',
        trigger: 'click',
        itemSpacing: 5,
        colPadding: 20,
        rowPadding: 12,
        itemMarkerSize: 12,
        itemLabelFontSize: 12,
      },
      {
        key: 'tooltip',
        type: 'tooltip',
        enable: 'node',
        getContent: (evt: any, target: any) => {
          const container = document.createElement('div');
          const root = createRoot(container);
          const firstTarget = Array.isArray(target) && target.length > 0 ? target[0] : {};
          // 从事件中获取节点数据
          // const node = evt.target;
          root.render(
            createElement(CustomTooltip, { data: firstTarget })
          );

          return container;
        },
      },
      // ...p,
      // { key: 'background', type: 'background', enable: true },
      // {
      //   key: 'grid-line',
      //   type: 'grid-line',
      //   enable: true,
      //   size: 30,
      //   lineWith: 1,
      //   stroke: '#000000',
      // },
      // {
      //   key: 'grid-line',
      //   type: 'grid-line',
      //   enable: true,
      //   size: 20,
      //   lineWith: 1,
      //   stroke: 'ff2424',
      // },
      {
        key: 'contextmenu',
        type: 'contextmenu',
        enable: true,
        getContent: (a: any, b: any) => {
          const { targetType } = a;
          console.log(a, b, 'getContent');
          setTargetType(targetType);
          return document.getElementById('context-menu');
        },

        onClick: (v: any, t: any, c: any) => {
          console.log(v, t, c);
        },
      },
    ];
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
  try {
    graph.render();

    graph.on('beforerender', function () {
      console.log('-----------------------render开始-----------------', graph.getData());
    });
    graph.on('afterrender', function () {
      graph.fitCenter({
        duration: 830,
      });
      console.log('-----------------------render用时-----------------', graph.getData());
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
    console.error('Nodes:', data.nodes);
    console.error('Edges:', data.edges);
    throw error;
  }
};
