import { Empty, Typography } from 'antd';
import React from 'react';

function ErrorGraph({ message }: { message: string }) {
  return (
    <div
      className="absolute flex items-center justify-center z-50 w-full h-full"
      style={{ zIndex: 50, top: 0, left: 0 }}
    >
      <Empty
        styles={{ image: { height: 60 } }}
        description={<Typography.Text>Error</Typography.Text>}
      ></Empty>
    </div>
  );
}

export default ErrorGraph;
