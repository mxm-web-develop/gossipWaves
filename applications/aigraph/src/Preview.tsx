import AiGraph from './application/AiGraph';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJHSUVOLVJBRyIsImF1ZCI6IkpJQUJJTkJJTjAwIiwidXNlcklkIjoxMjQzLCJ1c2VyTmFtZSI6IkpJQUJJTkJJTjAwIiwic3ViIjoibWl4ZWRRdWFudHVtIiwiZXhwIjoxNzQwNjE5OTU2LCJpYXQiOjE3NDA1MzM1NTZ9.Z1dyPSj-iBbnPibn9Hel8Pyg9bYHwUuoRppedJfsg0g';

function Preview() {
  return (
    <div className="h-[100vh] w-full overflow-hidden">
      <div className="h-[calc(100%-50px)] relative">
        <AiGraph
          url={`api_proxy`}
          token={token}
          gientechServer={{
            url: `api_proxy`,
            token: token,
            spaceName: '图谱测试',
            fileName: '一个文件.doc',
            //fileId: 53591,
          }}
          initData={null}
          createBy={'admin'}
          graphModeType="allGraph"
          handleCallBack={(type: string, data?: any) => {
            console.log(type, 'sdgjaklsg');

            switch (type) {
              case 'back':
                break;
            }
          }}
        />
      </div>
    </div>
  );
}

export default Preview;

{
  /* <div>
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
      </div> */
}
