
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NodeData } from '@/types/flow';

const RouterNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as NodeData;
  
  return (
    <Card className={`min-w-[200px] ${selected ? 'ring-2 ring-blue-500' : ''} ${nodeData.isExecuting ? 'ring-2 ring-green-500 animate-pulse' : ''}`}>
      <CardContent className="p-4">
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-orange-500"
        />
        
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-orange-500 text-white">ROUTER</Badge>
          <div className="text-2xl">🔀</div>
        </div>
        
        <div className="font-semibold text-gray-900">{String(nodeData.label)}</div>
        <div className="text-xs text-gray-500 mt-1">Conditional branching</div>
        
        <Handle
          type="source"
          position={Position.Right}
          id="true"
          style={{ top: '60%' }}
          className="w-3 h-3 bg-orange-500"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="false"
          style={{ top: '80%' }}
          className="w-3 h-3 bg-orange-500"
        />
      </CardContent>
    </Card>
  );
};

export default RouterNode;
