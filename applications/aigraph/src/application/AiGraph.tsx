import { GraphData } from '@antv/g6';
import './style.css';
import GraphView, { GraphRefType } from './views/GraphView';

const AiGraph = (props: {
  graphRef?: React.RefObject<GraphRefType>;
  handleEvent?: (type: string, data?: any) => any;
  initData: null | GraphData;
  createBy?: string;
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full
      transition-colors duration-300 box-border bg-white text-black}`}
      onContextMenu={(e) => e.preventDefault()} // 禁止默认的鼠标右键操作
    >
      <GraphView {...props} />
    </div>
  );
};

export default AiGraph;
