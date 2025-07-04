
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const RuleCheckerNode = ({ data }: { data: any }) => {
  const ruleCount = data.config?.rules?.length || 0;
  const hasViolations = data.config?.hasViolations || false;

  return (
    <div className={`px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[180px] relative ${
      hasViolations 
        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
    }`}>
      <div className="flex items-center justify-center space-x-2 mb-2">
        <span className="text-lg">🛡️</span>
        <span className="font-medium text-sm">{data.label || 'Rule Checker'}</span>
      </div>
      <div className="text-xs text-center mb-2">
        {ruleCount} Rules Active
      </div>
      {hasViolations && (
        <div className="text-xs text-center text-red-100">
          ⚠️ Violations Detected
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
    </div>
  );
};

export default RuleCheckerNode;
