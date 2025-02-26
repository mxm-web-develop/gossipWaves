import { ReactNode } from 'react';

export interface AnotationPosition {
  id: string;
  page: number;
  anotation_color?: string;
  position: [[number, number], [number, number], [number, number], [number, number]];
}

export type AnotationPositionList = AnotationPosition[];

export type AnotationMethod = 'match' | 'position' | 'index';

export type AnotationType = {
  method: AnotationMethod;
  data?: AnotationPositionList;
  origin_paper_size?: {
    width: number;
    height: number;
  };
  anotation_color?: string;
  defaultPage?: number;
};

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

export type FileViewerInstance = {
  mdRef: React.MutableRefObject<MarkdownDisplayRef | null>;
  pdfRef: React.MutableRefObject<PDFDisplayRef | null>;
  Element: React.ReactNode;
};

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
