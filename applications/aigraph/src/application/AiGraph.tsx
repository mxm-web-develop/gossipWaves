import { GraphData } from '@antv/g6';
import './style.css';
import GraphView, { GraphRefType } from './views/GraphView';
import { useAppState, useServerState } from './store';
import { useEffect } from 'react';
import { wholeGraphSearch } from './services';

const AiGraph = (props: {
  graphRef?: React.RefObject<GraphRefType>;
  handleEvent?: (type: string, data?: any) => any;
  initData?: null | GraphData;
  createBy?: string;
  token?: string;
  url?:string
  username?: string;
  gientechSet?:{
    spaceName:string;
    filedId?:string;
    limit?:number;
  }
}) => {
  const { setUrl, setToken, testConnection,url, token, connectionStatus } = useServerState();
  const { setAppConfig, changeStatus, status,mode,data_type,setGientechSet,gientechSet } = useAppState();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        changeStatus('app_init');

        if (props.url) {
          setUrl(props.url);
          setToken(props.token || "");
          const connectionResult = await testConnection();
    
          if (connectionResult === 'connected') {
            setAppConfig({
              mode: 'server',
              data_type: 'gitech',
              graph_type: 'gitech_finance'
            });
            console.log(props.gientechSet, 'gientechSet');
          
            if (props.gientechSet) {
              const gientechConfig = {
                spaceName: props.gientechSet.spaceName,
                filedId: props.gientechSet.filedId,
                limit: props.gientechSet.limit || 2000
              };
              setGientechSet(gientechConfig);
              
              
              const gdata = await wholeGraphSearch(
                {
                  baseURL: props.url,
                  token: props.token || ''
                },
                gientechConfig
              );
              console.log('开始网络请求数据，转换数据，set数据', gdata);
            }
            changeStatus('data_init');
          } else {
            changeStatus('app_error');
            return;
          }
        } else {
          setAppConfig({
            mode: 'local',
            data_type: 'antv',
            graph_type: 'default'
          });
          changeStatus('data_init');
        }
      } catch (error) {
        changeStatus('app_error');
        console.error('Initialization error:', error);
      }
    };

    initializeApp();
  }, [props.token, props.url, props.gientechSet]);

  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full
      transition-colors duration-300 box-border bg-white text-black}`}
      onContextMenu={(e) => e.preventDefault()} // 禁止默认的鼠标右键操作
    >

      <GraphView {...props} />
    </div>
  );
};

export default AiGraph;
