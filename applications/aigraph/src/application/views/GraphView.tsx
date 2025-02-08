/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, forwardRef } from 'react';
import { CircularLayout, ForceLayout, Graph, GraphData, GridLayout, register } from '@antv/g6';
import { useAppState } from '../store';
import MyContextMenu, { contextMenuType } from '../graph/MyContextMenu';
import * as Separator from '@radix-ui/react-separator';
import { DataID } from '@antv/g6/lib/types';
import { Button, ConfigProvider, Divider, Drawer, Select, Table, Tabs, TabsProps } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './style.css';
import {
  behaviorsConfig,
  edgeStyleConfig,
  layoutConfig,
  nodeStyleConfig,
  pluginsConfig,
} from '../graph/config';
import { message } from 'antd';
import CanvasController from './components/CanvasController';
import AppController from './components/AppController';
import LoadingGraph from './LoadingGraph';
import ErrorGraph from './ErrorGraph';
import { useCommonFn } from '../graph/common';
import addSearch from '../assets/img/addSearch.png';
const ZOOM = 0.1;

export type GraphRefType = {
  add_items: (data: GraphData) => void;
  delete_items: (ids: DataID) => void;
  clear_items: () => void;
  get_items: () => GraphData | any;
  updateNodeById: (id: string, style: any) => void;
};

