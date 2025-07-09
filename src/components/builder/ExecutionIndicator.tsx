
import React from 'react';
import { Node } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react';

interface ExecutionIndicatorProps {
  isExecuting: boolean;
  isReplaying: boolean;
  currentNodeId: string | null;
  nodes: Node[];
}

const ExecutionIndicator: React.FC<ExecutionIndicatorProps> = ({
  isExecuting,
  isReplaying,
  currentNodeId,
  nodes
}) => {
  if (!isExecuting && !isReplaying && !currentNodeId) return null;

  const currentNode = nodes.find(n => n.id === currentNodeId);
  const hasViolations = nodes.some(n => n.data.hasViolation);

  return (
    <div className="h-16 bg-white border-t border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {isReplaying && (
          <>
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium">Replaying Flow...</span>
            </div>
          </>
        )}
        
        {isExecuting && !isReplaying && (
          <>
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-green-600" />
              <span className="text-sm font-medium">Executing Flow...</span>
            </div>
            {currentNode && (
              <Badge variant="outline" className="bg-green-50">
                Current: {String(currentNode.data.label)}
              </Badge>
            )}
          </>
        )}
        
        {!isExecuting && !isReplaying && hasViolations && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Constitution violations detected</span>
          </div>
        )}
        
        {!isExecuting && !isReplaying && !hasViolations && nodes.length > 0 && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Flow completed successfully</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionIndicator;
