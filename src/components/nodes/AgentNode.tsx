
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const AgentNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[180px] relative">
      <div className="flex items-center justify-center space-x-2 mb-2">
        <span className="text-lg">🤖</span>
        <span className="font-medium text-sm">{data.label || 'AI Agent'}</span>
      </div>
      <div className="text-xs text-center text-blue-100 mb-2">
        {data.config?.model || 'GPT-4'}
      </div>
      {data.config?.role && (
        <div className="text-xs text-center text-purple-200 truncate">
          Role: {data.config.role}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-blue-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-blue-500"
      />
    </div>
  );
};

export default AgentNode;
