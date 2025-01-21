const style = { size: 80, fill: '#ccc' };

export const mockData = {
  edges: [
    {
      id: '0000010000D000000000000600000200007000104E87BB8E',
      type: '拥有',
      source: '1',
      target: '2',
      properties: {
        src_id: '2199036887040',
        cust_no: '1008249906',
        acct_no: '0010033877433',
        weight: 1,
        dst_id: '1099518967824',
      },
      directed: true,
    },
    {
      id: '0000010000D000000000000600000200007000104E87BB8F',
      type: '拥有',
      source: '1',
      target: '3',
      properties: {
        src_id: '2199036887041',
        cust_no: '1008249907',
        acct_no: '0010033877434',
        weight: 2,
        dst_id: '1099518967825',
      },
      directed: true,
    },
    {
      id: '0000010000D000000000000600000200007000104E87BB8G',
      type: '拥有',
      source: '2',
      target: '4',
      properties: {
        src_id: '2199036887042',
        cust_no: '1008249908',
        acct_no: '0010033877435',
        weight: 1,
        dst_id: '1099518967826',
      },
      directed: true,
    },
    // 继续添加更多边...
  ],
  nodes: [
    {
      id: '1',
      // type: '客户',
      // properties: {
      //   cert_type: '身份证',
      //   cert_no: '354688197809119894',
      //   cust_type: 'P',
      //   cust_no: '1008249906',
      //   cust_name: '张三',
      // },
      // primaryKey: '1008249906',
      data: { name: '张三' },
    },
    {
      id: '2',
      // type: '客户',
      properties: {
        cert_type: '身份证',
        cert_no: '354688197809119895',
        cust_type: 'P',
        cust_no: '1008249907',
        cust_name: '李四',
      },
      primaryKey: '1008249907',
      data: { name: '赵四' },
    },
    {
      id: '3',
      // type: '客户',
      properties: {
        cert_type: '身份证',
        cert_no: '354688197809119896',
        cust_type: 'P',
        cust_no: '1008249908',
        cust_name: '王五',
      },
      primaryKey: '1008249908',
    },
    {
      id: '4',
      // type: '客户',
      properties: {
        cert_type: '身份证',
        cert_no: '354688197809119897',
        cust_type: 'P',
        cust_no: '1008249909',
        cust_name: '赵六',
      },
      primaryKey: '1008249909',
    },
    // 继续添加更多节点...
  ],
};

export const mockData2 = {
  nodes: [
    {
      id: '5',
      // type: '客户',
      // properties: {
      //   cert_type: '身份证',
      //   cert_no: '354688197809119894',
      //   cust_type: 'P',
      //   cust_no: '1008249906',
      //   cust_name: '张三',
      // },
      // primaryKey: '1008249906',
      data: { name: '张三' },
    },
  ],
};
