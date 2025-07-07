
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface FlowViewerProps {
  flow: {
    nodes: Node[];
    edges: Edge[];
  };
}

const FlowViewer: React.FC<FlowViewerProps> = ({ flow }) => {
  return (
    <div className="h-64 w-full border rounded-lg overflow-hidden">
      <ReactFlow
        nodes={flow.nodes}
        edges={flow.edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        className="bg-gray-50"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
};

export default FlowViewer;
