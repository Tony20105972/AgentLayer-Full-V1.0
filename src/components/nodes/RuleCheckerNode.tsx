
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const RuleCheckerNode = ({ data }: { data: any }) => {
  const ruleCount = data.config?.rules?.length || 0;
  const hasViolations = data.config?.hasViolations || false;

  return (
    <div className={`w-[200px] h-[80px] rounded-lg shadow-lg border-2 border-white flex items-center justify-between px-4 relative ${
      hasViolations 
        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
        : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
    }`}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-xl">🛡️</span>
        </div>
        <div>
          <div className="font-semibold text-sm">{data.label || 'Rule Checker'}</div>
          <div className={`text-xs ${hasViolations ? 'text-red-100' : 'text-green-100'}`}>
            {ruleCount} Rules • {hasViolations ? '⚠️ Violations' : '✓ Clean'}
          </div>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-white border-2 border-green-500 rounded-full shadow-md"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 bg-white border-2 border-green-500 rounded-full shadow-md"
      />
    </div>
  );
};

export default RuleCheckerNode;
