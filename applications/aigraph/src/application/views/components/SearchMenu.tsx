import React, { useEffect } from 'react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarTrigger,
} from '../../../components/ui/menubar';
import SearchPng from '../../assets/img/Search.png';
import CaretDown from '../../assets/img/CaretDown.png';
import { AI_GRAPH_TYPE } from '../GraphView';

const SearchMenu = ({ handleEvent }: { handleEvent?: (type: string, data?: any) => any }) => {
  // 使用value作为状态值
  // 使用value作为状态值
  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    console.log('SearchMenu菜单状态:', open ? '打开' : '关闭');
  };
  const menuTriggerRef = React.useRef<HTMLDivElement>(null);
  // useEffect(() => {
  return (
    <Menubar
      ref={menuTriggerRef}
      onValueChange={(value) => {
        if (handleEvent) {
          handleEvent(AI_GRAPH_TYPE.SEARCH);
        }
        // value为空字符串时表示关闭，否则表示打开
        handleOpenChange(value !== '');
      }}
      className="flex rounded-md bg-white !text-[#555555] border-none"
    >
      <MenubarMenu>
        <MenubarTrigger
          style={{ background: 'white' }}
          className="flex select-none cursor-pointer items-center justify-between rounded px-[16px] text-sm border border-none "
        >
          <img src={SearchPng} width={16} height={16} className="mr-[6px]" />
          <span className="text-sm !text-[#555555] mr-[4px]">查询</span>
          <img src={CaretDown} width={10} height={10} />
        </MenubarTrigger>
        <MenubarPortal>
          <MenubarContent
            className="hidden min-w-[460px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
            align="start"
            sideOffset={5}
            alignOffset={0}
          >
            {/* <div className="flex items-center text-sm font-normal text-[#555555] select-none justify-between">
              请输入查询条件
            </div> */}
          </MenubarContent>
        </MenubarPortal>
      </MenubarMenu>
    </Menubar>
  );
};

export default SearchMenu;
