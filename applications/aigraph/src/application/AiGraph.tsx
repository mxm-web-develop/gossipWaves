/* eslint-disable react-hooks/exhaustive-deps */
import { GraphData } from '@antv/g6';
import './style.css';
import GraphView from './views/GraphView';
import { useAppState, useServerState } from './store';
import { useEffect, useRef } from 'react';
import { wholeGraphSearch } from './services';
import { transformGientechToG6 } from './utils/convertData';

const AiGraph = (props: {
  graphModeType: 'allGraph' | 'subGraph';
  handleEvent?: (type: string, data?: any) => any;
  initData?: null | GraphData;
  createBy?: string;
  token?: string;
  url?: string;
  username?: string;
  gientechServer?: {
    url: string;
    token?: string;
    spaceName: string;
    filedId?: string;
    limit?: number;
  };
}) => {
  const { token, url, gientechServer, graphModeType } = props;
  const { setUrl, setToken, testConnection } = useServerState();
  const { setAppConfig, changeStatus, status, mode, setGraphData, setGientechSet } = useAppState();
  const canvasContainer = useRef(null);
  useEffect(() => {
    const initializeApp = async () => {
      try {
        if (url) {
          setUrl(url);
          setToken(token || '');
          const connectionResult = await testConnection();

          if (connectionResult === 'connected') {
            changeStatus('data_init');
            setAppConfig({
              mode: 'server',
              data_type: 'gitech',
              graph_type: 'gitech_finance',
            });
            console.log(props.gientechServer, 'gientechSet');

            if (props.gientechServer) {
              const gientechConfig = {
                spaceName: props.gientechServer.spaceName,
                filedId: props.gientechServer.filedId,
                limit: props.gientechServer.limit || 2000,
              };
              setGientechSet(gientechConfig);
              const gdata: any = await wholeGraphSearch(
                {
                  baseURL: url,
                  token: token || '',
                },
                gientechConfig
              );
              const antD = transformGientechToG6(gdata as any);
              console.log('开始网络请求数据，转换数据，set数据', gdata, antD);
              setGraphData(antD);
            }
          } else {
            return;
          }
        } else {
          setAppConfig({
            mode: 'local',
            data_type: 'antv',
            graph_type: 'default',
          });
          setGraphData(props.initData || {});
        }
      } catch (error) {
        changeStatus('app_error');
        console.error('Initialization error:', error);
      }
    };
    if (graphModeType === 'allGraph') {
      initializeApp();
    } else {
      changeStatus('app_wait');
      setAppConfig({
        mode: 'local',
        data_type: 'antv',
        graph_type: 'default',
      });
      setGraphData(props.initData || {});
    }
  }, [token, url, gientechServer, graphModeType]);

  return (
    <div
      ref={canvasContainer}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        transition: 'background-color 0.3s, color 0.3s',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        color: 'black',
      }}
      onContextMenu={(e) => e.preventDefault()} // 禁止默认的鼠标右键操作
    >
      <GraphView ref={canvasContainer} {...props} />
    </div>
  );
};

export default AiGraph;
