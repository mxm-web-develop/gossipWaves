/* eslint-disable react-hooks/exhaustive-deps */
import { GraphData } from '@antv/g6';
import './style.css';
import GraphView from './views/GraphView';
import { useAppState, useServerState } from './store';
import { useEffect, useRef } from 'react';
import { wholeGraphSearch } from './services';
import { transformGientechToG6 } from './utils/convertData';
import {
  getEdgeInfo,
  getNodeInfo,
  getWholeGraphStatistics,
} from './services/apis/whole_graph_search';

const AiGraph = (props: {
  handleCallBack?: (type: string, data?: any) => any;
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
    fileId?: number;
    limit?: number;
    fileName: string;
  };
}) => {
  const { token, url, gientechServer, graphModeType } = props;
  const { setUrl, setToken } = useServerState();
  const {
    setAppConfig,
    changeStatus,
    status,
    mode,
    setGraphData,
    setGientechSet,
    setNodeInfo,
    setEdgeInfo,
  } = useAppState();
  const canvasContainer = useRef(null);
  const getNodeInfoFn = async (
    url: string,
    token: undefined | string,
    gientechServer: any,
    graphModeType: string
  ) => {
    try {
      const p: any = { spaceName: gientechServer.spaceName };
      if (graphModeType === 'subGraph' && gientechServer.fileId) {
        p.fileId = gientechServer.fileId;
      }
      const res: any = await getNodeInfo(
        {
          baseURL: url,
          token: token || '',
        },
        p
      );
      setNodeInfo(res);
      console.log('====================================');
      console.log('sdglasjgdslajdg', res);
      console.log('====================================');
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  };
  const getEdgeInfoFn = async (
    url: string,
    token: undefined | string,
    gientechServer: any,
    graphModeType: string
  ) => {
    try {
      const p: any = { spaceName: gientechServer.spaceName };
      if (graphModeType === 'subGraph' && gientechServer.fileId) {
        p.fileId = gientechServer.fileId;
      }
      const res: any = await getEdgeInfo(
        {
          baseURL: url,
          token: token || '',
        },
        p
      );
      setEdgeInfo(res);
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  };
  const getWholeGraphStatisticsFn = async (
    url: string,
    token: undefined | string,
    gientechServer: any,
    graphModeType: string
  ) => {
    try {
      if (!url) return;
      const p: any = { spaceName: gientechServer.spaceName };
      if (graphModeType === 'subGraph' && gientechServer.fileId) {
        p.fileId = gientechServer.fileId;
      }
      const gdata: any = await getWholeGraphStatistics(
        {
          baseURL: url,
          token: token || '',
        },
        p
      );
      console.log('====================================');
      console.log('getWholeGraphStatisticsFn', gdata);
      console.log('====================================');
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  };
  const initializeApp = async (
    url: undefined | string,
    token: undefined | string,
    gientechServer: any
  ) => {
    try {
      if (url) {
        setUrl(url);
        setToken(token || '');
        changeStatus('data_init');
        setAppConfig({
          mode: 'server',
          data_type: 'gitech',
          graph_type: 'gitech_finance',
        });
        getNodeInfoFn(url, token, gientechServer, graphModeType);
        getEdgeInfoFn(url, token, gientechServer, graphModeType);
        //getWholeGraphStatisticsFn(url, token, gientechServer, graphModeType);
        if (graphModeType === 'subGraph') {
          if (gientechServer) {
            const gientechConfig = {
              spaceName: gientechServer.spaceName,
              fileId: gientechServer.fileId,
              limit: gientechServer.limit || 2000,
            };
            setGientechSet({ ...gientechConfig, fileName: gientechServer.fileName });
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
          changeStatus('app_wait');
          setAppConfig({
            mode: 'local',
            data_type: 'antv',
            graph_type: 'default',
          });
          setGraphData(props.initData || {});
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
  useEffect(() => {
    initializeApp(url, token, gientechServer);
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
