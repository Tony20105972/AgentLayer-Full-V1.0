
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const ConditionNode = ({ data }: { data: any }) => {
  const conditions = data.config?.conditions || [
    { id: 'true', label: 'Success', expression: 'state.status == "OK"' },
    { id: 'false', label: 'Failure', expression: 'state.status == "ERROR"' },
    { id: 'error', label: 'Error', expression: 'state.error != null' }
  ];

  return (
    <div className="relative">
      {/* Diamond shape container */}
      <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-4 transform rotate-45 shadow-lg border-2 border-white min-w-[100px] min-h-[100px] flex items-center justify-center">
        <div className="transform -rotate-45 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <span className="text-lg">🔀</span>
            <span className="font-medium text-xs">{data.label || 'Condition'}</span>
          </div>
          <div className="text-xs text-yellow-100">Decision Point</div>
        </div>
      </div>
      
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-yellow-500 absolute left-0 top-1/2 transform -translate-y-1/2"
      />
      
      {/* Output handles with condition labels */}
      {conditions.map((condition: any, index: number) => {
        const angle = (index * 120) - 30; // Distribute around the diamond
        const radians = (angle * Math.PI) / 180;
        const radius = 60;
        const x = Math.cos(radians) * radius;
        const y = Math.sin(radians) * radius;
        
        return (
          <div key={condition.id} className="absolute" style={{ 
            left: `calc(50% + ${x}px)`, 
            top: `calc(50% + ${y}px)`,
            transform: 'translate(-50%, -50%)'
          }}>
            <Handle
              type="source"
              position={Position.Right}
              id={condition.id}
              className={`w-3 h-3 border-2 ${
                condition.id === 'true' ? 'bg-green-400 border-green-600' : 
                condition.id === 'false' ? 'bg-red-400 border-red-600' : 
                'bg-orange-400 border-orange-600'
              }`}
            />
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow whitespace-nowrap">
              {condition.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConditionNode;
