import React, { useEffect, useRef, useState } from 'react';
import { Graph } from '@antv/g6';
import { useAppState } from '../store';
import { Renderer } from '@antv/g-webgl';
import { registerDefaultGraph } from '../graph/default';
import { registerGitechGraph } from '../graph/gitech';
import MyContextMenu from '../graph/MyContextMenu';
import { ArrowLeft, Download, Save } from 'lucide-react';
import MenubarDemo from './components/Menubar';
import * as Separator from "@radix-ui/react-separator";
import LayoutMenu from './components/LayoutMenu';
import SearchMenu from './components/SearchMenu';
import DisplayMenu from './components/DisplayMenu';

const default_background = '#F6F6F6';

function GraphView() {
  const { status, rawData, changeStatus, setRawData, setGraph, graph, graph_type, data_type } =
    useAppState();
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [targetType, setTargetType] = useState('canvas');

  useEffect(() => {
    console.log('GraphView', status, rawData);
    // 确保所有条件都满足
    if (!containerRef.current || !rawData) {
      return;
    }
    // 获取父元素尺寸
    const parentElement = containerRef.current.parentElement;
    if (!parentElement) {
      return;
    }
    const width = parentElement.clientWidth;
    const height = parentElement.clientHeight;
    // 确保有有效的宽高
    if (width <= 0 || height <= 0) {
      return;
    }
    // 创建图实例
    const newGraph = new Graph({
      // renderer: () => new Renderer(),
      container: containerRef.current,
      //background: default_background,
      width,
      height,
      background: '#FAFBFD',
      autoFit: {
        type: 'center',
        animation: true,
      },
      autoResize: true,
    });

    graphRef.current = newGraph;
    setGraph(newGraph);
    return () => {
      if (graphRef.current) {
        graphRef.current.destroy();
        graphRef.current = null;
        setIsRegistered(false);
      }
    };
  }, [rawData, graph_type]);

  useEffect(() => {
    if (graph) {
      // 只在图表初始化时进行一次注册
      try {
        switch (graph_type) {
          case 'gitech_finance':
            registerGitechGraph(graph, rawData);
            break;
          case 'default':
            registerDefaultGraph(graph, rawData, setTargetType);
            break;
        }
        setIsRegistered(true);
      } catch (error) {
        console.error('Graph registration failed:', error);
        // 可以添加错误提示UI
      }
      graph.on('afterrender', () => {
        console.log('All nodes:', graph.getData());
      });
    }
  }, [graph, rawData]);

  return (
    <>
      <div ref={containerRef} id="graph-container" className="relative" style={{ width: '100%', height: '100%' }}>
        <div className="absolute bottom-5 flex justify-start gap-x-3 items-center left-[15px] opacity-40 text-sm  h-10 bg-white">
          <div className=' flex justify-center items-center gap-x-1'>
            <span>节点数量</span>
            <span>100/100</span>
          </div>
          <div className=' flex justify-center items-center gap-x-1'>
            <span>关系数量</span>
            <span>100/100</span>
          </div>
        </div>
        <div className=' absolute top-5 left-[15px]  '>
          <div className='flex items-center justify-between gap-x-2 py-2 px-[20px] hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-md'>
            <ArrowLeft color='#2468F2' size={16} />
            <div className='   text-sm'>返回</div>
          </div>
        </div>
        <div className='tool-bar absolute top-5 right-[15px]'>
          <div className='flex items-center justify-between gap-x-1 '>
            <div className='flex items-center rounded-md border border-solid border-[#EEEEEE] justify-between  '>
              <SearchMenu />
              <DisplayMenu />
              <LayoutMenu />
            </div>

            <div className='flex items-center justify-between gap-x-2 py-2 px-[20px] hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-md'>
              <Save color='#2468F2' size={16} />
              <div className='text-sm text-[#555555]'>保存</div>
            </div>
            {/* <div className='flex items-center justify-between gap-x-2 py-2 px-[20px] hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-md'>
              <Download color='#2468F2' size={16} />
              <div className='text-sm text-[#555555]'>导出</div>
            </div> */}
          </div>
        </div>
      </div>

      <MyContextMenu targetType={targetType} />
    </>
  );
}

export default GraphView;
