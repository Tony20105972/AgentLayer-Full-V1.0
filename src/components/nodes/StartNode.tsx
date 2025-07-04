
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const StartNode = ({ data }: { data: any }) => {
  return (
    <div className="w-[200px] h-[80px] bg-gradient-to-r from-emerald-400 to-teal-500 text-white rounded-lg shadow-lg border-2 border-white flex items-center justify-between px-4 relative">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-xl">🎬</span>
        </div>
        <div>
          <div className="font-semibold text-sm">{data.label || 'Start'}</div>
          <div className="text-xs text-emerald-100">Initialize Flow</div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 bg-white border-2 border-emerald-500 rounded-full shadow-md"
      />
    </div>
  );
};

export default StartNode;
