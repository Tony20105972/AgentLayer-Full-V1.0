
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const ControlNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[160px]">
      <div className="flex items-center justify-center space-x-2 mb-1">
        <span className="text-lg">🎯</span>
        <span className="font-medium text-sm">{data.label || 'Control Center'}</span>
      </div>
      <div className="text-xs text-center text-indigo-200">Main Control Plane</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-indigo-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="control"
        className="w-3 h-3 bg-yellow-400 border-2 border-yellow-600"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="monitor"
        className="w-3 h-3 bg-green-400 border-2 border-green-600"
      />
    </div>
  );
};

export default ControlNode;
