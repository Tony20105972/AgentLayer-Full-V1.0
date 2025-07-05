
import { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

interface ExecutionResult {
  uuid: string;
  violations: Array<{
    nodeId: string;
    ruleId: string;
    description: string;
    suggestion: string;
  }>;
  summary: string;
  totalScore: number;
  runTime: number;
  outputUrl?: string;
  timestamp: number;
}

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

  const executeWorkflow = useCallback(async (nodes: Node[], edges: Edge[]): Promise<ExecutionResult> => {
    setIsExecuting(true);
    setExecutionSteps([]);
    
    try {
      console.log('Starting workflow execution with nodes:', nodes.length, 'edges:', edges.length);
      
      // Simulate execution steps
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
        
        // Simulate random violations and errors
        const hasViolation = Math.random() > 0.85;
        const hasError = Math.random() > 0.95;
        
        const finalStatus = hasError ? 'error' : hasViolation ? 'violation' : 'success';
        
        setExecutionSteps(prev => 
          prev.map(s => 
            s.nodeId === nodeId && s.timestamp === step.timestamp 
              ? { ...s, status: finalStatus }
              : s
          )
        );
        
        if (hasError) break;
      }

      // Generate mock result
      const violations = executionSteps
        .filter(step => step.status === 'violation')
        .map(step => ({
          nodeId: step.nodeId,
          ruleId: `RULE_${Math.floor(Math.random() * 100)}`,
          description: `Constitutional violation detected in node ${step.nodeId}`,
          suggestion: 'Consider reviewing the prompt and ensuring compliance with ethical guidelines'
        }));

      const result: ExecutionResult = {
        uuid: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        violations,
        summary: `Workflow executed successfully with ${nodes.length} nodes. ${violations.length} violations detected.`,
        totalScore: Math.max(0, 100 - violations.length * 15 - Math.floor(Math.random() * 10)),
        runTime: 1200 + Math.floor(Math.random() * 2000),
        outputUrl: violations.length === 0 ? `https://example.com/reports/${Date.now()}.html` : undefined,
        timestamp: Date.now()
      };

      setLastResult(result);
      console.log('Workflow execution completed:', result);
      return result;

    } catch (error) {
      console.error('Execution failed:', error);
      throw error;
    } finally {
      setIsExecuting(false);
      setCurrentStep(null);
    }
  }, [executionSteps]);

  const replayExecution = useCallback(async (uuid: string) => {
    setIsReplaying(true);
    console.log('Starting replay for execution:', uuid);
    
    try {
      // Use stored execution steps for replay
      const replayData = executionSteps;
      
      for (const step of replayData) {
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
