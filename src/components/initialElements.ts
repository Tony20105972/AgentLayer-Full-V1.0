
import { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: 'start-1',
    type: 'start',
    position: { x: 50, y: 100 },
    data: { label: 'Workflow Start' }
  },
  {
    id: 'control-1',
    type: 'control',
    position: { x: 200, y: 100 },
    data: { 
      label: 'Control Center',
      config: {
        priorityLevel: 'high'
      }
    }
  },
  {
    id: 'doc-1',
    type: 'documentUpload',
    position: { x: 50, y: 250 },
    data: { 
      label: 'Document Upload',
      config: {
        acceptedFormats: 'pdf,docx,txt',
        maxFileSize: 10
      }
    }
  },
  {
    id: 'embed-1',
    type: 'embedVector',
    position: { x: 250, y: 250 },
    data: { 
      label: 'Vector Embedding',
      config: {
        model: 'text-embedding-ada-002'
      }
    }
  },
  {
    id: 'query-1',
    type: 'queryContext',
    position: { x: 450, y: 250 },
    data: { 
      label: 'Context Query',
      config: {
        vectorStore: 'pinecone',
        topK: 5
      }
    }
  },
  {
    id: 'mcp-1',
    type: 'mcp',
    position: { x: 350, y: 100 },
    data: { 
      label: 'MCP Controller',
      config: {
        maxRetries: 3,
        timeout: 30
      }
    }
  },
  {
    id: 'ai-1',
    type: 'aichat',
    position: { x: 500, y: 50 },
    data: { 
      label: 'AI Assistant',
      config: {
        model: 'gpt-4',
        prompt: 'You are a helpful AI assistant with access to context.'
      }
    }
  },
  {
    id: 'slack-1',
    type: 'slack',
    position: { x: 650, y: 150 },
    data: { 
      label: 'Slack Alert',
      config: {
        slackChannel: '#ai-alerts',
        messageTemplate: 'Workflow completed: {{status}}'
      }
    }
  },
  {
    id: 'deploy-1',
    type: 'deploy',
    position: { x: 650, y: 250 },
    data: { 
      label: 'Auto Deploy',
      config: {
        deployTarget: 'vercel',
        buildCommand: 'npm run build'
      }
    }
  },
  {
    id: 'end-1',
    type: 'end',
    position: { x: 800, y: 150 },
    data: { label: 'Complete' }
  }
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'start-1',
    target: 'control-1',
    type: 'smoothstep'
  },
  {
    id: 'e2-3',
    source: 'control-1',
    target: 'mcp-1',
    type: 'smoothstep'
  },
  {
    id: 'e3-4',
    source: 'mcp-1',
    target: 'ai-1',
    type: 'smoothstep'
  },
  {
    id: 'e4-5',
    source: 'ai-1',
    target: 'slack-1',
    type: 'smoothstep'
  },
  {
    id: 'e5-6',
    source: 'slack-1',
    target: 'end-1',
    type: 'smoothstep'
  },
  {
    id: 'e-doc-1',
    source: 'doc-1',
    target: 'embed-1',
    type: 'smoothstep'
  },
  {
    id: 'e-embed-1',
    source: 'embed-1',
    target: 'query-1',
    type: 'smoothstep'
  },
  {
    id: 'e-query-1',
    source: 'query-1',
    target: 'ai-1',
    type: 'smoothstep'
  },
  {
    id: 'e-control-doc',
    source: 'control-1',
    target: 'doc-1',
    sourceHandle: 'control',
    type: 'smoothstep'
  },
  {
    id: 'e-deploy-1',
    source: 'mcp-1',
    target: 'deploy-1',
    type: 'smoothstep'
  }
];
