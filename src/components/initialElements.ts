
import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 50, y: 100 },
    data: { label: 'Workflow Start' }
  },
  {
    id: 'mcp-1',
    type: 'mcp',
    position: { x: 250, y: 100 },
    data: { 
      label: 'Main Controller',
      config: {
        maxRetries: 3,
        timeout: 30
      }
    }
  },
  {
    id: 'ai-1',
    type: 'aichat',
    position: { x: 450, y: 50 },
    data: { 
      label: 'AI Assistant',
      config: {
        model: 'gpt-4',
        prompt: 'You are a helpful AI assistant.'
      }
    }
  },
  {
    id: 'rag-1',
    type: 'rag',
    position: { x: 450, y: 150 },
    data: { 
      label: 'Knowledge Search',
      config: {
        vectorStore: 'pinecone',
        topK: 5
      }
    }
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 650, y: 100 },
    data: { label: 'Complete' }
  }
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'start-1',
    target: 'mcp-1',
    type: 'smoothstep'
  },
  {
    id: 'e2-3',
    source: 'mcp-1',
    target: 'ai-1',
    type: 'smoothstep'
  },
  {
    id: 'e2-4',
    source: 'mcp-1',
    target: 'rag-1',
    type: 'smoothstep'
  },
  {
    id: 'e3-5',
    source: 'ai-1',
    target: 'end-1',
    type: 'smoothstep'
  },
  {
    id: 'e4-5',
    source: 'rag-1',
    target: 'end-1',
    type: 'smoothstep'
  }
];