export enum AI_GRAPH_TYPE {
  SEARCH = 'search',
  SAVE = 'save',
  EXPORT = 'export',
  BACK = 'back',
  CLEAR = 'clear',
  ADD_ITEMS = 'add_items',
  DELETE_ITEMS = 'delete_items',
  CLICK_NODE = 'click_node',
  CLICK_CANVAS = 'click_canvas',
  CLICK_EDGE = 'click_edge',
}
const registerLayouts = () => {
  // 注册力导向布局
  register('layout', 'force', ForceLayout);

  // 注册环形布局
  register('layout', 'circular', CircularLayout);

  // 注册网格布局
  register('layout', 'grid', GridLayout);
};
const GraphView = forwardRef(
  (
    props: {
      initData?: null | GraphData;
      handleEvent?: (type: string, data?: any) => any;
      createBy?: string;
    },
    ref: any
  ) => {
    const { createBy } = props;
    const { setGraph, graph, status, graphData, setGraphData, changeStatus, graph_type } =
      useAppState();
    const containerRef = useRef<HTMLDivElement>(null);
    const [targetInfo, setTargetInfo]: any = useState({});
    const isFullScreen = useRef(false);
    useEffect(() => {
      console.log('====================================');
      console.log('GraphViewaaa', status);
      console.log('====================================');
    }, [status]);
    const {
      handleContextMenuEvent,
      get_items,
      add_items,
      delete_items,
      clear_items,
      antSelect,
      updateNodeById,
    } = useCommonFn(graph);

    const [visible, setVisible] = useState(false);
    const [open, setOpen] = useState(false);
    const [curData, setCurData] = useState<any>(null);
    const [nodeSize, setNodeSize] = useState<any>(80);
    const [nodeColor, setNodeColor] = useState<any>('#529BF8');
    const [activeKey, setActiveKey] = useState('1');
    console.log('当前版本:', import.meta.env.VITE_APP_VERSION);
    const openDrawer = (data: any) => {
      setCurData(data);
      setVisible(false);
      setOpen(true);
      setActiveKey('1');
      if (data?.style?.size) {
        setNodeSize(data.style.size || 80);
      }
      if (data?.style?.fill) {
        setNodeColor(data.style.fill || '#529BF8');
      }
    };
    const closeDrawer = () => {
      setCurData(null);
      setOpen(false);
    };
    const handleEvent = (type: string, data?: any) => {
      console.log(type, data, '8888888888888888');
      switch (type) {
        case AI_GRAPH_TYPE.CLICK_NODE:
          openDrawer(data);
          break;
        case AI_GRAPH_TYPE.CLICK_CANVAS:
          closeDrawer();
          break;
        case AI_GRAPH_TYPE.CLICK_EDGE:
          closeDrawer();
          break;
        case contextMenuType['NODE:VIEW']:
          break;
        case AI_GRAPH_TYPE.SEARCH:
          setVisible(true);
          break;
        case AI_GRAPH_TYPE.SAVE:
          break;
        case AI_GRAPH_TYPE.EXPORT:
          break;
        case AI_GRAPH_TYPE.BACK:
          break;
      }
    };
    const items: TabsProps['items'] = [
      {
        key: '1',
        label: '详情',
      },
      {
        key: '2',
        label: '显示配置',
      },
    ];

    const columns: any[] = [
      {
        title: '属性名',
        dataIndex: 'key',
        key: 'key',
        render: (text: string) => {
          return (
            <div className="text-ellipsis text-[14px] text-text-color1 font-normal">{text}</div>
          );
        },
      },
      {
        title: '值',
        dataIndex: 'value',
        key: 'value',
        render: (text: string) => {
          return (
            <div className="text-ellipsis text-[14px] text-text-color1 font-normal">{text}</div>
          );
        },
      },
    ];

    const handleGraphEvent = (type: string, data?: any) => {
      if (!graph) return message.warning('graph未初始化');
      switch (type) {
        case 'fullScreen':
          const fullscreen: any = graph.getPluginInstance('fullscreen');
          if (isFullScreen.current === true) {
            fullscreen.exit();
          } else {
            fullscreen.request();
          }
          break;
        case 'scaleUp':
          graph.zoomBy(1 + ZOOM);
          break;
        case 'scaleDown':
          graph.zoomBy(1 - ZOOM);
          break;
        case 'refresh':
          graph.zoomTo(1);
          break;
        default:
          handleEvent(type, data);
          break;
      }
    };

    useEffect(() => {
      if (status === 'app_init') return;
      console.log('初始化检查:', {
        status,
        containerRef: !!containerRef.current,
        ref: !!ref.current,
      });

      // 确保两个 ref 都存在
      if (!containerRef.current || !ref.current) {
        console.log('等待 DOM 元素准备就绪...');
        return;
      }
      const container = containerRef.current;
      const width = ref.current.clientWidth;
      const height = ref.current.clientHeight;
      console.log('width', width, 'height', height, container);
      if (width <= 0 || height <= 0) {
        console.warn('Container has no dimensions:', width, height);
        return;
      }

      const newGraph = new Graph({
        container,
        background: '#FAFBFD',
        width,
        height,
        autoFit: {
          type: 'center',
          animation: true,
        },
        node: nodeStyleConfig.default,
        edge: edgeStyleConfig.default,
        layout: layoutConfig.default,
        behaviors: behaviorsConfig.default,
        plugins: pluginsConfig({
          getContextMenu: (a: any, b: any) => {
            const { targetType } = a;
            console.log(a, b, 'getContent', targetType);
            setTargetInfo(a);
            return document.getElementById('context-menu');
          },
          contextMenuClick: (v: any, t: any, c: any) => {
            console.log(v, t, c);
          },
          onScreenEnter: () => {
            isFullScreen.current = true;
          },
          onScreenExit: () => {
            isFullScreen.current = false;
          },
        }).default,
      });

      setGraph(newGraph);

      // 在这里直接添加数据
      if (graphData) {
        try {
          newGraph.setData(graphData);
          newGraph.render();
          changeStatus('app_wait');
        } catch (error) {
          console.error('初始数据添加失败:', error);
          changeStatus('app_error');
        }
      }

      return () => {
        if (newGraph && !newGraph.destroyed) {
          newGraph.destroy();
        }
      };
    }, [containerRef.current, graphData]);

    // 注册事件监听
    useEffect(() => {
      if (!graph) return;
      console.log('注册事件监听', graph);
    }, [graph]);

    return (
      <div ref={ref} style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div
          ref={containerRef}
          id="graph-container"
          style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}
        >
          {status === 'app_init' || status === 'data_init' ? (
            <LoadingGraph />
          ) : status === 'app_error' ? (
            <ErrorGraph message="图谱初始化失败" />
          ) : (
            status === 'app_wait' && (
              <>
                <AppController handleEvent={handleGraphEvent} />
                <CanvasController handleEvent={handleGraphEvent} />
                <MyContextMenu
                  targetInfo={targetInfo}
                  handleContextMenuEvent={handleContextMenuEvent}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '16px',
                    columnGap: '8px',
                    zIndex: 100,
                    display: 'flex',
                    justifyContent: 'start',
                    alignItems: 'center',
                    fontSize: '0.875rem',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      columnGap: '5px',
                    }}
                  >
                    <span style={{ color: '#888888' }}>节点数:</span>
                    <span style={{ color: '#555555' }}>{graphData?.nodes?.length}</span>
                  </div>
                  <Separator.Root
                    style={{ backgroundColor: '#EEEEEE', height: '20px', width: '1px' }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      columnGap: '5px',
                    }}
                  >
                    <span style={{ color: '#888888' }}>关系数:</span>
                    <span style={{ color: '#555555' }}>{graphData?.edges?.length}</span>
                  </div>
                  {createBy && (
                    <>
                      <Separator.Root
                        style={{ backgroundColor: '#EEEEEE', height: '20px', width: '1px' }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          columnGap: '5px',
                        }}
                      >
                        <span style={{ color: '#888888' }}>创建人:</span>
                        <span style={{ color: '#555555' }}>{createBy}</span>
                      </div>
                    </>
                  )}
                </div>
              </>
            )
          )}
        </div>

        <ItemSearch visible={visible} setVisible={setVisible} />
        <ConfigProvider
          drawer={{
            styles: {
              mask: {
                backgroundColor: 'transparent',
              },
              content: {
                backgroundColor: 'white',
              },
              body: { backgroundColor: 'white' },
            },
          }}
        >
          <Drawer
            title="Basic Drawer"
            open={open}
            getContainer={false}
            width={320}
            onClose={closeDrawer}
            styles={{
              header: { display: 'none' },
              mask: {
                backgroundColor: 'transparent',
              },
              content: {
                backgroundColor: 'white',
              },
              body: { backgroundColor: 'white', padding: 0 },
            }}
          >
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
              {/* <div style={{ display: 'flex', height: '57px' }}>
                <div
                  style={{ height: '57px', width: '16px', borderBottom: '1px solid #f0f0f0' }}
                ></div>
                <Tabs
                  style={{ flex: 1 }}
                  defaultActiveKey="1"
                  items={items}
                  activeKey={activeKey}
                  onChange={(v) => {
                    setActiveKey(v);
                  }}
                />
                <div
                  style={{
                    height: '57px',
                    paddingRight: '16px',
                    paddingTop: '20px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <CloseOutlined
                    width={16}
                    height={16}
                    style={{ color: '#555555' }}
                    onClick={() => closeDrawer()}
                  />
                </div>
              </div> */}
              {/* <div
                style={{
                  padding: '16px',
                  paddingTop: '16px',
                  color: '#1a1a1a',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  height: '100%',
                  overflow: 'hidden',
                  display: activeKey === '1' ? 'block' : 'none',
                }}
              >
                <div>{curData?.data?.name}</div>
                <div style={{ display: 'flex', marginTop: '12px', alignItems: 'center' }}>
                  <div style={{ maxWidth: '132px', display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '32px',
                        color: '#888888',
                        fontSize: '14px',
                        fontWeight: 'normal',
                        marginRight: '8px',
                        flexShrink: 0,
                      }}
                    >
                      类别:
                    </div>
                    <div
                      style={{
                        color: '#1a1a1a',
                        fontSize: '14px',
                        fontWeight: 'normal',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {curData?.data?.category}
                    </div>
                  </div>
                  <Divider type="vertical" style={{ borderColor: '#EEEEEE' }} />
                  <div style={{ maxWidth: '132px', display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        color: '#888888',
                        fontSize: '14px',
                        fontWeight: 'normal',
                        marginRight: '8px',
                      }}
                    >
                      id:
                    </div>
                    <div
                      style={{
                        color: '#1a1a1a',
                        fontSize: '14px',
                        fontWeight: 'normal',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {curData?.id}
                    </div>
                  </div>
                </div>
                <Divider style={{ borderColor: '#EEEEEE', margin: '12px 0' }} />
                <div
                  style={{ overflowY: 'auto', overflowX: 'hidden', height: 'calc(100% - 170px)' }}
                >
                  <Table columns={columns} dataSource={curData?.properties} pagination={false} />
                </div>
              </div> */}
              <div
                style={{
                  padding: '16px',
                  paddingTop: '16px',
                  color: '#1a1a1a',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  height: '100%',
                  overflow: 'hidden',
                  display: activeKey === '2' ? 'block' : 'none',
                }}
              >
                <div style={{ height: 'calc(100% - 122px)', overflowY: 'auto' }}>
                  <div>点</div>
                  <Select
                    prefix="大小"
                    defaultValue={80}
                    style={{ width: 288, marginTop: 12 }}
                    onChange={(v) => {
                      setNodeSize(v);
                    }}
                    value={nodeSize}
                    options={[
                      { value: 32, label: '32' },
                      { value: 40, label: '40' },
                      { value: 48, label: '48' },
                      { value: 56, label: '56' },
                      { value: 64, label: '64' },
                      { value: 80, label: '80' },
                    ]}
                  />
                  <Select
                    prefix="颜色"
                    defaultValue="#529BF8"
                    style={{ width: 288, marginTop: 12, borderRadius: 2 }}
                    labelRender={(props: any) => {
                      return (
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '2px',
                            backgroundColor: props.value || '#529BF8',
                          }}
                        ></div>
                      );
                    }}
                    onChange={(v) => {
                      setNodeColor(v);
                    }}
                    value={nodeColor}
                    options={[
                      { value: '#887AF2', label: '#887AF2' },
                      { value: '#529BF8', label: '#529BF8' },
                      { value: '#52D4F8', label: '#52D4F8' },
                      { value: '#4CEDCA', label: '#4CEDCA' },
                      { value: '#80E35D', label: '#80E35D' },
                      { value: '#F8B852', label: '#F8B852' },
                      { value: '#F87E52', label: '#F87E52' },
                      { value: '#F85D52', label: '#F85D52' },
                    ]}
                  />
                </div>
                <div
                  style={{
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <Button
                    type="primary"
                    onClick={() => {
                      closeDrawer();
                    }}
                    style={{
                      color: '#555555',
                      backgroundColor: '#fff',
                      borderRadius: '4px',
                      border: '1px solid #dedede',
                    }}
                  >
                    取消
                  </Button>
                  <Button
                    ghost
                    style={{
                      background: 'linear-gradient(#2867FF, #8789FF)',
                      border: 'none',
                      borderRadius: '4px',
                      marginLeft: '10px',
                    }}
                    onClick={() => {
                      if (!updateNodeById || !curData?.id) return;
                      updateNodeById(curData.id, {
                        fill: nodeColor,
                        size: nodeSize,
                      });
                      closeDrawer();
                    }}
                  >
                    确认
                  </Button>
                </div>
              </div>
            </div>
          </Drawer>
        </ConfigProvider>
      </div>
    );
  }
);

