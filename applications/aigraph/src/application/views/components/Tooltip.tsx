import React from 'react';
interface TooltipProps {
  data: any;
}

export const CustomTooltip: React.FC<TooltipProps> = ({ data }) => {
  const d = data?.data ? data.data : {};
  return (
    <div
      style={{
        width: '326px',
        height: '50px',
        borderRadius: '4px',
        padding: '5px 8px 0 8px',
        display: 'flex',
      }}
    >
      <div
        style={{
          background: '#DBBDA0',
          width: '43px',
          height: '43px',
          borderRadius: '4px',
          fontSize: '26px',
          color: '#fff',
          lineHeight: '40px',
          textAlign: 'center',
        }}
      >
        {d.name ? d.name.substr(0, 1) : ''}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '40px',
          marginLeft: '16px',
        }}
      >
        <div style={{ color: '#2A2A2A', fontWeight: '16px', fontSize: '16px', minWidth: '10px' }}>
          {d.name}
        </div>
        <div
          style={{
            height: '20px',
            padding: '0 10px',
            background: '#E3F0FF',
            fontSize: '12px',
            lineHeight: '20px',
            textAlign: 'center',
            borderRadius: '4px',
            marginTop: '4px',
            width: 'fit-content',
          }}
        >
          {d.category}
        </div>
      </div>
    </div>
  );
};
