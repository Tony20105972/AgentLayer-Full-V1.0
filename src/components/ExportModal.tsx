
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
    return `
from langgraph.graph import StateGraph, START, END
from typing import TypedDict, List
import json

class AgentState(TypedDict):
    messages: List[str]
    current_node: str
    context: dict

def create_workflow():
    workflow = StateGraph(AgentState)
    
    # Add nodes
${nodes.map(node => `    workflow.add_node("${node.id}", ${node.type}_handler)`).join('\n')}
    
    # Add edges
${edges.map(edge => `    workflow.add_edge("${edge.source}", "${edge.target}")`).join('\n')}
    
    # Set entry point
    workflow.set_entry_point("${nodes.find(n => n.type === 'start')?.id || 'start'}")
    workflow.set_finish_point("${nodes.find(n => n.type === 'end')?.id || 'end'}")
    
    return workflow.compile()

# Node handlers
${nodes.map(node => generateNodeHandler(node)).join('\n\n')}

# Constitution checker
def check_constitution(state: AgentState, output: dict) -> bool:
    rules = ${JSON.stringify(constitutionRules, null, 2)}
    # Implementation of constitution checking logic
    return True

if __name__ == "__main__":
    app = create_workflow()
    initial_state = {"messages": [], "current_node": "start", "context": {}}
    result = app.invoke(initial_state)
    print(result)
`;
  };

  const generateNodeHandler = (node: Node) => {
    switch (node.type) {
      case 'aichat':
        return `def ${node.id}_handler(state: AgentState) -> AgentState:
    # AI Chat handler for ${node.data.label}
    # Prompt: ${node.data.config?.prompt || 'Default prompt'}
    return state`;
      case 'api':
        return `def ${node.id}_handler(state: AgentState) -> AgentState:
    # API Call handler for ${node.data.label}
    # URL: ${node.data.config?.url || 'No URL specified'}
    return state`;
      default:
        return `def ${node.id}_handler(state: AgentState) -> AgentState:
    # Handler for ${node.data.label}
    return state`;
    }
  };

  const generateFlowJSON = () => {
    return JSON.stringify({
      nodes: nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type
      })),
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    }, null, 2);
  };

  const generateConstitutionJSON = () => {
    return JSON.stringify({
      rules: constitutionRules,
      version: '1.0.0',
      exportedAt: new Date().toISOString()
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
    }

    // 파일 다운로드 처리
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export AgentLayer Workflow</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Export Format</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={exportFormat === 'all'}
                  onChange={() => setExportFormat('all')}
                />
                <span className="text-sm">Complete Package (LangGraph + JSON + Constitution)</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={exportFormat === 'langgraph'}
                  onChange={() => setExportFormat('langgraph')}
                />
                <span className="text-sm">LangGraph Python Code Only</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                />
                <span className="text-sm">Flow JSON Only</span>
              </label>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Export Preview</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>📁 Nodes: {nodes.length}</div>
              <div>🔗 Edges: {edges.length}</div>
              <div>📋 Constitution Rules: {constitutionRules.length}</div>
              <div>🗓️ Export Date: {new Date().toLocaleString()}</div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport}>
              Export Workflow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
