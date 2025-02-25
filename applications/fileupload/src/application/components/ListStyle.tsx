import * as Progress from '@radix-ui/react-progress';

export const ListStyle = ({files}: {files: any[]}) => {
    return (
        <div className="mt-4 space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="p-2 bg-white rounded border border-gray-100 shadow-sm"
              >
                <div className="w-4 h-4 mr-2 text-gray-500" />
                <div className="flex-1 min-w-0">
                  <div  className='truncate' title={file.file.name}>
                    {file.file.name}
                  </div>
                <Progress.Root 
                    value={file.progress} 
                    className="h-1 bg-gray-100 rounded-full overflow-hidden mt-1"
                  >
                    <Progress.Indicator
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </Progress.Root>
                </div>
                <div className="ml-2 w-20 text-right">
                  {file.status === 'uploading' && `${Math.round(file.progress)}%`}
                  {file.status === 'completed' && '上传成功'}
                  {file.status === 'error' && '上传失败'}
                </div>
              </div>
            ))}
          </div>
    )
};
