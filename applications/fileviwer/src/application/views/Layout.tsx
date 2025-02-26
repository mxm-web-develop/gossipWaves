import { ReactNode, useMemo } from 'react';
import { useStateStore } from '../store';
import TxtIcon from '../assets/txt.png';
import TableIcon from '../assets/excel.png';
import ImgIcon from '../assets/img.png';
import PdfIcon from '../assets/pdf.png';
import WordIcon from '../assets/word.png';
import PptIcon from '../assets/ppt.png';
import { cn } from '@udecode/cn';
import { X } from 'lucide-react';


const typeIcons: { [key: string]: string } = {
  csv: TableIcon,
  xls: TableIcon,
  xlsx: TableIcon,
  jpeg: ImgIcon,
  jpg: ImgIcon,
  png: ImgIcon,
  pdf: PdfIcon,
  ppt: PptIcon,
  pptx: PptIcon,
  txt: TxtIcon,
  docx: WordIcon,
  doc: WordIcon,
};
interface ILayout {
  hide_toolbar?: boolean;
  children?: ReactNode;
  pageBar?: ReactNode;
  handleEmmit?: (type: string) => any;
  handleEvent?: (type: string) => any;
  render_width?: number;
  loading?: {
    icon?: ReactNode;
    fetch_text?: string;
    rending_text?: string;
  };
}
const Layout = ({ children, handleEmmit, pageBar, hide_toolbar }: ILayout) => {
  const { appState } = useStateStore();
  const abortAllRequests = useStateStore((state) => state.abortAllRequests);
  const d = appState.data[appState.page_manager.current - 1];
  const { currentIcon, currentHeading } = useMemo(() => {
    const icon = typeIcons[appState.display_file_type || appState.parse_form] || TxtIcon;
    const heading = decodeURIComponent(d?.file_name || '文件名');
    return { currentIcon: icon, currentHeading: heading };
  }, [appState.data, appState.page_manager, appState.display_file_type]);

  const userHandler = (type: string) => {
    console.log('file_display', type);
    switch (type) {
      case 'close':
        abortAllRequests();
        break;
    }
    handleEmmit && handleEmmit(type);
  };
  return (
    <div className="h-full relative">
      <div className="h-full flex-col">
        {!hide_toolbar && (
          <div className="w-full h-[40px]  box-border relative z-10 px-4 bg-white shadow ">
            <div className=" h-full w-full flex  justify-between items-center   ">
              <div className=" flex justify-start items-center gap-x-3">
                <img src={currentIcon} alt={`icon`} className="h-5 w-5" />
                <div
                  className="overflow-hidden  text-ellipsis break-words line-clamp-1"
                  style={{ maxWidth: '350px' }}
                >
                  <p className=" font-bold text-md text-slate-900/70">{currentHeading}</p>
                </div>
              </div>
              <div className=" flex gap-x-3">
                {/* <SizeIcon cursor={'pointer'}  /> */}

                {/* <PlusCircledIcon
                cursor={'pointer'}
                onClick={() => handleEvent && handleEvent('plus')}
              />
              <MinusCircledIcon
                cursor={'pointer'}
                onClick={() => handleEvent && handleEvent('minus')}
              /> */}
                <X size={20} className=" cursor-pointer" onClick={() => userHandler('close')} />
              </div>
            </div>
          </div>
        )}

        <div
          className=" relative"
          style={{
            height: hide_toolbar ? `calc(100% - 0px)` : `calc(100% - 40px)`,
          }}
        >
          <div
            className={cn(' h-full w-full relative', {
              'justify-center items-center': !Array.isArray(appState.data),
            })}
          >
            {Array.isArray(appState.data) && pageBar}

            {children}
          </div>
        </div>
        {/* <Flex align={'center'} justify={'center'} as="div" className="h-[50px] bg-gray-200 flex items-center justify-center">
          页脚内容
        </Flex> */}
      </div>
    </div>
  );
};

export default Layout;
