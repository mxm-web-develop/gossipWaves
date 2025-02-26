import { useRef, useEffect } from 'react';
import { useStateStore } from '../store';
import { AppStatus } from '../store/system.type';
import { Box, ScrollArea } from '@radix-ui/themes';

const TextDisplay = ({ width }: { width: string | number }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { appState, setAppStatus } = useStateStore();

  useEffect(() => {
    if (appState.data.length && appState.data[0].checha_data && containerRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && containerRef.current && typeof e.target.result === 'string') {
          containerRef.current.innerText = e.target.result;
          console.log('文件内容:', e.target.result); // 打印文件内容，确保解析正确
          // 检查并设置字体（模拟字由字体应用）
          containerRef.current.style.fontFamily = 'sans-serif';
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
    <ScrollArea type="scroll" scrollbars="vertical" size={'2'} style={{ height: '100%' }}>
      <Box px={'5'} py={'3'} className='max-w-[720px] text-wrap mx-auto'>
        <article ref={containerRef} className="prose px-3  break-words !text-wrap" />
      </Box>
    </ScrollArea>
  );
};

export default TextDisplay;
