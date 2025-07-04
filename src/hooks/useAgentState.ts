
import { useState, useCallback } from 'react';
import { AgentState, MemoryChain } from '@/types/AgentState';

export const useAgentState = () => {
  const [memoryChain, setMemoryChain] = useState<MemoryChain>({
    sessionId: `session-${Date.now()}`,
    states: [],
    currentState: null,
    globalContext: {}
  });

  const [executionState, setExecutionState] = useState<{
    isExecuting: boolean;
    currentNodeId: string | null;
    executionPath: string[];
  }>({
    isExecuting: false,
    currentNodeId: null,
    executionPath: []
  });

  const addState = useCallback((state: AgentState) => {
    setMemoryChain(prev => ({
      ...prev,
      states: [...prev.states, state],
      currentState: state
    }));
  }, []);

  const updateGlobalContext = useCallback((updates: Record<string, any>) => {
    setMemoryChain(prev => ({
      ...prev,
      globalContext: { ...prev.globalContext, ...updates }
    }));
  }, []);

  const startExecution = useCallback((startNodeId: string) => {
    setExecutionState({
      isExecuting: true,
      currentNodeId: startNodeId,
      executionPath: [startNodeId]
    });
  }, []);

  const moveToNextNode = useCallback((nodeId: string) => {
    setExecutionState(prev => ({
      ...prev,
      currentNodeId: nodeId,
      executionPath: [...prev.executionPath, nodeId]
    }));
  }, []);

  const stopExecution = useCallback(() => {
    setExecutionState({
      isExecuting: false,
      currentNodeId: null,
      executionPath: []
    });
  }, []);

  return {
    memoryChain,
    executionState,
    addState,
    updateGlobalContext,
    startExecution,
    moveToNextNode,
    stopExecution
  };
};
