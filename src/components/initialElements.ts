
import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 50, y: 100 },
    data: { 
      label: 'Start Node',
      config: {
        initialInput: '{"message": "string", "user_id": "string"}'
      }
    },
    deletable: false
  },
  {
    id: 'agent-1',
    type: 'agent',
    position: { x: 300, y: 100 },
    data: { 
      label: 'AI Agent',
      config: {
        role: 'Assistant',
        model: 'gpt-4',
        systemPrompt: 'You are a helpful AI assistant.',
        temperature: 0.7
      }
    },
    deletable: false
  },
  {
    id: 'router-1',
    type: 'router',
    position: { x: 550, y: 100 },
    data: { 
      label: 'Decision Router',
      config: {
        conditions: [
          { id: 'success', label: 'Success', expression: 'response.confidence > 0.8' },
          { id: 'review', label: 'Needs Review', expression: 'response.confidence <= 0.8' }
        ]
      }
    },
    deletable: false
  },
  {
    id: 'ruleChecker-1',
    type: 'ruleChecker',
    position: { x: 800, y: 100 },
    data: { 
      label: 'Rule Checker',
      config: {
        rules: ['pii-protection', 'harmful-content', 'data-privacy'],
        hasViolations: false
      }
    },
    deletable: false
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 1050, y: 100 },
    data: { 
      label: 'End Node',
      config: {}
    },
    deletable: false
  }
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'start-1',
    target: 'agent-1',
    type: 'smoothstep',
    deletable: false
  },
  {
    id: 'e2-3',
    source: 'agent-1',
    target: 'router-1',
    type: 'smoothstep',
    deletable: false
  },
  {
    id: 'e3-4',
    source: 'router-1',
    target: 'ruleChecker-1',
    sourceHandle: 'success',
    type: 'smoothstep',
    label: 'Success',
    deletable: false
  },
  {
    id: 'e4-5',
    source: 'ruleChecker-1',
    target: 'end-1',
    type: 'smoothstep',
    deletable: false
  }
];
