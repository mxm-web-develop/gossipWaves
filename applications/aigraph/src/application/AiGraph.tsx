import G6 from '@antv/g6';
import { useEffect, useState } from 'react';
import './style.css';
import LoadingGraph from './views/LoadingGraph';
import ErrorGraph from './views/ErrorGraph';
import GraphView from './views/GraphView';
import { useAppState, useServerState } from './store';
import { convertToG6Data } from './utils/convertData';

const AiGraph = (props: {
  children?: React.ReactNode
  className?: string
  treeData?: any
  graphId?: string
  token?: string
  url?: string
  data_type?: 'antv' | 'gitech'
  graph_type?: 'gitech_finance' | 'default'
}) => {
  const { mode, changeStatus, setRawData, status, setAppConfig } = useAppState();
  const { setUrl, setToken, testConnection, connectionStatus } = useServerState();

  useEffect(() => {
    // 根据传入的 token 和 url 设置 mode
    if (props.token && props.url) {
      setUrl(props.url);
      setToken(props.token);
      setAppConfig({
        mode: 'server',
        data_type: props.data_type || 'antv',
        graph_type: props.graph_type || 'default',
      });
      changeStatus('data_init');
    } else {
      setAppConfig({
        mode: 'local',
        data_type: props.data_type || 'antv',
        graph_type: props.graph_type || 'default',
      });
      changeStatus('data_init');
    }
  }, [props.token, props.url]);

  useEffect(() => {
    const initialize = async () => {
      if (mode === 'server') {
        await testConnection();

        if (connectionStatus === 'connected') {
          // 进行图谱数据拉取
          setTimeout(() => {
            const mockData = {
              edges: [
                {
                  elementId: "0000010000D000000000000600000200007000104E87BB8E",
                  type: "拥有",
                  fromId: "1",
                  toId: "2",
                  properties: {
                    src_id: "2199036887040",
                    cust_no: "1008249906",
                    acct_no: "0010033877433",
                    weight: 1,
                    dst_id: "1099518967824"
                  },
                  directed: true
                },
                {
                  elementId: "0000010000D000000000000600000200007000104E87BB8F",
                  type: "拥有",
                  fromId: "1",
                  toId: "3",
                  properties: {
                    src_id: "2199036887041",
                    cust_no: "1008249907",
                    acct_no: "0010033877434",
                    weight: 2,
                    dst_id: "1099518967825"
                  },
                  directed: true
                },
                {
                  elementId: "0000010000D000000000000600000200007000104E87BB8G",
                  type: "拥有",
                  fromId: "2",
                  toId: "4",
                  properties: {
                    src_id: "2199036887042",
                    cust_no: "1008249908",
                    acct_no: "0010033877435",
                    weight: 1,
                    dst_id: "1099518967826"
                  },
                  directed: true
                },
                // 继续添加更多边...
              ],
              nodes: [
                {
                  elementId: "1",
                  type: "客户",
                  properties: {
                    cert_type: "身份证",
                    cert_no: "354688197809119894",
                    cust_type: "P",
                    cust_no: "1008249906",
                    cust_name: "张三"
                  },
                  primaryKey: "1008249906"
                },
                {
                  elementId: "2",
                  type: "客户",
                  properties: {
                    cert_type: "身份证",
                    cert_no: "354688197809119895",
                    cust_type: "P",
                    cust_no: "1008249907",
                    cust_name: "李四"
                  },
                  primaryKey: "1008249907"
                },
                {
                  elementId: "3",
                  type: "客户",
                  properties: {
                    cert_type: "身份证",
                    cert_no: "354688197809119896",
                    cust_type: "P",
                    cust_no: "1008249908",
                    cust_name: "王五"
                  },
                  primaryKey: "1008249908"
                },
                {
                  elementId: "4",
                  type: "客户",
                  properties: {
                    cert_type: "身份证",
                    cert_no: "354688197809119897",
                    cust_type: "P",
                    cust_no: "1008249909",
                    cust_name: "赵六"
                  },
                  primaryKey: "1008249909"
                },
                // 继续添加更多节点...
              ]
            };
            setRawData(convertToG6Data(mockData));
            changeStatus('canvas_init');
          }, 300)
        } else {
          changeStatus('app_error'); // 处理连接错误
        }
      } else {
        console.log('zheli ', props.treeData)
        // 处理 local 模式的逻辑
        setRawData(props.treeData);
        // 这里可以设置本地数据
        changeStatus('canvas_init');
      }
    };
    initialize();
  }, [mode, props.treeData, connectionStatus]);

  return (
    <div
      className={`flex flex-col justify-center items-center w-full h-full
      transition-colors duration-300 box-border bg-white text-black}`}
      onContextMenu={(e) => e.preventDefault()} // 禁止默认的鼠标右键操作
    >
      {(status === 'app_init' || status === 'data_init') && <LoadingGraph />}
      {status === 'app_error' && <ErrorGraph message={'error'} />}
      {(status === 'canvas_init' || status === 'app_process' || status === 'app_wait') && <GraphView />}
    </div>
  );
};

export default AiGraph;