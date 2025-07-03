
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const EmbedVectorNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[140px]">
      <div className="flex items-center justify-center space-x-2 mb-1">
        <span className="text-lg">🔢</span>
        <span className="font-medium text-sm">{data.label || 'Vector Embed'}</span>
      </div>
      <div className="text-xs text-center text-violet-200">Text Vectorization</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-violet-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-violet-500"
      />
    </div>
  );
};

export default EmbedVectorNode;
