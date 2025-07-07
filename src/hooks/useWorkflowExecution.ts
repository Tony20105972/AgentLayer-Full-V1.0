
import { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';
import { apiService, ExecutionResult } from '@/services/api';

interface ExecutionStep {
  nodeId: string;
  timestamp: number;
  status: 'running' | 'success' | 'violation' | 'error';
  data?: any;
}

export const useWorkflowExecution = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [lastResult, setLastResult] = useState<ExecutionResult | null>(null);

  const executeWorkflow = useCallback(async (
    nodes: Node[], 
    edges: Edge[], 
    constitution: string = '', 
    apiKeys: Record<string, string> = {}
  ): Promise<ExecutionResult> => {
    setIsExecuting(true);
    setExecutionSteps([]);
    
    try {
      const workflowData = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          data: node.data,
          position: node.position
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle
        }))
      };

      console.log('Executing workflow with backend API...');

      // Simulate execution steps for UI
      const orderedNodes = getExecutionOrder(nodes, edges);
      
      for (const nodeId of orderedNodes) {
        setCurrentStep(nodeId);
        
        const step: ExecutionStep = {
          nodeId,
          timestamp: Date.now(),
          status: 'running'
        };
        
        setExecutionSteps(prev => [...prev, step]);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
        
        const finalStatus = Math.random() > 0.9 ? 'violation' : 'success';
        
        setExecutionSteps(prev => 
          prev.map(s => 
            s.nodeId === nodeId && s.timestamp === step.timestamp 
              ? { ...s, status: finalStatus }
              : s
          )
        );
      }

      // Call backend API
      const result = await apiService.executeAgent(workflowData, constitution, apiKeys);
      
      setLastResult(result);
      return result;

    } catch (error) {
      console.error('Execution failed:', error);
      throw error;
    } finally {
      setIsExecuting(false);
      setCurrentStep(null);
    }
  }, []);

  const replayExecution = useCallback(async (uuid: string) => {
    setIsReplaying(true);
    
    try {
      // Fetch execution details from backend
      const executionData = await apiService.getExecutionDetails(uuid);
      
      // Simulate replay for UI
      for (const step of executionSteps) {
        setCurrentStep(step.nodeId);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
    } catch (error) {
      console.error('Replay failed:', error);
    } finally {
      setIsReplaying(false);
      setCurrentStep(null);
    }
  }, [executionSteps]);

  return {
    isExecuting,
    isReplaying,
    currentStep,
    executionSteps,
    lastResult,
    executeWorkflow,
    replayExecution
  };
};

// Helper function to determine execution order
function getExecutionOrder(nodes: Node[], edges: Edge[]): string[] {
  const order: string[] = [];
  const visited = new Set<string>();
  
  const startNode = nodes.find(node => node.type === 'start');
  if (!startNode) return nodes.map(n => n.id);
  
  function traverse(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    order.push(nodeId);
    
    const outgoingEdges = edges.filter(edge => edge.source === nodeId);
    outgoingEdges.forEach(edge => traverse(edge.target));
  }
  
  traverse(startNode.id);
  
  // Add any remaining nodes
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      order.push(node.id);
    }
  });
  
  return order;
}
