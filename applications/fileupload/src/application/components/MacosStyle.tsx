import { File } from "lucide-react";
import { Trash2, RefreshCw, XCircle } from 'lucide-react';
export const MacosStyle = ({files}: {files: any[]}) => {
    return (
        <div className="grid grid-cols-4 gap-4 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3">
        {files.map((file) => {
          const isCompleted = file.status === 'completed';
          const isError = file.status === 'error';
          const isUploading = file.status === 'uploading';

          return (
            <div
              key={file.id}
              className="group relative flex flex-col items-center p-2 rounded-xl transition-all duration-300 hover:bg-gray-50"
            >
              {/* 文件图标容器 */}
              <div className="relative w-20 h-20 mb-2">
                {/* 基础文件图标 */}
                <div className={`w-full h-full flex items-center justify-center rounded-2xl bg-blue-50 ${
                  !isCompleted && 'opacity-50'
                }`}>
                  <File className="w-10 h-10 text-blue-500" />
                </div>

                {/* 进度覆盖层（仅在上传中显示） */}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* 饼图进度指示 */}
                    <div
                      className="absolute inset-0 bg-gray-200/50 rounded-2xl transition-all duration-300"
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          file.progress >= 50 ? '0% 0%, 0% 100%, 50% 100%' :
                          `${50 + (50 * file.progress/50)}% 0%)`
                        }`
                      }}
                    ></div>

                    {/* 进度文本 */}
                    <span className="relative z-10 text-sm font-medium text-gray-700">
                      {Math.round(file.progress)}%
                    </span>
                  </div>
                )}

                {/* 错误状态覆盖 */}
                {isError && (
                  <div className="absolute inset-0 bg-red-500/20 rounded-2xl flex items-center justify-center">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                )}

                {/* 操作按钮组 */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-2xl">
                  {isError ? (
                    <>
                      <button className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100">
                        <RefreshCw className="w-5 h-5 text-red-600" />
                      </button>
                      <button className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100">
                        <Trash2 className="w-5 h-5 text-gray-600" />
                      </button>
                    </>
                  ) : (
                    <button className="p-1.5 bg-white rounded-full shadow hover:bg-gray-100">
                      <Trash2 className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>

                {/* 状态指示器（仅错误状态显示） */}
                {isError && (
                  <div className="absolute top-1 right-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* 文件名 */}
              <span className="text-xs text-center text-gray-600 px-1 truncate w-full">
                {file.file.name}
                {isError && <span className="block text-red-500 text-[10px]">上传失败</span>}
              </span>
            </div>
          );
        })}
      </div>
      )
};
