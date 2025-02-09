import { ArrowLeft } from 'lucide-react';
import LayoutMenu from './LayoutMenu';
import * as Separator from '@radix-ui/react-separator';
import SearchMenu from './SearchMenu';
import { AI_GRAPH_TYPE } from '../../lib_enter';
import Download from '../../assets/img/Download.png';
export default function AppController(props: { handleEvent: (type: string, data?: any) => any }) {
  const { handleEvent } = props;
  return (
    <div
      className="absolute w-full"
      style={{ height: '32px', top: '20px', left: 0, right: 0, bottom: 0 }}
    >
      <div className="flex items-center px-3.5 justify-between w-full">
        <div>
          <div
            style={{ padding: '4px 16px' }}
            className="flex items-center justify-between hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-md"
          >
            <ArrowLeft color="#2468F2" size={16} className="mr-[6px]" />
            <div
              className="text-sm"
              // onClick={() => handleEvent && handleEvent(AI_GRAPH_TYPE.BACK)}
            >
              返回
            </div>
          </div>
        </div>
        <div className="tool-bar  ">
          <div className="flex items-center justify-between" style={{ columnGap: '16px' }}>
            <div
              style={{ borderRadius: '4px' }}
              className="flex items-center border border-solid border-[#EEEEEE] justify-between bg-white"
            >
              <LayoutMenu />
              <Separator.Root className="bg-[#EEEEEE]" style={{ height: '20px', width: '1px' }} />
              <SearchMenu handleEvent={handleEvent} />
              {/* <DisplayMenu /> */}
            </div>

            {/* <div
        style={{ padding: '4px 16px' }}
        className="flex items-center justify-between hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-[4px]"
      >
        <img src={SaveOutlined} width={16} height={16} className="mr-[6px]" />
        <div
          className="text-sm text-[#555555]"
          onClick={() => handleEvent && handleEvent(AI_GRAPH_TYPE.SAVE)}
        >
          保存
        </div>
      </div> */}
            <div
              style={{ padding: '4px 16px' }}
              className="flex items-center justify-between hover:border-[#2468F2] bg-white cursor-pointer border border-solid border-[#EEEEEE] rounded-[4px]"
            >
              <img src={Download} width={16} height={16} className="mr-[6px]" />
              <div
                className="text-sm text-[#555555]"
                onClick={() => handleEvent && handleEvent(AI_GRAPH_TYPE.EXPORT)}
              >
                导出
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
