import React, { CSSProperties, useCallback } from 'react';

import ReactFlow, {
  addEdge,
  Node,
  EdgeTypes,
  Connection,
  Edge,
  useNodesState,
  useEdgesState,
  NodeTypes,
  DefaultEdgeOptions,
  MarkerType,
} from 'reactflow';

import CustomNode from './CustomNode';
import FloatingEdge from './FloatingEdge';
import FloatingConnectionLine from './FloatingConnectionLine';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Drag to Connect' },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'custom',
    data: { label: 'Drag to Connect' },
    position: { x: 250, y: 320 },
  },
  {
    id: '3',
    type: 'custom',
    data: { label: 'Drag to Connect' },
    position: { x: 40, y: 300 },
  },
  {
    id: '4',
    type: 'custom',
    data: { label: 'Drag to Connect' },
    position: { x: 300, y: 0 },
  },
];

const initialEdges: Edge[] = [];

const connectionLineStyle: CSSProperties = {
  strokeWidth: 3,
  stroke: 'black',
};

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  style: { strokeWidth: 3, stroke: 'black' },
  type: 'floating',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: 'black',
  },
};

const NodeTypeChangeFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineComponent={FloatingConnectionLine}
      connectionLineStyle={connectionLineStyle}
    />
  );
};

export default NodeTypeChangeFlow;
