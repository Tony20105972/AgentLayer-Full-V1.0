
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, RotateCcw } from 'lucide-react';
import { NodeData } from '@/types/flow';

const AINode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as NodeData;
  
  return (
    <Card className={`min-w-[200px] ${selected ? 'ring-2 ring-blue-500' : ''} ${nodeData.isExecuting ? 'ring-2 ring-green-500 animate-pulse' : ''}`}>
      <CardContent className="p-4">
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-green-500"
        />
        
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-green-500 text-white">AI NODE</Badge>
          <div className="text-2xl">🤖</div>
        </div>
        
        <div className="font-semibold text-gray-900 mb-1">{String(nodeData.label)}</div>
        <div className="text-xs text-gray-500 mb-3">
          Model: {nodeData.config?.model || 'gpt-4'}
        </div>
        
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Settings className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
        
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-green-500"
        />
      </CardContent>
    </Card>
  );
};

export default AINode;
