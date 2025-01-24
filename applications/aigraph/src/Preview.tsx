import { useRef } from 'react';
import { AI_GRAPH_TYPE, GraphRefType } from './application/views/GraphView';
import AiGraph from './application/AiGraph';
import { contextMenuType } from './application/graph/MyContextMenu';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJHSUVOLVJBRyIsImF1ZCI6ImFkbWluIiwidXNlcklkIjoxMDAwLCJ1c2VyTmFtZSI6ImFkbWluIiwic3ViIjoibWl4ZWRRdWFudHVtIiwiZXhwIjoxNzM3NzcxMDUyLCJpYXQiOjE3Mzc2ODQ2NTJ9.AAcesT5g7qJUJvYfoKWwOXzQqBhxmwsdX-BZQjAlHk0';
function Preview() {
  const graphRef = useRef<GraphRefType>(null);
  console.log('当前版本:', import.meta.env.VITE_APP_VERSION);

  const handleEvent = (type: string, data?: any) => {
    switch (type) {
      case contextMenuType['NODE:VIEW']:
        break;
      case AI_GRAPH_TYPE.SEARCH:
        break;
      case AI_GRAPH_TYPE.SAVE:
        break;
      case AI_GRAPH_TYPE.EXPORT:
        break;
      case AI_GRAPH_TYPE.BACK:
        break;
    }
  };
  return (
    <div className="h-[100vh] w-full overflow-hidden">
      <div className="h-[calc(100%-50px)]">
        <AiGraph 
        url={`api_proxy`}
        token={token}
        // username={'admin'}
        gientechServer={
          {
            url:`api_proxy`,
            token:token,
            spaceName:'demo_basketballplayer'
            // filedId:'123',
            // limit:100
          }
        }
        graphRef={graphRef} 
        handleEvent={handleEvent}
         initData={null}
          createBy={'admin'} />
      </div>
      {/* <div>
        <button
          onClick={() => {
            const add_items = graphRef.current?.add_items;
            if (!add_items) return;
            const i = new Date().getTime();
            const a = {
              nodes: [
                {
                  id: '123',
                  // type: '客户',
                  // properties: {
                  //   cert_type: '身份证',
                  //   cert_no: '354688197809119894',
                  //   cust_type: 'P',
                  //   cust_no: '1008249906',
                  //   cust_name: '张三',
                  // },
                  // primaryKey: '1008249906',
                  data: { name: '张三', category: '蔬菜' },
                },
                {
                  id: i + 1 + '',
                  // type: '客户',
                  // properties: {
                  //   cert_type: '身份证',
                  //   cert_no: '354688197809119894',
                  //   cust_type: 'P',
                  //   cust_no: '1008249906',
                  //   cust_name: '张三',
                  // },
                  // primaryKey: '1008249906',
                  data: { name: '李四', category: '主食' },
                },
              ],
              edges: [
                {
                  id: i + 2 + '',
                  source: '123',
                  target: i + 1 + '',
                  properties: {
                    src_id: '2199036887040',
                    cust_no: '1008249906',
                    acct_no: '0010033877433',
                    weight: 1,
                    dst_id: '1099518967824',
                  },
                  directed: true,
                  data: { name: '关系' },
                },
              ],
            };
            add_items(a);
          }}
        >
          添加数据
        </button>
        <button>删除数据</button>
        <button>清空画布数据</button>
        <button
          onClick={() => {
            const updateNodeById = graphRef.current?.updateNodeById;
            if (!updateNodeById) return;
            updateNodeById('123', { fill: 'red', size: 40 });
          }}
        >
          修改数据颜色
        </button>
      </div> */}
    </div>
  );
}

export default Preview;
