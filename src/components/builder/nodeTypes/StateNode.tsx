
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NodeData } from '@/types/flow';

const StateNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as NodeData;
  
  return (
    <Card className={`min-w-[200px] ${selected ? 'ring-2 ring-blue-500' : ''} ${nodeData.isExecuting ? 'ring-2 ring-green-500 animate-pulse' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-blue-500 text-white">STATE</Badge>
          <div className="text-2xl">🗂️</div>
        </div>
        <div className="font-semibold text-gray-900">{String(nodeData.label)}</div>
        <div className="text-xs text-gray-500 mt-1">Initial state configuration</div>
      </CardContent>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-blue-500"
      />
    </Card>
  );
};

export default StateNode;
