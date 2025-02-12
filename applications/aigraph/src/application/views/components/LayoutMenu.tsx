/* eslint-disable react-hooks/exhaustive-deps */
import React, { ReactNode, useState } from 'react';
import CaretDown from '../../assets/img/CaretDown.png';
import { useAppState } from '../../store';
import LayoutOutlined from '../../assets/img/LayoutOutlined.png';
import layoutOutlinedClick from '../../assets/img/layoutOutlinedClick.png';
import layoutClick from '../../assets/img/layoutClick.png';
import { layoutConfig } from '../../graph/config';
import { Dropdown } from 'antd';
const LAYOUT_OPTIONS: any[] = [
  { key: 'force', label: '力导布局' },
  { key: 'circular', label: '环形布局' },
  { key: 'radial', label: '辐射布局' },
  { key: 'grid', label: '网格布局' },
];

const LayoutCom = ({ containerRef }: any) => {
  const [selectedLayout, setSelectedLayout] = React.useState<string>(LAYOUT_OPTIONS[0].key);
  const { graph } = useAppState();
  const [open, setOpen] = useState(false);
  const handleLayoutChange = (value: string) => {
    if (!graph) return;
    setSelectedLayout(value);
    graph.setLayout(layoutConfig[value]);
    graph.layout();
  };

  return (
    <div style={{ width: '132px' }}>
      <Dropdown
        menu={{ items: LAYOUT_OPTIONS }}
        open={open}
        getPopupContainer={() => (containerRef?.current ? containerRef.current : null)}
        onOpenChange={(v) => {
          setOpen(v);
        }}
        dropdownRender={(menus: ReactNode) => {
          return (
            <div
              style={{
                backgroundColor: '#fff',
                width: '120px',
                height: '156px',
                boxShadow: '0 4px 12px 0 #eee',
                borderRadius: '4px',
                padding: '4px 0 0 0',
              }}
            >
              {LAYOUT_OPTIONS.map((item: any, index: number) => {
                return (
                  <div
                    key={item.key}
                    style={{
                      backgroundColor: selectedLayout === item.key ? '#EDF4FF' : '',
                      height: '32px',
                      marginTop: '4px',
                      cursor: 'pointer',
                      lineHeight: '32px',
                      color: '#2a2a2a',
                      fontSize: '12px',
                      padding: '0 16px',
                    }}
                    onClick={() => {
                      handleLayoutChange(item.key);
                    }}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          );
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px 0 20px',
            height: '30px',
          }}
        >
          <img
            src={open ? layoutOutlinedClick : LayoutOutlined}
            width={16}
            height={16}
            style={{ marginRight: '6px' }}
          />
          <div
            style={{ color: open ? '#055AFF' : '#555555', fontSize: '12px', marginRight: '8px' }}
          >
            {LAYOUT_OPTIONS.find((option) => option.key === selectedLayout)?.label}
          </div>
          <img src={open ? layoutClick : CaretDown} width={10} height={10} />
        </div>
      </Dropdown>
    </div>
  );
};

export default LayoutCom;
