
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
        purpose: 'Workflow Entry Point'
      }
    },
  },
  {
    id: 'agent-1',
    type: 'agent',
    position: { x: 300, y: 200 },
    data: {
      label: 'AI Agent',
      config: {
        role: 'Assistant',
        systemPrompt: 'You are a helpful AI assistant.',
        model: 'gpt-4',
        temperature: 0.7
      }
    },
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 550, y: 200 },
    data: {
      label: 'End',
      config: {
        outputFormat: 'json',
        includeMetadata: true
      }
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e-start-agent',
    source: 'start-1',
    target: 'agent-1',
    type: 'smoothstep',
    style: { stroke: '#3498db', strokeWidth: 2 }
  },
  {
    id: 'e-agent-end',
    source: 'agent-1',
    target: 'end-1',
    type: 'smoothstep',
    style: { stroke: '#3498db', strokeWidth: 2 }
  },
];
