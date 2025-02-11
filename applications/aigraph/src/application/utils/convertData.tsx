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
    ...item,
    id: item.vid,
    data: { name: item.properties?.name || item.nodeType, category: item.nodeType },
    properties: Object.entries(item.properties).map((prop: any) => {
      return {
        key: prop[0],
        value: prop[1],
      };
    }),
  }));

  // 转换边
  g6Data.edges = (data.edgeList || []).map((item) => {
    return {
      ...item,
      id: item.id,
      data: {
        name: item.properties?.name || item.edgeType,
        category: item.edgeType,
      },
      source: item.src.vid,
      target: item.dst.vid,
      src: item.src,
      dst: item.dst,
    };
  });

  return g6Data;
}

export const convertEdgeToNode = (edges: any[]) => {
  const ns: any = [];
  const es: any = [];
  edges.forEach((i) => {
    es.push({
      id: i.id,
      data: {
        name: i.properties?.name || i.edgeType,
        category: i.edgeType,
      },
      source: i.src.vid,
      target: i.dst.vid,
      src: i.src,
      dst: i.dst,
      properties: i.properties,
    });
    ns.push(
      ...[
        {
          ...i.src,
          id: i.src.vid,
          data: { name: i.src.properties?.name || '', category: i.src.nodeType },
          properties: Object.entries(i.src.properties).map((prop: any) => {
            return {
              key: prop[0],
              value: prop[1],
            };
          }),
        },
        {
          ...i.dst,
          id: i.dst.vid,
          data: { name: i.dst.properties?.name || '', category: i.dst.nodeType },
          properties: Object.entries(i.dst.properties).map((prop: any) => {
            return {
              key: prop[0],
              value: prop[1],
            };
          }),
        },
      ]
    );
  });
  return {
    nodes: ns,
    edges: es,
  };
};

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
