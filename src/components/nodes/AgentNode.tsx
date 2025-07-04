
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const AgentNode = ({ data }: { data: any }) => {
  return (
    <div className="w-[200px] h-[80px] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-lg border-2 border-white flex items-center justify-between px-4 relative">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-xl">🤖</span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm truncate">{data.label || 'AI Agent'}</div>
          <div className="text-xs text-blue-100 truncate">
            {data.config?.model || 'GPT-4'} • {data.config?.role || 'Assistant'}
          </div>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 bg-white border-2 border-blue-500 rounded-full shadow-md"
      />
    </div>
  );
};

export default AgentNode;
