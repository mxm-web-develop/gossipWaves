import React, { useEffect, useRef } from 'react';
import { Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './FileViewer.css'; // 引入自定义样式

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

interface AnnotationLayerProps {
  pageNumber: number;
  annotations: any[];
  // onAddAnnotation: (pageNumber: number, annotation: any) => void;
  width?: number;
  scale?: number;
}

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({ width, scale, pageNumber, annotations }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // 清除画布
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制现有标注
    annotations.forEach((annotation) => {
      console.log(annotation.pageNumber === pageNumber, annotation.pageNumber, pageNumber)
      if (annotation.pageNumber === pageNumber) {
        context.fillStyle = 'rgba(255, 22, 123, 0.5)';
        context.fillRect(annotation.x, annotation.y, annotation.width, annotation.height);
      }
    });

    // // 添加点击事件以添加新标注
    // const handleClick = (event: MouseEvent) => {
    //   const rect = canvas.getBoundingClientRect();
    //   const x = event.clientX - rect.left;
    //   const y = event.clientY - rect.top;
    //   const newAnnotation = { x, y, width: 50, height: 50, pageNumber }; // 示例标注大小
    //   onAddAnnotation(pageNumber, newAnnotation);
    // };

    // canvas.addEventListener('click', handleClick);

    // return () => {
    //   canvas.removeEventListener('click', handleClick);
    // };
  }, [annotations, pageNumber]);

  return (
    <div style={{ position: 'relative' }}>
      <Page pageNumber={pageNumber} width={width} scale={scale} />
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
        width={width}
      // height={1000}
      />
    </div>
  );
};

export default AnnotationLayer;