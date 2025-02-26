import { ReactNode, RefObject } from 'react';

// 导出所有公共类型
export interface IUseFileViewer {
  fileUrl: string[] | string;
  form?: 'pdf' | 'doc' | 'docx' | 'txt' | 'md' | 'html' | 'csv' | 'xlsx' | 'img' | string;
  render_width?: number;
  render_scale?: number;
  display_file_type?: string;
  LoadingComponent?: ReactNode;
  fetching_text?: string;
  rending_text?: string;
  error_text?: string;
  view_type?: 'scroll' | 'pagination';
  actionOnEmmit?: (type: string, data?: any) => any;
  annotation?: AnotationType;
  hide_toolbar?: boolean;
  bgColor?: string;
  setPdfInfo?: (arg: any) => void;
}

export type PDFDisplayRef = {
  pageChange: (pageNumber: number) => void;
  getAllConfig: () => PDFConfig;
};

export type MarkdownDisplayRef = {
  heightLight: (arg: { positions: any[]; bgColor?: string }) => void;
};

export interface PDFConfig {
  currentPage: number;
  totalPages: number;
  scale: number;
}

export type FileViewerInstance = {
  mdRef: RefObject<MarkdownDisplayRef>;
  pdfRef: RefObject<PDFDisplayRef>;
  Element: ReactNode;
};

// 以下是核心函数导出
export declare function useFileViewer(props: IUseFileViewer): FileViewerInstance;
export declare function registerPDFWorker(workerPath: string): void;

// 导出其他必要类型
export type AnotationType = {
  // 填入实际类型定义
  method: 'match' | 'position' | 'index';
  data?: any[];
  origin_paper_size?: {
    width: number;
    height: number;
  };
  anotation_color?: string;
  defaultPage?: number;
};

export enum AppStatus {
  UNLOAD = 'UNLOAD',
  FETCHED = 'FETCHED',
  LOADED = 'LOADED',
  ERROR = 'ERROR'
}