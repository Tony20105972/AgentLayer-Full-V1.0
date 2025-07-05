
import React, { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ConnectionMode,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './nodes';

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onDrop: (event: React.DragEvent) => void;
  onDragOver: (event: React.DragEvent) => void;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onDrop,
  onDragOver
}) => {
  const onConnect = useCallback(
    (params: Connection) => {
      const targetNode = nodes.find(n => n.id === params.target);
      const sourceNode = nodes.find(n => n.id === params.source);
      
      if (targetNode?.type === 'notifier') {
        const validSources = ['end', 'router'];
        if (sourceNode && validSources.includes(sourceNode.type)) {
          const edge = addEdge({
            ...params,
            type: 'smoothstep',
            style: { stroke: '#9b59b6', strokeWidth: 2 },
            label: params.sourceHandle && params.sourceHandle !== 'default' ? params.sourceHandle : undefined
          }, edges);
          return edge;
        }
      } else {
        const edge = addEdge({
          ...params,
          type: 'smoothstep',
          style: { stroke: '#3498db', strokeWidth: 2 },
          label: params.sourceHandle && params.sourceHandle !== 'default' ? params.sourceHandle : undefined
        }, edges);
        return edge;
      }
      return edges;
    },
    [edges, nodes]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      nodeTypes={nodeTypes}
      connectionMode={ConnectionMode.Loose}
      fitView
      className="bg-gradient-to-br from-slate-50 to-blue-50"
      snapToGrid={true}
      snapGrid={[20, 20]}
    >
      <Background 
        variant={BackgroundVariant.Dots}
        gap={20} 
        size={1} 
        color="#e2e8f0"
      />
      <Controls 
        className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-lg shadow-lg"
      />
      <MiniMap 
        nodeStrokeColor="#374151"
        nodeColor={(node) => {
          switch (node.type) {
            case 'start': return '#10b981';
            case 'agent': return '#3b82f6';
            case 'router': return '#f59e0b';
            case 'ruleChecker': return '#10b981';
            case 'end': return '#6b7280';
            case 'notifier': return '#8b5cf6';
            default: return '#f9fafb';
          }
        }}
        nodeBorderRadius={8}
        pannable
        zoomable
        className="bg-white/90 backdrop-blur-sm border border-gray-200/50 rounded-lg shadow-lg"
      />
    </ReactFlow>
  );
};

export default WorkflowCanvas;
