
import React from 'react';
import { Node } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ExecutionIndicatorProps {
  isExecuting: boolean;
  currentNodeId: string | null;
  nodes: Node[];
}

const ExecutionIndicator: React.FC<ExecutionIndicatorProps> = ({
  isExecuting,
  currentNodeId,
  nodes
}) => {
  if (!isExecuting && !currentNodeId) return null;

  const currentNode = nodes.find(n => n.id === currentNodeId);
  const hasViolations = nodes.some(n => n.data.hasViolation);

  return (
    <div className="h-16 bg-white border-t border-gray-200 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {isExecuting && (
          <>
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium">Executing Flow...</span>
            </div>
            {currentNode && (
              <Badge variant="outline" className="bg-blue-50">
                Current: {String(currentNode.data.label)}
              </Badge>
            )}
          </>
        )}
        
        {!isExecuting && hasViolations && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Rule violations detected</span>
          </div>
        )}
        
        {!isExecuting && !hasViolations && nodes.length > 0 && (
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