export default GraphView;
const ItemSearch = ({ visible, setVisible }: any) => {
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '点查询',
    },
    {
      key: '2',
      label: '线查询',
    },
    {
      key: '3',
      label: '语句查询',
    },
  ];

  return (
    <div
      style={{
        zIndex: 50,
        width: '403px',
        height: 'calc(100% - 82px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        top: '60px',
        right: '15px',
        backgroundColor: 'white',
        borderRadius: '8px',
        display: visible ? 'block' : 'none',
      }}
    >
      <div style={{ display: 'flex', height: '57px' }}>
        <div style={{ height: '57px', width: '20px', borderBottom: '1px solid #f0f0f0' }}></div>
        <Tabs
          style={{ flex: 1 }}
          size="large"
          defaultActiveKey="1"
          items={items}
          onChange={() => {}}
        />
        <div
          style={{
            height: '57px',
            paddingRight: '20px',
            paddingTop: '20px',
            cursor: 'pointer',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <CloseOutlined
            width={16}
            height={16}
            style={{ color: '#555555' }}
            onClick={() => setVisible(false)}
          />
        </div>
      </div>
      <div style={{ height: 'calc(100% - 121px)' }}>
        <Select
          style={{ marginTop: '20px', marginLeft: '20px', marginRight: '20px', width: '363px' }}
          placeholder="请选择类型"
          options={[]}
        />
        <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}
          >
            <div style={{ fontSize: '14px', color: '#2A2A2A' }}>查询条件</div>
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <img src={addSearch} width={14} height={14} style={{ marginRight: '4px' }} />
              <div style={{ color: '#305EBA' }}>添加查询条件</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ height: '64px', border: '1px solid #f0f0f0' }}></div>
    </div>
  );
};
