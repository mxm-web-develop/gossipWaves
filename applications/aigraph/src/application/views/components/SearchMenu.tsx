import React, { useEffect } from "react";
import * as Menubar from "@radix-ui/react-menubar";
import {
  ChevronDown,
  LayoutGrid,
  Search,

} from "lucide-react";



const SearchMenu = () => {
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
    <Menubar.Root
      ref={menuTriggerRef}
      onValueChange={(value) => {
        // value为空字符串时表示关闭，否则表示打开
        handleOpenChange(value !== '');
      }}
      className="flex rounded-md bg-white !text-[#555555]">
      <Menubar.Menu>
        <Menubar.Trigger className="flex select-none cursor-pointer items-center justify-between gap-x-2 rounded px-[20px] py-2 text-sm !bg-white border border-none ">
          <Search size={16} />
          <span className='text-sm !text-[#555555]'>
            查询
          </span>
          <ChevronDown size={10} />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[460px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
            align="start"
            sideOffset={5}
            alignOffset={0}
          >
            <div className="flex items-center text-sm font-normal text-[#555555] select-none justify-between">
              请输入查询条件

            </div>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};

export default SearchMenu