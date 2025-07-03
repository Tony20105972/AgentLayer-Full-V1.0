
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const StartNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[120px]">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-lg">🎬</span>
        <span className="font-medium text-sm">{data.label || 'Start'}</span>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
    </div>
  );
};

export default StartNode;
