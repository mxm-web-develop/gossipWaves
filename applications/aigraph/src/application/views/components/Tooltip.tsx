import React from 'react';
interface TooltipProps {
  data: any;
}

export const CustomTooltip: React.FC<TooltipProps> = ({ data }) => {
  const d = data?.data ? data.data : {};
  return (
    <div className="w-[326px] h-[50px] rounded-[4px] flex pt-[5px] px-[8px]">
      <div className="bg-[#DBBDA0] w-[43px] h-[43px] rounded-[4px] text-[26px] text-white leading-[40px] text-center">
        {d.category ? d.category.substr(0, 1) : ''}
      </div>
      <div className="h-[40px] ml-[16px]">
        <div className="text-[#2A2A2A] font-bold text-[16px]">{d.name}</div>
        <div className="h-[20px] px-[10px]  bg-[#E3F0FF] text-[#055AFF] text-[12px] leading-[20px] text-center rounded-[2px] mt-[4px]">
          {d.category}
        </div>
      </div>
    </div>
  );
};
