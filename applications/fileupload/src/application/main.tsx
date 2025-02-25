import { useState, useRef } from "react";
import axios, { AxiosProgressEvent } from "axios";
import { Upload, CircleMinus, CircleX } from "lucide-react";

import "./style.css";
import { ListStyle } from "@/application/components/ListStyle";
import { MacosStyle } from "@/application/components/MacosStyle";
interface FileUploaderProps {
  enableWorker?: boolean;
  chunks?: boolean;
  chunkSize?: number;
  notify?: boolean;
  notifyComponent?: React.ReactNode;
  url?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  setting?: {
    title?: string;
  };
}

interface FileChunk {
  index: number;
  chunk: Blob;
}

interface UploadFile {
  id: string;
  file: File;
  hash: string;
  chunks: FileChunk[];
  progress: number;
  uploadedIndexes: number[];
  status: "pending" | "uploading" | "completed" | "error";
}

// const CHUNK_SIZE = 1024 * 1024; // 1MB

// 在组件顶部添加模拟数据
const mockFiles: UploadFile[] = [
  {
    id: "1",
    file: new File([""], "photo.jpg"),
    hash: "hash1",
    chunks: [],
    progress: 35,
    uploadedIndexes: [],
    status: "uploading",
  },
  {
    id: "2",
    file: new File([""], "document.pdf"),
    hash: "hash2",
    chunks: [],
    progress: 100,
    uploadedIndexes: [],
    status: "completed",
  },
  {
    id: "3",
    file: new File([""], "error-file.zip"),
    hash: "hash3",
    chunks: [],
    progress: 65,
    uploadedIndexes: [],
    status: "error",
  },
  {
    id: "4",
    file: new File([""], "video.mp4"),
    hash: "hash4",
    chunks: [],
    progress: 0,
    uploadedIndexes: [],
    status: "pending",
  },
];

