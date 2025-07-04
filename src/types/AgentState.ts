
export interface AgentState {
  id: string;
  timestamp: number;
  nodeId: string;
  input: Record<string, any>;
  output: Record<string, any>;
  metadata: {
    executionTime: number;
    constitutionViolations: string[];
    nodeType: string;
  };
}

export interface MemoryChain {
  sessionId: string;
  states: AgentState[];
  currentState: AgentState | null;
  globalContext: Record<string, any>;
}

export interface ConstitutionRule {
  id: string;
  name: string;
  condition: string;
  action: 'warn' | 'block' | 'log';
  description: string;
  enabled: boolean;
}

export interface RouterCondition {
  id: string;
  expression: string;
  label: string;
  targetHandle: string;
}
