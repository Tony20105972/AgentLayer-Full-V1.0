
import { useEffect } from 'react';
import { Node } from '@xyflow/react';

interface ExecutionStep {
  nodeId: string;
  timestamp: number;
  status: 'running' | 'success' | 'violation' | 'error';
  data?: any;
}

interface NodeHighlighterProps {
  nodes: Node[];
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void;
  currentStep: string | null;
  isReplaying: boolean;
  executionSteps: ExecutionStep[];
}

const NodeHighlighter: React.FC<NodeHighlighterProps> = ({
  nodes,
  setNodes,
  currentStep,
  isReplaying,
  executionSteps
}) => {
  // Highlight current executing/replaying node
  useEffect(() => {
    setNodes(nds => nds.map(node => ({
      ...node,
      style: {
        ...node.style,
        border: currentStep === node.id 
          ? (isReplaying ? '3px solid #f59e0b' : '3px solid #3b82f6')
          : undefined,
        boxShadow: currentStep === node.id 
          ? (isReplaying ? '0 0 20px rgba(245, 158, 11, 0.5)' : '0 0 20px rgba(59, 130, 246, 0.5)')
          : undefined
      }
    })));
  }, [currentStep, isReplaying, setNodes]);

  // Highlight nodes based on execution results
  useEffect(() => {
    setNodes(nds => nds.map(node => {
      const nodeStep = executionSteps.find(step => step.nodeId === node.id);
      
      if (nodeStep) {
        let borderColor = '#3b82f6';
        let shadowColor = 'rgba(59, 130, 246, 0.4)';
        
        if (nodeStep.status === 'success') {
          borderColor = '#10b981';
          shadowColor = 'rgba(16, 185, 129, 0.4)';
        } else if (nodeStep.status === 'error') {
          borderColor = '#ef4444';
          shadowColor = 'rgba(239, 68, 68, 0.4)';
        } else if (nodeStep.status === 'violation') {
          borderColor = '#f59e0b';
          shadowColor = 'rgba(245, 158, 11, 0.4)';
        }
        
        return {
          ...node,
          style: {
            ...node.style,
            border: currentStep === node.id ? node.style?.border : `2px solid ${borderColor}`,
            boxShadow: currentStep === node.id ? node.style?.boxShadow : `0 0 10px ${shadowColor}`
          }
        };
      }
      return node;
    }));
  }, [executionSteps, currentStep, setNodes]);

  return null;
};

export default NodeHighlighter;
