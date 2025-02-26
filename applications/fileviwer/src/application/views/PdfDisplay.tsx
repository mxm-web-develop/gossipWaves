import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { useStateStore } from '../store';
import { produce } from 'immer';
import { AppStatus } from '../store/system.type';
import { ScrollArea } from '@radix-ui/themes';
import { AnotationType } from '../types/system';
const options = {
  cMapUrl: `/cmaps/`,
};
export function registerPDFWorker(workerUrl: string) {
  console.log('workerUrl', workerUrl);
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
}
interface IPDFDisplayer {
  width?: number;
  scale?: number;
  annotation?: AnotationType;
  handleEmmit?: (type: string) => any;
  setPdfInfo?: (arg: { numPages: number }) => void;
}

const PDFDisplay = forwardRef((props: IPDFDisplayer, ref) => {
  const { annotation, handleEmmit, setPdfInfo } = props;
  const { appState, setAppStatus } = useStateStore();
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });
  const [markScale, setMarkScale] = useState(0);
  const pageChange = (page: number) => {
    useStateStore.setState((prevState) =>
      produce(prevState, (draft) => {
        draft.appState.page_manager = {
          ...draft.appState.page_manager,
          current: page,
        };
      })
    );
  };

  const getTotal = () => {
    return appState.page_manager.total;
  };

  const getAllConfig = () => {
    return {
      markScale,
      canvasSize,
      annotation,
      renderWidth: props.width,
    };
  };

  useImperativeHandle(ref, () => ({
    pageChange,
    getTotal,
    getAllConfig,
  }));
  const updatePageManager = (numPages: number) => {
    useStateStore.setState((prevState) =>
      produce(prevState, (draft) => {
        draft.appState.page_manager = {
          total: numPages,
          current: 1,
        }; // 确保 page_manager 存在并更新 total
      })
    );
  };
  const onDocumentLoadSuccess = (pdfInfo: any) => {
    const { numPages } = pdfInfo;
    handleEmmit && handleEmmit('pdfSuccess');
    setPdfInfo && setPdfInfo(pdfInfo);
    updatePageManager(numPages);
    setAppStatus(AppStatus.LOADED);

    // 检查并调整滚动位置
    const container = document.querySelector('.pdf-document');
    if (container) {
      container.scrollTop = 0; // 滚动到第一页的顶部
      const pageHeight = container.scrollHeight / numPages;
      container.scrollTop = pageHeight * 8; // 滚动到第9页的顶部
    }
  };
  const onDocumentLoadError = (error: any) => {
    console.error('Error loading PDF:', error);
    setAppStatus(AppStatus.ERROR);
  };
  const checha_data = useMemo(() => {
    if (appState.data?.length) {
      const currentFileData = appState.data.find((item) => item.id === appState.current_file);
      if (currentFileData) {
        return currentFileData.checha_data;
      }
      return null;
    }
  }, [appState.data, appState.current_file]);

  const drawMark = () => {
    const { data }: any = annotation;

    const selfCanvas: any = document.getElementById('selfCanvas');
    if (!selfCanvas) return;
    const ctx = selfCanvas.getContext('2d');

    ctx.clearRect(0, 0, canvasSize.w, canvasSize.h); // 清空画布

    data.forEach((item: any) => {
      const { position, anotation_color } = item;
      ctx.beginPath();
      ctx.fillStyle = anotation_color || 'rgba(223,231,255,.5)';
      // 使用四个位置绘制矩形
      const [[tlX, tlY]] = position;
      ctx.moveTo(tlX * markScale, tlY * markScale); // 移动到第一个点

      for (let i = 1; i < position.length; i++) {
        ctx.lineTo(position[i][0] * markScale, position[i][1] * markScale); // 绘制线段
      }

      ctx.closePath(); // 关闭路径
      ctx.fill(); // 填充多边形
    });
  };

  useEffect(() => {
    if (
      annotation?.method !== 'position' ||
      !canvasSize.w ||
      !canvasSize.h ||
      !markScale ||
      !annotation?.data
    )
      return;
    drawMark();
  }, [canvasSize, annotation?.data, markScale]);

  const setSelfCanvasSize = (annotation: AnotationType) => {
    const { origin_paper_size } = annotation;
    if (!origin_paper_size || !props.width) return;
    const curWidth = props.width;
    const scale = +(curWidth / origin_paper_size?.width).toFixed(2);
    setMarkScale(scale);
    setCanvasSize({ w: curWidth, h: origin_paper_size?.height * scale });
  };

  useEffect(() => {
    if (annotation?.method !== 'position' || !props.width || !annotation.origin_paper_size) return;
    setSelfCanvasSize(annotation);
  }, [annotation?.origin_paper_size, props.width]);

  return (
    <div className="h-full">
      <ScrollArea
        type="scroll"
        scrollbars="vertical"
        size={'2'}
        style={{ height: '100%', width: '100%' }}
      >
        <div
          className="mx-auto"
          style={{ width: annotation?.method === 'position' ? canvasSize.w : '100%' }}
        >
          {/* <Document
            file={checha_data}
            className="pdf-document relative h-full"
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            options={options}
          > */}
          <Document
            file={checha_data}
            className="pdf-document relative h-full"
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            options={options}
            loading={<div className="text-center py-4">正在加载PDF...</div>} // 添加加载状态
            error={<div className="text-red-500 p-4">PDF加载失败</div>} // 自定义错误提示
            noData={<div className="text-gray-500 p-4">等待PDF文件加载...</div>}
          >
            <canvas
              id="selfCanvas"
              width={canvasSize.w}
              height={canvasSize.h}
              className="absolute top-0 left-0 z-10"
            />
            <div className="flex flex-col gap-y-3">
              {annotation?.method === 'position' ? (
                <Page
                  pageNumber={appState.page_manager.current}
                  width={props.width}
                  scale={props.scale}
                />
              ) : (
                Array.from(new Array(appState.page_manager?.total), (el, index) => (
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    width={props.width}
                    scale={props.scale}
                  />
                ))
              )}
            </div>
          </Document>
        </div>
      </ScrollArea>
    </div>
  );
});

export default PDFDisplay;
