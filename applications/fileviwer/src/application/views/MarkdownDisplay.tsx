import ReactMarkdown from 'react-markdown';
import { useStateStore } from '../store';
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { AppStatus } from '../store/system.type';
import remarkGfm from 'remark-gfm';

const MarkdownDisplay = forwardRef((props: any, ref: any) => {
  const { appState, setAppStatus } = useStateStore();
  const [text, setText] = useState('');
  const tableMd: any = useRef(null);

  const clearHeightLight = () => {
    const doms: any = document.getElementsByClassName('heightLight');
    if (!doms?.length) return;
    for (let i = 0; i < doms.length; i++) {
      doms[i].style.backgroundColor = '';
    }
  };

  const heightLight = (data: { positions: any[]; bgColor?: string }) => {
    const { positions, bgColor } = data;
    if (!tableMd.current) return;
    const children = tableMd.current.children;
    if (!children?.length) return;
    const curTable = Array.from(children).find((item: any) => {
      return item instanceof HTMLTableElement;
    });
    if (!curTable) return;
    clearHeightLight();
    (positions || []).forEach((item: any, index: number) => {
      const [rowIndex, colIndex] = item;
      const row = curTable.rows[rowIndex + 1];
      if (row) {
        const cell = row.cells[colIndex];
        if (cell) {
          if (index === 0) {
            setTimeout(() => {
              cell.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
          }
          cell.className = 'heightLight';
          cell.style.backgroundColor = bgColor || 'lightblue';
        }
      }
    });
  };

  useImperativeHandle(ref, () => ({
    heightLight,
  }));

  useEffect(() => {
    if (appState.data.length && appState.data[0].checha_data) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setText(e.target.result);
        }
      };
      reader.onerror = (error) => {
        console.error('文件读取失败:', error);
        setAppStatus(AppStatus.ERROR);
      };
      const currentFileData = appState.data.find((item) => item.id === appState.current_file);
      reader.readAsText(currentFileData?.checha_data);
      setAppStatus(AppStatus.LOADED);
    }
  }, [appState.data, appState.current_file, setAppStatus]);
  return (
    <div ref={tableMd} className="w-full h-full overflow-auto tableMd">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
    </div>
  );
});

export default MarkdownDisplay;
