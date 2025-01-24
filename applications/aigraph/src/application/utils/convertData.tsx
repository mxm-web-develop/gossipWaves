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

export function transformGientechToG6(data: { nodeList: any[], edgeList: any[] }): G6Data {
  const g6Data: G6Data = {
    nodes: [],
    edges: []
  };

  // 转换节点
  g6Data.nodes = data.nodeList.map(node => ({
    id: node.vid,
    label: node.properties.name || node.vid,
    ...node,
    type: node.nodeType,
  }));

  // 转换边
  g6Data.edges = data.edgeList.map(edge => ({
    id: edge.id,
    source: edge.src.vid,
    target: edge.dst.vid,
    label: edge.edgeType,
    ...edge,
  }));

  return g6Data;
}