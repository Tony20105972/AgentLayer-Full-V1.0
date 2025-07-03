
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const ConditionNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[120px]">
      <div className="flex items-center justify-center space-x-2 mb-1">
        <span className="text-lg">🔀</span>
        <span className="font-medium text-sm">{data.label || 'Condition'}</span>
      </div>
      <div className="text-xs text-center text-yellow-200">If/Then Logic</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-yellow-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 bg-green-400 border-2 border-green-600"
        style={{ top: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 bg-red-400 border-2 border-red-600"
        style={{ top: '70%' }}
      />
    </div>
  );
};

export default ConditionNode;
