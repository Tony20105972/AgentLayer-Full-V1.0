
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const RouterNode = ({ data }: { data: any }) => {
  const conditions = data.config?.conditions || [
    { id: 'true', label: 'True', expression: 'true' },
    { id: 'false', label: 'False', expression: 'false' }
  ];

  return (
    <div className="relative flex items-center justify-center w-[200px] h-[80px]">
      {/* Perfect Diamond Shape */}
      <div className="relative w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 transform rotate-45 shadow-lg border-2 border-white rounded-lg flex items-center justify-center">
        <div className="transform -rotate-45 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <span className="text-lg">🔀</span>
            <span className="font-semibold text-xs text-white">{data.label || 'Router'}</span>
          </div>
          <div className="text-xs text-orange-100 font-medium">Decision</div>
        </div>
      </div>
      
      {/* Input Handle - Left */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-orange-500 rounded-full shadow-sm"
        style={{ left: '20px', top: '50%', transform: 'translateY(-50%)' }}
      />
      
      {/* Output Handles - Right side with better positioning */}
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="w-3 h-3 bg-green-400 border-2 border-green-600 rounded-full shadow-sm"
        style={{ right: '20px', top: '30%', transform: 'translateY(-50%)' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        className="w-3 h-3 bg-red-400 border-2 border-red-600 rounded-full shadow-sm"
        style={{ right: '20px', top: '70%', transform: 'translateY(-50%)' }}
      />
      
      {/* Condition Labels */}
      <div className="absolute right-[-45px] top-[15px] text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded shadow-sm border border-green-200">
        True
      </div>
      <div className="absolute right-[-45px] top-[45px] text-xs font-medium text-red-700 bg-red-50 px-2 py-1 rounded shadow-sm border border-red-200">
        False
      </div>
    </div>
  );
};

export default RouterNode;
