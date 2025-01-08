export function convertToG6Data(data) {
  const { nodes, edges } = data;
  return {
    nodes: nodes.map(node => ({
      id: node.elementId,
      label: node.type,
      properties: node.properties,
    })),
    edges: edges.map((edge, index) => ({
      id: edge.elementId,
      source: edge.fromId,
      target: edge.toId,
      label: edge.type,
      properties: edge.properties,
      directed: edge.directed,
    })),
  };
}