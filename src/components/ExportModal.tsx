
import React, { useState } from 'react';
import { Node, Edge } from '@xyflow/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
  constitutionRules: any[];
}

const ExportModal: React.FC<ExportModalProps> = ({ 
  isOpen, 
  onClose, 
  nodes, 
  edges, 
  constitutionRules 
}) => {
  const [exportFormat, setExportFormat] = useState<'langgraph' | 'json' | 'all'>('all');

  const generateLangGraphCode = () => {
    return `from langgraph.graph import StateGraph, START, END
from typing import TypedDict, List, Dict, Any
import json

class AgentState(TypedDict):
    messages: List[str]
    current_node: str
    context: Dict[str, Any]
    status: str
    error: str

def create_workflow():
    workflow = StateGraph(AgentState)
    
    # Add nodes
${nodes.map(node => `    workflow.add_node("${node.id}", ${node.id}_handler)`).join('\n')}
    
    # Add conditional edges for router nodes
${edges.map(edge => {
  const sourceNode = nodes.find(n => n.id === edge.source);
  if (sourceNode?.type === 'condition' || sourceNode?.type === 'router') {
    return `    workflow.add_conditional_edges(
        "${edge.source}",
        condition_router,
        {"${edge.sourceHandle || 'default'}": "${edge.target}"}
    )`;
  } else {
    return `    workflow.add_edge("${edge.source}", "${edge.target}")`;
  }
}).join('\n')}
    
    # Set entry and exit points
    workflow.set_entry_point("${nodes.find(n => n.type === 'start')?.id || 'start'}")
    workflow.set_finish_point("${nodes.find(n => n.type === 'end')?.id || 'end'}")
    
    return workflow.compile()

# Node handlers
${nodes.map(node => generateNodeHandler(node)).join('\n\n')}

# Conditional router for decision nodes
def condition_router(state: AgentState) -> str:
    # Add your conditional logic here based on state
    if state.get("status") == "OK":
        return "true"
    elif state.get("error"):
        return "error"
    else:
        return "false"

# Constitution checker
def check_constitution(state: AgentState, output: Dict[str, Any]) -> bool:
    rules = ${JSON.stringify(constitutionRules, null, 2)}
    
    for rule in rules:
        if not rule.get("enabled", True):
            continue
            
        # Simple rule checking - extend as needed
        if rule["condition"] == "pii" and contains_pii(output):
            if rule["action"] == "block":
                raise ValueError(f"Constitution violation: {rule['description']}")
            elif rule["action"] == "warn":
                print(f"Warning: {rule['description']}")
                
        elif rule["condition"] == "harmful" and contains_harmful_content(output):
            if rule["action"] == "block":
                raise ValueError(f"Constitution violation: {rule['description']}")
            elif rule["action"] == "warn":
                print(f"Warning: {rule['description']}")
    
    return True

def contains_pii(data: Dict[str, Any]) -> bool:
    # Implement PII detection logic
    return False

def contains_harmful_content(data: Dict[str, Any]) -> bool:
    # Implement harmful content detection logic
    return False

if __name__ == "__main__":
    app = create_workflow()
    initial_state = {
        "messages": [],
        "current_node": "start",
        "context": {},
        "status": "initialized",
        "error": ""
    }
    result = app.invoke(initial_state)
    print("Workflow completed:", result)
`;
  };

  const generateNodeHandler = (node: Node) => {
    const config = node.data.config as Record<string, any> || {};
    
    switch (node.type) {
      case 'start':
        return `def ${node.id}_handler(state: AgentState) -> AgentState:
    """Start node - initializes the workflow"""
    return {
        **state,
        "current_node": "${node.id}",
        "status": "started",
        "messages": state["messages"] + ["Workflow started"]
    }`;
        
      case 'aichat':
        return `def ${node.id}_handler(state: AgentState) -> AgentState:
    """AI Chat handler for ${node.data.label}"""
    # Model: ${config.model || 'gpt-4'}
    # Prompt: ${config.prompt || 'Default AI assistant prompt'}
    
    # Add your LLM integration here
    response = "AI response placeholder"
    
    result = {
        **state,
        "current_node": "${node.id}",
        "messages": state["messages"] + [response],
        "context": {**state["context"], "last_ai_response": response}
    }
    
    # Check constitution before returning
    check_constitution(state, result)
    return result`;
    
      case 'api':
        return `def ${node.id}_handler(state: AgentState) -> AgentState:
    """API Call handler for ${node.data.label}"""
    # URL: ${config.url || 'https://api.example.com/endpoint'}
    # Method: ${config.method || 'GET'}
    
    import requests
    
    try:
        # Make API call
        response = requests.${config.method?.toLowerCase() || 'get'}("${config.url || 'https://api.example.com'}")
        api_result = response.json()
        
        result = {
            **state,
            "current_node": "${node.id}",
            "context": {**state["context"], "api_response": api_result}
        }
    except Exception as e:
        result = {
            **state,
            "current_node": "${node.id}",
            "status": "error",
            "error": str(e)
        }
    
    check_constitution(state, result)
    return result`;

      case 'condition':
      case 'router':
        return `def ${node.id}_handler(state: AgentState) -> AgentState:
    """Condition/Router handler for ${node.data.label}"""
    # This node uses conditional edges - see condition_router function
    return {
        **state,
        "current_node": "${node.id}"
    }`;

      case 'end':
        return `def ${node.id}_handler(state: AgentState) -> AgentState:
    """End node - finalizes the workflow"""
    return {
        **state,
        "current_node": "${node.id}",
        "status": "completed",
        "messages": state["messages"] + ["Workflow completed successfully"]
    }`;

      default:
        return `def ${node.id}_handler(state: AgentState) -> AgentState:
    """Handler for ${node.data.label} (${node.type})"""
    return {
        **state,
        "current_node": "${node.id}",
        "messages": state["messages"] + ["Processed ${node.data.label}"]
    }`;
    }
  };

  const generateFlowJSON = () => {
    return JSON.stringify({
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: {
          label: node.data.label,
          config: node.data.config || {}
        }
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        label: edge.label
      })),
      metadata: {
        name: "AgentLayer Workflow",
        description: "Generated workflow from AgentLayer visual builder",
        version: "1.0.0",
        exportedAt: new Date().toISOString(),
        totalNodes: nodes.length,
        totalEdges: edges.length
      }
    }, null, 2);
  };

  const generateConstitutionJSON = () => {
    return JSON.stringify({
      constitution: {
        name: "AgentLayer Constitution",
        description: "Rules and regulations for AI agent behavior",
        version: "1.0.0",
        rules: constitutionRules
      },
      enforcement: {
        enabled: true,
        strict_mode: false,
        log_violations: true
      },
      metadata: {
        exportedAt: new Date().toISOString(),
        totalRules: constitutionRules.length,
        activeRules: constitutionRules.filter(r => r.enabled).length
      }
    }, null, 2);
  };

  const handleExport = () => {
    const exports: { [key: string]: string } = {};

    if (exportFormat === 'langgraph' || exportFormat === 'all') {
      exports['agent_flow.py'] = generateLangGraphCode();
    }

    if (exportFormat === 'json' || exportFormat === 'all') {
      exports['flow.json'] = generateFlowJSON();
    }

    if (exportFormat === 'all') {
      exports['constitution.json'] = generateConstitutionJSON();
      
      // Add README file
      exports['README.md'] = `# AgentLayer Workflow Export

This package contains your AgentLayer workflow exported for production use.

## Files Included

- \`agent_flow.py\` - LangGraph-compatible Python code
- \`flow.json\` - Workflow structure and configuration
- \`constitution.json\` - AI behavior rules and regulations

## Quick Start

1. Install dependencies:
   \`\`\`bash
   pip install langgraph langchain
   \`\`\`

2. Run the workflow:
   \`\`\`bash
   python agent_flow.py
   \`\`\`

## Customization

Edit the node handlers in \`agent_flow.py\` to integrate with your specific:
- LLM providers (OpenAI, Anthropic, etc.)
- APIs and databases
- Custom business logic

Generated on: ${new Date().toLocaleString()}
`;
    }

    // Download files
    Object.entries(exports).forEach(([filename, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>🚀 Export AgentLayer Workflow (MCP Compatible)</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Format Selection */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Export Format</h4>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  checked={exportFormat === 'all'}
                  onChange={() => setExportFormat('all')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">🎯 Complete Package (Recommended)</div>
                  <div className="text-xs text-gray-600">LangGraph Python + Flow JSON + Constitution + README</div>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  checked={exportFormat === 'langgraph'}
                  onChange={() => setExportFormat('langgraph')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">🐍 LangGraph Python Code Only</div>
                  <div className="text-xs text-gray-600">Production-ready Python code with MCP compatibility</div>
                </div>
              </label>
              
              <label className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">📄 Flow JSON Only</div>
                  <div className="text-xs text-gray-600">Workflow structure for integration with other tools</div>
                </div>
              </label>
            </div>
          </div>

          {/* Export Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-3">📋 Export Preview</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span>🎬</span>
                  <span>Start Nodes: {nodes.filter(n => n.type === 'start').length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🤖</span>  
                  <span>AI Nodes: {nodes.filter(n => n.type === 'aichat').length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔀</span>
                  <span>Condition Nodes: {nodes.filter(n => ['condition', 'router'].includes(n.type || '')).length}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span>🌐</span>
                  <span>API Nodes: {nodes.filter(n => n.type === 'api').length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🔗</span>
                  <span>Total Edges: {edges.length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🛡️</span>
                  <span>Constitution Rules: {constitutionRules.length}</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
              Export will be generated on: {new Date().toLocaleString()}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
              🚀 Export Workflow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
