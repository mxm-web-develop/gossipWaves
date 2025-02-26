import React, { useEffect, useRef, useState } from 'react';
import JSZip from 'jszip';
import PptxGenJS from 'pptxgenjs';
import './FileViewer.css'; // 引入自定义样式
import { useStateStore } from '../core/useStateStore';
import { AppStatus } from '../@types/sys';

interface PptDisplayDisplayProps {
  width?: number;
  scale?: number;
  handlePageItemClicked?: any;
}

const PptDisplay: React.FC<PptDisplayDisplayProps> = ({ width, scale, handlePageItemClicked }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { appState, setAppStatus } = useStateStore.getState();
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    const loadPptx = async () => {
      if (appState.checha_data) {
        const zip = new JSZip();
        const content = await zip.loadAsync(appState.checha_data);
        const slideFiles = Object.keys(content.files).filter(fileName =>
          fileName.startsWith('ppt/slides/slide') && fileName.endsWith('.xml')
        );

        const slideContents = await Promise.all(
          slideFiles.map(async (fileName) => {
            const file = content.files[fileName];
            return await file.async('string');
          })
        );

        setSlides(slideContents);
        setAppStatus(AppStatus.LOADED);
      }
    };

    loadPptx().catch(error => {
      console.error('Error loading PPTX:', error);
      setAppStatus(AppStatus.ERROR);
    });
  }, [appState.checha_data]);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: width || '100%', height: '100%' }} className='overflow-y-scroll overflow-x-hidden'>
      {slides.map((slide, index) => (
        <div key={index} className="slide" style={{
          marginBottom: '20px',
          padding: '20px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.2s',

        }}>
          <h3 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '1.2em', color: '#333' }}>Slide {index + 1}</h3>
          <div dangerouslySetInnerHTML={{ __html: slide }} style={{ padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }} />
        </div>
      ))}
    </div>
  );
};

export default PptDisplay;