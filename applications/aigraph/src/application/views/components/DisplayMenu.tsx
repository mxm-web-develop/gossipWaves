import React, { useEffect } from "react";
import * as Menubar from "@radix-ui/react-menubar";
import {
  ChevronDown,
  LayoutGrid,
  Search,
  View,

} from "lucide-react";
import { cn } from "../../../lib/utils";




const DisplayMenu = () => {
  // 使用value作为状态值
  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    console.log('DisplayMenu菜单状态:', open ? '打开' : '关闭');
  };
  const menuTriggerRef = React.useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   // 使用ref来获取当前组件的trigger元素
  //   const trigger = menuTriggerRef.current;
  //   console.log(trigger)
  //   const observer = new MutationObserver((mutations) => {
  //     mutations.forEach((mutation) => {
  //       console.log(mutation)
  //       if (mutation.attributeName === 'data-state') {
  //         const state = (mutation.target as HTMLElement).getAttribute('data-state');
  //         console.log('显示 Menu state changed:', state);
  //       }
  //     });
  //   });
  //   if (trigger) {
  //     observer.observe(trigger, {
  //       attributes: true,
  //       attributeFilter: ['data-state']
  //     });
  //   }
  //   return () => observer.disconnect();
  // }, []);
  return (
    <Menubar.Root ref={menuTriggerRef}
      onValueChange={(value) => {
        // value为空字符串时表示关闭，否则表示打开
        handleOpenChange(value !== '');
      }} className="flex rounded-md bg-white !text-[#555555]">
      <Menubar.Menu>
        <Menubar.Trigger
          // 添加ref
          className="flex select-none cursor-pointer items-center justify-between gap-x-2 rounded px-[20px] py-2 text-sm !bg-white border border-none ">
          <View size={16} />
          <span className='text-sm !text-[#555555]'>
            显示
          </span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            "data-[state=open]:rotate-180" // 当菜单打开时旋转图标
          )} />
        </Menubar.Trigger>
        <Menubar.Portal>
          <Menubar.Content
            className="min-w-[200px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
            align="start"
            sideOffset={5}
            alignOffset={0}
          >
            <div className="flex items-center text-sm font-normal text-[#555555] select-none justify-between">
              <div>
                显示设置
              </div>
              <div>

              </div>
            </div>
          </Menubar.Content>
        </Menubar.Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
};

export default DisplayMenu