
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const APINode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[120px]">
      <div className="flex items-center justify-center space-x-2 mb-1">
        <span className="text-lg">🌐</span>
        <span className="font-medium text-sm">{data.label || 'API Call'}</span>
      </div>
      <div className="text-xs text-center text-orange-200">
        {data.config?.method || 'GET'} Request
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-orange-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-orange-500"
      />
    </div>
  );
};

export default APINode;
