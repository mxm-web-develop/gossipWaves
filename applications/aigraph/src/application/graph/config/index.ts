import { createRoot } from 'react-dom/client';
import { color_palette } from '../default/constant';
import { createElement } from 'react';
import { CustomTooltip } from '../../views/components/Tooltip';

export const nodeStyleConfig: any = {
  default: {
    style: {
      type: 'circle',
      fillOpacity: 1,
      label: true,
      labelText: (d: any) => d.data?.name,
      labelFill: '#ffffff',
      labelFontSize: 12,
      labelOffsetY: (d: any) => -((d.style?.size || 80) / 2 + 6),
      labelWordWrap: true,
      labelMaxLines: 2,
      labelMaxWidth: (d: any) => d.style?.size || 80,
      fill: (d: any) => d.style?.fill || '#529BF8',
      size: (d: any) => d.style?.size || 80,
      cursor: 'pointer',
      zIndex: 1,
    },
    state: {
      selected: {
        fill: (d: any) => d.style?.fill || '#529BF8',
        stroke: (d: any) => d.style?.fill || '#529BF8',
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
        // animate: {
        //   duration: 300,
        //   easing: 'easeCubic',
        // },
      },
    },
    palette: {
      type: 'group', // 指定色板类型为分类色板
      field: 'category', // 指定数据中的分组字段
      color: color_palette, // 使用 tableau 色板
    },
    // animation: {
    //   enter: 'fade', // 使用渐变动画
    //   update: 'translate', // 使用平移动画
    //   exit: 'fade', // 使用渐变动画
    // },
  },
};

export const edgeStyleConfig: any = {
  default: {
    style: {
      stroke: '#65A7F8',
      lineWidth: 1,
      label: true,
      labelText: (d: any) => d.data?.name,
      labelFill: '#888888',
      labelFontSize: 12,
      labelOffsetY: -12,
      cursor: 'pointer',
    },
    state: { selected: {} },
  },
};

export const behaviorsConfig = {
  default: [
    'drag-canvas',
    'zoom-canvas',
    // {
    //   key: 'brush-select',
    //   type: 'brush-select',
    //   enable: true,
    //   enableElements: ['node', 'edge'], // 指定按键
    //   state: 'selected',
    // },
    // { key: 'AutoAdaptLabel', type: 'AutoAdaptLabel', enable: true },
    { key: 'drag-element', type: 'drag-element', enable: true },
    { key: 'click-select', type: 'click-select', multiple: true },
    // { key: 'focus-element', type: 'focus-element', enable: true, animation: true },
    // { key: 'hover-activate', type: 'hover-activate', enable: true },
  ],
};

export const layoutConfig = { default: { type: 'force', animation: true } };

export const pluginsConfig = ({
  getContextMenu,
  contextMenuClick,
  onScreenEnter,
  onScreenExit,
}: {
  getContextMenu: (a: any, b: any) => void;
  contextMenuClick: (v: any, t: any, c: any) => void;
  onScreenEnter: () => void;
  onScreenExit: () => void;
}) => {
  return {
    default: [
      {
        type: 'fullscreen',
        key: 'fullscreen',
        onEnter: onScreenEnter,
        onExit: onScreenExit,
      },
      // { key: 'background', type: 'background', enable: true },
      // { key: 'timebar', type: 'timebar', enable: true },
      // { key: 'minimap', type: 'minimap', enable: true },
      // {
      //   key: 'legend',
      //   type: 'legend',
      //   enable: true,
      //   nodeField: 'category',
      //   trigger: 'click',
      //   itemSpacing: 5,
      //   colPadding: 20,
      //   rowPadding: 12,
      //   itemMarkerSize: 12,
      //   itemLabelFontSize: 12,
      // },
      {
        key: 'tooltip',
        type: 'tooltip',
        enable: (e: any) => {
          if (e?.target?.type === 'node') return true;
          return false;
        },
        offset: [40, 0],
        getContent: (evt: any, target: any) => {
          const container = document.createElement('div');
          const root = createRoot(container);
          const firstTarget = Array.isArray(target) && target.length > 0 ? target[0] : {};
          // 从事件中获取节点数据
          root.render(createElement(CustomTooltip, { data: firstTarget }));

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
      //   stroke: '#eee',
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
        getContent: getContextMenu,
        onClick: contextMenuClick,
      },
    ],
  };
};
