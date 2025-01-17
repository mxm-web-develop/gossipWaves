import React, { useEffect } from 'react';
import * as Menubar from '@radix-ui/react-menubar';
import CaretDown from '../../assets/img/CaretDown.png';
import { useAppState } from '../../store';
import LayoutOutlined from '../../assets/img/LayoutOutlined.png';
const LAYOUT_OPTIONS = [
  { value: 'force', label: '力导布局' },
  { value: 'circular', label: '环形布局' },
  { value: 'radial', label: '辐射布局' },
  { value: 'grid', label: '网格布局' },
];

const LayoutMenu = () => {
  // 使用value作为状态值
  const [selectedLayout, setSelectedLayout] = React.useState<string>(LAYOUT_OPTIONS[0].value);
  const { graph } = useAppState();
  const handleLayoutChange = (value: string) => setSelectedLayout(value);

  useEffect(() => {
    if (!graph) return;
    graph.setLayout({
      type: selectedLayout,
      preventOverlap: true, // 防止节点重叠
      nodeSpacing: 50, // 节点间距
    });
    graph.layout();
  }, [selectedLayout]);

  return (
    <Menubar.Root className="flex rounded-md bg-white !text-[#555555]">
      <Menubar.Menu>
        <Menubar.Trigger
          className="flex select-none cursor-pointer
         items-center justify-between rounded px-[16px] py-[4px] text-sm !bg-white border border-none border-[#EEEEEE]"
        >
          <img src={LayoutOutlined} width={16} height={16} className="mr-[6px]" />
          <span className="text-sm !text-[#555555] mr-[4px]">
            {LAYOUT_OPTIONS.find((option) => option.value === selectedLayout)?.label}
          </span>
          <img src={CaretDown} width={10} height={10} />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
            align="start"
            sideOffset={5}
            alignOffset={-3}
          >
            {LAYOUT_OPTIONS.map((option) => (
              <Menubar.Item
                key={option.value}
                className="group relative flex py-[12px] cursor-pointer
                 hover:bg-[#F5F5F5] select-none items-center rounded 
                 px-2.5 text-[13px] leading-none text-[#555555] outline-none data-[highlighted]:bg-gradient-to-br data-[highlighted]:from-violet9 data-[highlighted]:to-violet10 data-[highlighted]:text-violet1"
                onClick={() => handleLayoutChange(option.value)}
              >
                {option.label}
                {selectedLayout === option.value && (
                  <div className="ml-auto pl-5 text-[#2468F2]">✓</div>
                )}
              </Menubar.Item>
            ))}
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};

export default LayoutMenu;
