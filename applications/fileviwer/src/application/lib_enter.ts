import { useFileViewer } from './Fileviewer';
import { registerPDFWorker } from './views/PdfDisplay';
import type { 
  IUseFileViewer,
  PDFDisplayRef,
  MarkdownDisplayRef,
  FileViewerInstance
} from './types/system';
import type { AppStatus } from './store/system.type';

export { 
  useFileViewer, 
  registerPDFWorker,
  // 统一从system.ts导出类型
  type IUseFileViewer,
  type AppStatus,
  type FileViewerInstance,
  type PDFDisplayRef,
  type MarkdownDisplayRef
};