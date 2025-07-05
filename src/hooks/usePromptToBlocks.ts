
import { useState, useCallback } from 'react';
import { Node, Edge } from '@xyflow/react';

interface BlockStructure {
  nodes: Node[];
  edges: Edge[];
}

export const usePromptToBlocks = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateFromPrompt = useCallback(async (prompt: string): Promise<BlockStructure> => {
    setIsGenerating(true);
    
    try {
      // Simulate API call to analyze prompt and generate structure
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simple prompt analysis for demo
      const structure = analyzePromptStructure(prompt);
      return structure;
      
    } catch (error) {
      console.error('Failed to generate blocks:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    isGenerating,
    generateFromPrompt
  };
};

function analyzePromptStructure(prompt: string): BlockStructure {
  const lowerPrompt = prompt.toLowerCase();
  let nodes: Node[] = [];
  let edges: Edge[] = [];
  
  // Always start with Start node
  nodes.push({
    id: 'start-1',
    type: 'start',
    position: { x: 50, y: 200 },
    data: { 
      label: 'Start',
      config: {
        initialInput: '{"message": "string", "user_id": "string"}',
        purpose: extractPurpose(prompt)
      }
    }
  });

  let currentX = 300;
  let nodeCounter = 1;

  // Detect if summarization is needed
  if (lowerPrompt.includes('summar')) {
    const summarizerNode: Node = {
      id: `agent-${nodeCounter++}`,
      type: 'agent',
      position: { x: currentX, y: 200 },
      data: {
        label: 'Summarizer',
        config: {
          role: 'Text Summarizer',
          systemPrompt: 'You are an expert at creating concise, accurate summaries of text content.',
          model: 'gpt-4',
          temperature: 0.3
        }
      }
    };
    nodes.push(summarizerNode);
    
    edges.push({
      id: `e-start-${summarizerNode.id}`,
      source: 'start-1',
      target: summarizerNode.id,
      type: 'smoothstep',
      style: { stroke: '#3498db', strokeWidth: 2 }
    });
    
    currentX += 300;
  }

  // Detect if translation is needed
  if (lowerPrompt.includes('translat')) {
    const translatorNode: Node = {
      id: `agent-${nodeCounter++}`,
      type: 'agent',
      position: { x: currentX, y: 200 },
      data: {
        label: 'Translator',
        config: {
          role: 'Language Translator',
          systemPrompt: 'You are a professional translator. Translate the given text accurately while maintaining context and tone.',
          model: 'gpt-4',
          temperature: 0.2
        }
      }
    };
    nodes.push(translatorNode);
    
    const prevNode = nodes[nodes.length - 2];
    edges.push({
      id: `e-${prevNode.id}-${translatorNode.id}`,
      source: prevNode.id,
      target: translatorNode.id,
      type: 'smoothstep',
      style: { stroke: '#3498db', strokeWidth: 2 }
    });
    
    currentX += 300;
  }

  // Add router for decision making
  const routerNode: Node = {
    id: 'router-1',
    type: 'router',
    position: { x: currentX, y: 200 },
    data: {
      label: 'Router',
      config: {
        conditions: [
          { id: 'success', label: 'Success', expression: 'result.success === true' },
          { id: 'failure', label: 'Failure', expression: 'result.success === false' }
        ]
      }
    }
  };
  nodes.push(routerNode);
  
  const prevNode = nodes[nodes.length - 2];
  edges.push({
    id: `e-${prevNode.id}-router-1`,
    source: prevNode.id,
    target: 'router-1',
    type: 'smoothstep',
    style: { stroke: '#e67e22', strokeWidth: 2 }
  });
  
  currentX += 300;

  // Add rule checker
  const ruleCheckerNode: Node = {
    id: 'ruleChecker-1',
    type: 'ruleChecker',
    position: { x: currentX, y: 150 },
    data: {
      label: 'Rule Checker',
      config: {
        rules: ['No personal information', 'No harmful content', 'Respect privacy'],
        hasViolations: false
      }
    }
  };
  nodes.push(ruleCheckerNode);
  
  edges.push({
    id: 'e-router-ruleChecker',
    source: 'router-1',
    sourceHandle: 'success',
    target: 'ruleChecker-1',
    type: 'smoothstep',
    style: { stroke: '#2ecc71', strokeWidth: 2 },
    label: 'Success'
  });
  
  currentX += 300;

  // Add end node
  const endNode: Node = {
    id: 'end-1',
    type: 'end',
    position: { x: currentX, y: 200 },
    data: {
      label: 'End',
      config: {
        outputFormat: 'json',
        includeMetadata: true
      }
    }
  };
  nodes.push(endNode);
  
  edges.push({
    id: 'e-ruleChecker-end',
    source: 'ruleChecker-1',
    target: 'end-1',
    type: 'smoothstep',
    style: { stroke: '#7f8c8d', strokeWidth: 2 }
  });

  // Add Slack notification if mentioned
  if (lowerPrompt.includes('slack')) {
    const slackNode: Node = {
      id: 'notifier-slack-1',
      type: 'notifier',
      position: { x: currentX + 100, y: 300 },
      data: {
        label: 'Slack Notifier',
        config: {
          type: 'slack',
          webhookUrl: '',
          channel: '#general',
          messageTemplate: 'Workflow completed: {{summary}}'
        }
      }
    };
    nodes.push(slackNode);
    
    edges.push({
      id: 'e-end-slack',
      source: 'end-1',
      target: 'notifier-slack-1',
      type: 'smoothstep',
      style: { stroke: '#9b59b6', strokeWidth: 2 }
    });
  }

  return { nodes, edges };
}

function extractPurpose(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('summar') && lowerPrompt.includes('translat')) {
    return 'Document Summarization and Translation';
  } else if (lowerPrompt.includes('summar')) {
    return 'Document Summarization';
  } else if (lowerPrompt.includes('translat')) {
    return 'Language Translation';
  } else if (lowerPrompt.includes('slack') || lowerPrompt.includes('notif')) {
    return 'Automated Notification System';
  }
  
  return 'AI Assistant Workflow';
}