const FileUploader = ({
  enableWorker = false,
  chunks = false,
  chunkSize = 1024 * 1024,
  notify = false,
  notifyComponent,
  url = "http://localhost:3000",
  open = true,
  onOpenChange,
  setting,
}: FileUploaderProps) => {
  const [files, setFiles] = useState<UploadFile[]>(mockFiles); // 开发时使用mockFiles，正式使用[]
  const workerRef = useRef<Worker>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 生成文件哈希（Web Worker版本）
  const generateHashWithWorker = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      workerRef.current = new Worker("/hash.worker.js");
      workerRef.current.postMessage(file);
      workerRef.current.onmessage = (e) => {
        resolve(e.data.hash);
      };
    });
  };

  // 生成文件哈希（主线程版本）
  const generateHash = async (file: File): Promise<string> => {
    // 这里需要实现哈希生成逻辑（示例使用文件名模拟）
    return `${file.name}-${file.size}`;
  };

  // 文件切片
  const createFileChunks = (file: File): FileChunk[] => {
    const chunks: FileChunk[] = [];
    let index = 0;
    for (let i = 0; i < file.size; i += chunkSize) {
      chunks.push({
        index,
        chunk: file.slice(i, i + chunkSize),
      });
      index++;
    }
    return chunks;
  };

  // 检查文件状态
  const checkFileStatus = async (hash: string) => {
    const { data } = await axios.get(`${url}/file/check`, {
      params: { hash },
    });
    return data;
  };

  // 上传分片
  const uploadChunk = async (
    hash: string,
    chunk: Blob,
    index: number,
    total: number,
    onProgress: (progressEvent: AxiosProgressEvent) => void
  ) => {
    const formData = new FormData();
    formData.append("hash", hash);
    formData.append("chunk", chunk);
    formData.append("index", index.toString());
    formData.append("total", total.toString());

    await axios.post(`${url}/file/upload`, formData, {
      onUploadProgress: onProgress,
    });
  };

  // 合并分片
  const mergeChunks = async (hash: string, total: number) => {
    await axios.post(`${url}/file/merge`, { hash, total });
  };

  // 处理拖拽上传
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    await handleFiles(files);
  };

  const handleFiles = async (selectedFiles: File[]) => {
    for (const file of selectedFiles) {
      // 生成文件哈希
      const hash = enableWorker ? await generateHashWithWorker(file) : await generateHash(file);

      // 检查文件状态
      const status = await checkFileStatus(hash);

      // 初始化上传文件对象
      const uploadFile: UploadFile = {
        id: `${hash}-${Date.now()}`,
        file,
        hash,
        chunks: chunks ? createFileChunks(file) : [],
        progress: 0,
        uploadedIndexes: status.indexes || [],
        status: "pending",
      };

      setFiles((prev) => [...prev, uploadFile]);

      // 开始上传
      if (chunks) {
        await uploadChunks(uploadFile);
      } else {
        await uploadWholeFile(uploadFile);
      }
    }
  };

  // 处理文件选择
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    await handleFiles(selectedFiles);
  };

  // 分片上传逻辑
  const uploadChunks = async (uploadFile: UploadFile) => {
    const total = uploadFile.chunks.length;
    const pendingChunks = uploadFile.chunks.filter((chunk) => !uploadFile.uploadedIndexes.includes(chunk.index));

    try {
      setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading" } : f)));

      await Promise.all(
        pendingChunks.map(async (chunk) => {
          await uploadChunk(uploadFile.hash, chunk.chunk, chunk.index, total, (progressEvent) => {
            const progress = Math.round((progressEvent.loaded / progressEvent.total!) * 100);
            setFiles((prev) =>
              prev.map((f) => {
                if (f.id === uploadFile.id) {
                  const uploaded = [...new Set([...f.uploadedIndexes, chunk.index])];
                  return {
                    ...f,
                    progress: (uploaded.length / total) * 100,
                    uploadedIndexes: uploaded,
                  };
                }
                return f;
              })
            );
          });
        })
      );

      await mergeChunks(uploadFile.hash, total);
      setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed" } : f)));
    } catch (error) {
      setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error" } : f)));
    }
  };

  // 整体文件上传
  const uploadWholeFile = async (uploadFile: UploadFile) => {
    const formData = new FormData();
    formData.append("file", uploadFile.file);

    try {
      await axios.post(`${url}/file/upload`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded / progressEvent.total!) * 100);
          setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f)));
        },
      });
      setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed" } : f)));
    } catch (error) {
      setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error" } : f)));
    }
  };

  // 点击上传区域处理
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full h-full flex flex-col items-start justify-start bg-slate-50">
      <div className="w-full px-4 py-2 bg-background flex items-center justify-between">
        <div className="text-muted-foreground text-sm ">{setting?.title || "文件上传"}</div>
        <div className="flex flex-row items-center justify-center space-x-1">
          <button onClick={() => onOpenChange?.(false)} className="hover:bg-gray-100 rounded-full p-1">
            <CircleMinus size={14} className="text-gray-500 hover:text-gray-700" />
          </button>
          <button onClick={() => onOpenChange?.(false)} className="hover:bg-gray-100 rounded-full p-1">
            <CircleX size={14} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>
      </div>
      <div className="w-full h-full flex items-center justify-start flex-row-reverse">
        <div className="w-4/12 h-full p-4">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={handleUploadClick}
            className="border-2 border-dashed relative border-gray-300 rounded-lg p-8 text-center h-full cursor-pointer hover:border-blue-500 transition-colors group"
          >
            <div className="flex flex-col h-full w-full items-center -translate-y-5 justify-center space-y-2">
              <Upload size={24} className=" text-gray-400 group-hover:text-blue-500" />
              <div className="text-muted-foreground group-hover:text-blue-500">拖放文件到这里或点击上传</div>
              <div className="text-xs text-muted-foreground ">支持多个文件上传，最大5GB</div>
              <div className="text-xs text-muted-foreground ">支持Pdf,图片,压缩包等</div>
            </div>
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} multiple />
          </div>
        </div>
        <div className="w-full h-full">
          <MacosStyle files={files} />
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
