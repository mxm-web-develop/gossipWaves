import { ArrowLeft } from 'lucide-react';
import * as Separator from '@radix-ui/react-separator';
import { AI_GRAPH_TYPE } from '../../lib_enter';
import Download from '../../assets/img/Download.png';
import LayoutCom from './LayoutMenu';
import SearchMenu from './SearchMenu';
export default function AppController(props: {
  handleEvent: (type: string, data?: any) => any;
  containerRef: any;
  openSearch: boolean;
  setOpenSearch: (arg: boolean) => void;
}) {
  const { handleEvent, containerRef, openSearch, setOpenSearch } = props;
  return (
    <>
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <div
          style={{ padding: '4px 16px' }}
          className="flex items-center justify-between hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-md"
          onClick={() => handleEvent && handleEvent(AI_GRAPH_TYPE.BACK)}
        >
          <ArrowLeft color="#2468F2" size={16} className="mr-[6px]" />
          <div className="text-sm">返回</div>
        </div>
      </div>
      <div style={{ position: 'absolute', top: '20px', right: '15px' }}>
        <div className="flex items-center justify-between" style={{ columnGap: '16px' }}>
          <div
            style={{
              width: '237px',
              height: '32px',
              border: '1px solid #eeeeee',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              backgroundColor: '#ffffff',
              alignItems: 'center',
            }}
          >
            <LayoutCom containerRef={containerRef} />
            <Separator.Root className="bg-[#EEEEEE]" style={{ height: '20px', width: '1px' }} />
            <SearchMenu handleEvent={handleEvent} open={openSearch} setOpen={setOpenSearch} />
          </div>
          <div
            style={{ padding: '4px 16px' }}
            className="flex items-center justify-between hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-[4px]"
            onClick={() => handleEvent && handleEvent(AI_GRAPH_TYPE.EXPORT)}
          >
            <img src={Download} width={16} height={16} className="mr-[6px]" />
            <div className="text-sm text-[#555555]">导出</div>
          </div>
        </div>
      </div>
    </>
  );
}
