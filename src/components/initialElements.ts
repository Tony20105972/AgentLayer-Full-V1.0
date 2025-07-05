
import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 50, y: 200 },
    data: { 
      label: 'Start',
      config: {
        initialInput: '{"message": "string", "user_id": "string"}',
        apiKey: '',
        purpose: 'AI Assistant'
      }
    },
    deletable: false,
    draggable: true
  },
  {
    id: 'agent-1',
    type: 'agent',
    position: { x: 350, y: 200 },
    data: { 
      label: 'AI Agent',
      config: {
        role: 'Assistant',
        model: 'gpt-4',
        systemPrompt: 'You are a helpful AI assistant.',
        temperature: 0.7,
        toolsEnabled: false
      }
    },
    deletable: false,
    draggable: true
  },
  {
    id: 'router-1',
    type: 'router',
    position: { x: 650, y: 200 },
    data: { 
      label: 'Router',
      config: {
        conditions: [
          { id: 'true', label: 'Success', expression: 'result.success === true' },
          { id: 'false', label: 'Failure', expression: 'result.success === false' }
        ]
      }
    },
    deletable: false,
    draggable: true
  },
  {
    id: 'ruleChecker-1',
    type: 'ruleChecker',
    position: { x: 950, y: 150 },
    data: { 
      label: 'Rule Checker',
      config: {
        rules: ['No personal information', 'No harmful content'],
        hasViolations: false
      }
    },
    deletable: false,
    draggable: true
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 1250, y: 200 },
    data: { 
      label: 'End',
      config: {
        outputFormat: 'json',
        includeMetadata: true
      }
    },
    deletable: false,
    draggable: true
  }
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'start-1',
    target: 'agent-1',
    type: 'smoothstep',
    style: { stroke: '#3498db', strokeWidth: 2 },
    deletable: false
  },
  {
    id: 'e2-3',
    source: 'agent-1',
    target: 'router-1',
    type: 'smoothstep',
    style: { stroke: '#e67e22', strokeWidth: 2 },
    deletable: false
  },
  {
    id: 'e3-4',
    source: 'router-1',
    sourceHandle: 'true',
    target: 'ruleChecker-1',
    type: 'smoothstep',
    style: { stroke: '#2ecc71', strokeWidth: 2 },
    label: 'Success',
    deletable: false
  },
  {
    id: 'e4-5',
    source: 'ruleChecker-1',
    target: 'end-1',
    type: 'smoothstep',
    style: { stroke: '#7f8c8d', strokeWidth: 2 },
    deletable: false
  }
];
