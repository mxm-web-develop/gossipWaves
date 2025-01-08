import React from 'react';
interface TooltipProps {
  data: any;
}

export const CustomTooltip: React.FC<TooltipProps> = ({ data }) => {
  console.log(data);
  return (
    <div className="custom-tooltip">
      <h4>{data.label}</h4>
      <p>类型: {data.category}</p>
      {/* 添加更多内容 */}
    </div>
  );
};
