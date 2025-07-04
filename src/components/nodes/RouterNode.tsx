
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const RouterNode = ({ data }: { data: any }) => {
  const conditions = data.config?.conditions || [
    { id: 'true', label: 'True', expression: 'true' },
    { id: 'false', label: 'False', expression: 'false' }
  ];

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[140px] relative transform rotate-45">
      <div className="transform -rotate-45">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <span className="text-lg">🔀</span>
          <span className="font-medium text-sm">{data.label || 'Router'}</span>
        </div>
        <div className="text-xs text-center text-yellow-200">Conditional Branch</div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-yellow-500 transform -rotate-45"
        style={{ left: '-6px', top: '50%' }}
      />
      
      {conditions.map((condition: any, index: number) => (
        <Handle
          key={condition.id}
          type="source"
          position={Position.Right}
          id={condition.id}
          className={`w-3 h-3 border-2 transform -rotate-45 ${
            condition.id === 'true' ? 'bg-green-400 border-green-600' : 'bg-red-400 border-red-600'
          }`}
          style={{ 
            right: '-6px', 
            top: `${30 + (index * 40)}%`,
            transform: 'rotate(-45deg)'
          }}
        />
      ))}
    </div>
  );
};

export default RouterNode;
