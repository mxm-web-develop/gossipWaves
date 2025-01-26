import { GraphData } from '@antv/g6';
import './style.css';
import GraphView, { GraphRefType } from './views/GraphView';
import { useAppState, useServerState } from './store';
import { useEffect, useRef } from 'react';
import { wholeGraphSearch } from './services';
import { transformGientechToG6 } from './utils/convertData';

const AiGraph = (props: {
  graphRef?: React.RefObject<GraphRefType>;
  handleEvent?: (type: string, data?: any) => any;
  initData?: null | GraphData;
  createBy?: string;
  token?: string;
  url?:string
  username?: string;
  gientechServer?:{
    url:string
    token?: string;
    spaceName:string;
    filedId?:string;
    limit?:number;
  }
}) => {
  const { setUrl, setToken, testConnection,url, token, connectionStatus } = useServerState();
  const { setAppConfig, changeStatus, status,mode,setGraphData,setGientechSet, } = useAppState();
  const canvasContainer = useRef(null)
  useEffect(() => {
    changeStatus('app_init');
    const initializeApp = async () => {
      try { 
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
            console.log(props.gientechServer, 'gientechSet');
          
            if (props.gientechServer) {
              const gientechConfig = {
                spaceName: props.gientechServer.spaceName,
                filedId: props.gientechServer.filedId,
                limit: props.gientechServer.limit || 2000
              };
              setGientechSet(gientechConfig);
              const gdata = await wholeGraphSearch(
                {
                  baseURL: props.url,
                  token: props.token || ''
                },
                gientechConfig
              );
              const antD = transformGientechToG6(gdata as any)
              console.log('开始网络请求数据，转换数据，set数据', gdata,antD);
              setGraphData(antD)
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
          setGraphData(props.initData || {})
          changeStatus('data_init');
        }
      } catch (error) {
        changeStatus('app_error');
        console.error('Initialization error:', error);
      }
    };

    initializeApp();
  }, [props.token, props.url, props.gientechServer]);

  return (
    <div
      ref={canvasContainer}
      className={`flex flex-col justify-center items-center w-full h-full
      transition-colors duration-300 box-border bg-white text-black}`}
      onContextMenu={(e) => e.preventDefault()} // 禁止默认的鼠标右键操作
    >
      <GraphView ref={canvasContainer} {...props} />
    </div>
  );
};

export default AiGraph;
