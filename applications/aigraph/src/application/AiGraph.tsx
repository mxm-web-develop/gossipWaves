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
    spacename:string;
    filedId?:string;
    limit?:number;
  }
}) => {
  const { setUrl, setToken, testConnection, connectionStatus } = useServerState();
  const { setAppConfig, changeStatus, status,mode,data_type,setGientechSet,gientechSet } = useAppState();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Set initial status
        changeStatus('app_init');

        // If token is provided, set up server mode
        if (props.url) {
          setUrl(props.url);
          setToken(props.token || "");
          const connectionResult = await testConnection();
          console.log(connectionResult, 'connectionResult');
          // Only proceed if connection is successful
          if (connectionResult === 'connected') {  // 直接使用测试结果而不是状态
            setAppConfig({
              mode: 'server',
              data_type: 'gitech',
              graph_type: 'gitech_finance'
            });
            setGientechSet({
              spacename: props.gientechSet?.spacename || '',
              filedId: props.gientechSet?.filedId || '',
              limit: props.gientechSet?.limit || 2000
            });
            changeStatus('data_init');
          } else {
            changeStatus('app_error');
            return;
          }
        } else {
          // Set local mode if no token
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
  }, [props.token, props.gientechSet]); 

   useEffect(()=>{      
      const fetchData = async () => {
        if(status === 'data_init'){
          console.log( '开始数据初始化',gientechSet);
          if(mode === 'server'&&gientechSet){
          const gdata =  await wholeGraphSearch(props.url, gientechSet.filedId, gientechSet.limit, props.username, props.token);
          console.log( '开始网络请求数据，转换数据，set数据',gdata);
        }else{
          console.log(   '开始本地数据初始化');
        }
      }
    } 
    fetchData();
   },[status,gientechSet])
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
