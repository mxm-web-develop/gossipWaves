import MxMweb from "./application/AiGraph";

function Preview() {
  console.log('当前版本:', import.meta.env.VITE_APP_VERSION);
  const g6Data = {
    nodes: [
      {
        id: "1", // 对应于 elementId
        label: "客户", // 对应于 type
        data: { "category": "A" },
        properties: {
          cert_type: "身份证",
          cert_no: "354688197809119894",
          cust_type: "P",
          cust_no: "1008249906",
          cust_name: "张三"
        },
        type: 'circle'
      },
      {
        id: "2",
        label: "客户",
        data: { "category": "A" },
        properties: {
          cert_type: "身份证",
          cert_no: "354688197809119895",
          cust_type: "P",
          cust_no: "1008249907",
          cust_name: "李四"
        },
        type: 'circle'
      },
      {
        id: "3",
        label: "客户",
        data: { "category": "A" },
        properties: {
          cert_type: "身份证",
          cert_no: "354688197809119896",
          cust_type: "P",
          cust_no: "1008249908",
          cust_name: "王五"
        },
        type: 'star'
      },
      {
        id: "4",
        label: "客户",
        data: { "category": "C" },
        properties: {
          cert_type: "身份证",
          cert_no: "354688197809119897",
          cust_type: "P",
          cust_no: "1008249909",
          cust_name: "赵六"
        },
        type: 'circle'
      }
    ],
    edges: [
      {
        id: "0000010000D000000000000600000200007000104E87BB8E", // 对应于 elementId
        source: "1", // 对应于 fromId
        target: "2", // 对应于 toId
        label: "拥有", // 对应于 type
        properties: {
          src_id: "2199036887040",
          cust_no: "1008249906",
          acct_no: "0010033877433",
          weight: 1,
          dst_id: "1099518967824"
        },
        directed: true // 保留 directed 属性
      },
      {
        id: "0000010000D000000000000600000200007000104E87BB8F",
        source: "1",
        target: "3",
        label: "拥有",

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
        id: "0000010000D000000000000600000200007000104E87BB8G",
        source: "2",
        target: "4",
        label: "拥有",
        properties: {
          src_id: "2199036887042",
          cust_no: "1008249908",
          acct_no: "0010033877435",
          weight: 1,
          dst_id: "1099518967826"
        },
        directed: true
      }
    ]
  };
  return (
    <div className="h-screen w-screen relative">
      <MxMweb treeData={g6Data} />
    </div>
  )
}


export default Preview
