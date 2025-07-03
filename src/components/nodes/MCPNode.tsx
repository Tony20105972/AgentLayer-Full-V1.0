
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const MCPNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[140px]">
      <div className="flex items-center justify-center space-x-2 mb-1">
        <span className="text-lg">🧠</span>
        <span className="font-medium text-sm">{data.label || 'MCP Controller'}</span>
      </div>
      <div className="text-xs text-center text-purple-200">Main Control Plane</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-purple-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="error"
        className="w-3 h-3 bg-red-400 border-2 border-red-600"
      />
    </div>
  );
};

export default MCPNode;
