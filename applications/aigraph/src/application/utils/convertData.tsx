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
    vid: item.vid,
    id: item.vid,
    nodeType: item.nodeType,
    data: {
      name: item.properties?.name || item.nodeType,
      category: item.properties?.type || item.nodeType,
    },
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
      id: item.id,
      vid: item.vid,
      edgeType: item.edgeType,
      data: {
        name: item.properties?.name || item.edgeType,
        category: item.properties?.type || item.edgeType,
      },
      source: item.src?.vid,
      target: item.dst?.vid,
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
      vid: i.vid,
      id: i.id,
      data: {
        name: i.properties?.name || i.edgeType,
        category: i.properties?.type || i.edgeType,
      },
      source: i.src?.vid,
      target: i.dst?.vid,
      src: i.src,
      dst: i.dst,
      properties: i.properties,
    });
    ns.push(
      ...[
        {
          ...i.src,
          vid: i.vid,
          id: i.src?.vid,
          data: {
            name: i.src?.properties?.name || '',
            category: i.src?.properties?.type || i.src?.nodeType,
          },
          properties: Object.entries(i.src?.properties).map((prop: any) => {
            return {
              key: prop[0],
              value: prop[1],
            };
          }),
        },
        {
          ...i.dst,
          vid: i.vid,
          id: i.dst?.vid,
          data: {
            name: i.dst?.properties?.name || '',
            category: i.dst?.properties?.type || i.dst?.nodeType,
          },
          properties: Object.entries(i.dst?.properties).map((prop: any) => {
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
