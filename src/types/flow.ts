
export interface NodeConfig {
  prompt?: string;
  model?: string;
  initialState?: string;
  destination?: string;
  template?: string;
  url?: string;
  rules?: any[];
  conditions?: Array<{ name: string; expression: string }>;
  inputs?: string[];
  outputs?: string[];
}

export interface NodeData {
  label: string;
  config?: NodeConfig;
  isExecuting?: boolean;
  hasViolation?: boolean;
}

export interface FlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: NodeData;
}
