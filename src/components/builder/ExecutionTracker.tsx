
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Node } from '@xyflow/react';

interface ExecutionTrackerProps {
  currentNodeId: string | null;
  nodes: Node[];
}

const ExecutionTracker: React.FC<ExecutionTrackerProps> = ({
  currentNodeId,
  nodes
}) => {
  const currentNodeIndex = nodes.findIndex(n => n.id === currentNodeId);
  const progress = nodes.length > 0 ? ((currentNodeIndex + 1) / nodes.length) * 100 : 0;
  const currentNode = nodes.find(n => n.id === currentNodeId);

  return (
    <Card className="mx-4 mb-4 p-4 bg-blue-50 border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="font-medium text-blue-900">
            Executing: {String(currentNode?.data?.label || 'Unknown Node')}
          </span>
          <Badge variant="secondary">{currentNode?.type}</Badge>
        </div>
        <span className="text-sm text-blue-700">
          {currentNodeIndex + 1} of {nodes.length}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </Card>
  );
};

export default ExecutionTracker;
