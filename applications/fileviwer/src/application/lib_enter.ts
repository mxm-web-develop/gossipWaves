import { useFileViewer } from './Fileviewer';
import { registerPDFWorker } from './views/PdfDisplay';
import type { 
  IUseFileViewer,
  FileViewerInstance,
  PDFDisplayRef,
  MarkdownDisplayRef,
  AnotationType,
  PDFConfig
} from './types/system';
import { AppStatus } from './store/system.type';

// 明确导出所有需要的类型和函数
export { 
  useFileViewer, 
  registerPDFWorker,
  AppStatus
};

// 导出所有类型
export type {
  IUseFileViewer,
  FileViewerInstance,
  PDFDisplayRef,
  MarkdownDisplayRef,
  AnotationType,
  PDFConfig
};