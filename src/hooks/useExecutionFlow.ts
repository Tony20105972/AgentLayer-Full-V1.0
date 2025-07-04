
import { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

export interface ExecutionStep {
  id: string;
  nodeId: string;
  timestamp: number;
  status: 'pending' | 'running' | 'success' | 'failure' | 'violation';
  input: Record<string, any>;
  output: Record<string, any>;
  duration: number;
  errors?: string[];
  violations?: string[];
}

export const useExecutionFlow = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [executionPath, setExecutionPath] = useState<string[]>([]);

  const startExecution = useCallback(async (nodes: Node[], edges: Edge[]) => {
    setIsExecuting(true);
    setExecutionSteps([]);
    setExecutionPath([]);
    
    const startNode = nodes.find(node => node.type === 'start');
    if (!startNode) return;

    const path = buildExecutionPath(nodes, edges, startNode.id);
    setExecutionPath(path);

    // Simulate execution
    for (const nodeId of path) {
      setCurrentNodeId(nodeId);
      
      const step: ExecutionStep = {
        id: `step-${Date.now()}-${nodeId}`,
        nodeId,
        timestamp: Date.now(),
        status: 'running',
        input: { message: `Input for ${nodeId}` },
        output: {},
        duration: 0
      };

      setExecutionSteps(prev => [...prev, step]);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simulate success/failure
      const success = Math.random() > 0.1; // 90% success rate
      const hasViolation = Math.random() > 0.8; // 20% violation rate
      
      const finalStep: ExecutionStep = {
        ...step,
        status: hasViolation ? 'violation' : (success ? 'success' : 'failure'),
        output: { result: `Output from ${nodeId}`, success },
        duration: Math.random() * 2000,
        errors: success ? undefined : ['Simulated execution error'],
        violations: hasViolation ? ['Constitution rule violation detected'] : undefined
      };

      setExecutionSteps(prev => prev.map(s => s.id === step.id ? finalStep : s));
      
      if (!success) break; // Stop on failure
    }

    setCurrentNodeId(null);
    setIsExecuting(false);
  }, []);

  const stopExecution = useCallback(() => {
    setIsExecuting(false);
    setCurrentNodeId(null);
  }, []);

  const clearExecution = useCallback(() => {
    setExecutionSteps([]);
    setExecutionPath([]);
    setCurrentNodeId(null);
  }, []);

  return {
    isExecuting,
    currentNodeId,
    executionSteps,
    executionPath,
    startExecution,
    stopExecution,
    clearExecution
  };
};

// Helper function to build execution path
function buildExecutionPath(nodes: Node[], edges: Edge[], startNodeId: string): string[] {
  const path: string[] = [];
  const visited = new Set<string>();
  
  function traverse(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    path.push(nodeId);
    
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    for (const edge of outgoingEdges) {
      traverse(edge.target);
    }
  }
  
  traverse(startNodeId);
  return path;
}
