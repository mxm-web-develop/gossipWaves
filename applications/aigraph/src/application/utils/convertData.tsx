interface GientechNode {
  hit: boolean;
  nodeType: string;
  properties: {
    name?: string;
    id?: string;
    age?: number;
    [key: string]: any;
  };
  vid: string;
}

interface GientechEdge {
  dst: {
    vid: string;
    nodeType: string;
    hit: boolean;
  };
  edgeType: string;
  id: string;
  properties: {
    start_year?: number;
    end_year?: number;
    rank?: number;
    [key: string]: any;
  };
  src: {
    hit: boolean;
    nodeType: string;
    properties: {
      [key: string]: any;
    };
    vid: string;
  };
}

interface G6Data {
  nodes: {
    id: string;
    label?: string;
    type?: string;
    style?: any;
    properties?: any;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
    label?: string;
    type?: string;
    style?: any;
    properties?: any;
  }[];
}

export function transformGientechToG6(data: { nodeList: any[]; edgeList: any[] }): G6Data {
  const g6Data: G6Data = {
    nodes: [],
    edges: [],
  };

  // 转换节点
  g6Data.nodes = (data.nodeList || []).map((item) => ({
    id: item.vid,
    data: { name: item.properties?.name || '', category: item.nodeType },
    properties: Object.entries(item.properties).map((prop: any) => {
      return {
        key: prop[0],
        value: prop[1],
      };
    }),
  }));

  // 转换边
  g6Data.edges = (data.edgeList || []).map((item) => {
    console.log('====================================');
    console.log('item.src.vid', item.id, item.src);
    console.log('====================================');
    return {
      id: item.id,
      data: {
        name: item.properties?.name || item.edgeType,
        category: item.edgeType,
      },
      source: item.src.vid,
      target: item.dst.vid,
    };
  });

  return g6Data;
}

export const convertNodeList = (data: any) => {
  return data.map((item: any) => {
    return {
      id: item.vid,
      data: { name: item.properties?.name || '', category: item.nodeType },
      properties: Object.entries(item.properties).map((prop: any) => {
        return {
          key: prop[0],
          value: prop[1],
        };
      }), //把数组对象的key和value转换成对象
    };
  });
};
export const convertEdgeList = (data: any) => {
  return data.map((item: any) => {
    return {
      id: item.id,
      data: {
        name: item.properties?.name || item.edgeType,
        category: item.edgeType,
      },
      source: item.src.vid,
      target: item.dst.vid,
    };
  });
};
