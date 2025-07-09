
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NodeData } from '@/types/flow';

const LLMNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as NodeData;
  const isExecuting = nodeData.isExecuting;
  
  return (
    <Card className={`min-w-[220px] transition-all duration-200 ${
      selected ? 'ring-2 ring-purple-500' : ''
    } ${
      isExecuting ? 'ring-2 ring-blue-500 animate-pulse bg-blue-50' : 'bg-white'
    }`}>
      <CardContent className="p-4">
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-purple-500 border-2 border-white"
        />
        
        <div className="flex items-center justify-between mb-3">
          <Badge className="bg-purple-500 text-white">LLM</Badge>
          <div className="text-2xl">🧠</div>
        </div>
        
        <div className="font-semibold text-gray-900 mb-1">{String(nodeData.label)}</div>
        <div className="text-xs text-gray-500 mb-2">
          Model: {nodeData.config?.model || 'gpt-4'}
        </div>
        <div className="text-xs text-gray-400">
          Temp: {nodeData.config?.temperature || 0.7}
        </div>
        
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-purple-500 border-2 border-white"
        />
      </CardContent>
    </Card>
  );
};

export default LLMNode;
