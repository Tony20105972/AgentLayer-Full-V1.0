
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const EndNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[120px]">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">🏁</span>
        <span className="font-medium text-sm">{data.label || 'End'}</span>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-gray-500"
      />
    </div>
  );
};

export default EndNode;
