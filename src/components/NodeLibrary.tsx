
import React from 'react';

const nodeCategories = [
  {
    title: '🚀 Control Nodes',
    nodes: [
      { type: 'start', label: 'Start', icon: '🎬', description: 'Workflow entry point' },
      { type: 'control', label: 'Control Center', icon: '🎯', description: 'Main Control Plane' },
      { type: 'mcp', label: 'MCP Controller', icon: '🧠', description: 'Master Control Processor' },
      { type: 'router', label: 'Router', icon: '🔀', description: 'Conditional routing logic' },
      { type: 'condition', label: 'Condition', icon: '❓', description: 'Simple conditional branching' },
      { type: 'end', label: 'End', icon: '🏁', description: 'Workflow termination' }
    ]
  },
  {
    title: '🤖 AI Agent Nodes',
    nodes: [
      { type: 'aichat', label: 'AI Agent', icon: '🤖', description: 'Intelligent agent with LLM' },
      { type: 'rag', label: 'RAG Query', icon: '📚', description: 'Knowledge retrieval agent' },
      { type: 'embedding', label: 'Embedding', icon: '🔢', description: 'Text vectorization' },
      { type: 'queryContext', label: 'Query Context', icon: '🔍', description: 'Context-aware search' }
    ]
  },
  {
    title: '🔗 Integration Nodes',
    nodes: [
      { type: 'api', label: 'API Call', icon: '🌐', description: 'External API integration' },
      { type: 'webhook', label: 'Webhook', icon: '📡', description: 'HTTP webhook handler' },
      { type: 'database', label: 'Database', icon: '🗄️', description: 'Database operations' },
      { type: 'slack', label: 'Slack Alert', icon: '💬', description: 'Team notifications' }
    ]
  },
  {
    title: '📁 Data Nodes',
    nodes: [
      { type: 'documentUpload', label: 'Document Upload', icon: '📄', description: 'File upload handler' },
      { type: 'embedVector', label: 'Vector Embed', icon: '🔢', description: 'Text to vectors' },
      { type: 'transform', label: 'Data Transform', icon: '🔄', description: 'Data transformation' },
      { type: 'filter', label: 'Filter', icon: '🔍', description: 'Data filtering' }
    ]
  },
  {
    title: '🚀 Deployment',
    nodes: [
      { type: 'deploy', label: 'Auto Deploy', icon: '🚀', description: 'GitHub + Vercel deploy' }
    ]
  }
];

const NodeLibrary = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Node Library</h3>
        <p className="text-sm text-gray-600">Drag nodes to canvas to build your agent</p>
      </div>

      {nodeCategories.map((category) => (
        <div key={category.title} className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
            {category.title}
          </h4>
          <div className="space-y-2">
            {category.nodes.map((node) => (
              <div
                key={node.type}
                draggable
                onDragStart={(event) => onDragStart(event, node.type)}
                className="p-3 border border-gray-200 rounded-lg cursor-grab hover:bg-blue-50 hover:border-blue-300 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{node.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {node.label}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {node.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="border-t border-gray-200 pt-4 mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">💡 Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full p-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            📋 Load Template
          </button>
          <button className="w-full p-2 text-left text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            💾 Save Workflow
          </button>
          <button className="w-full p-2 text-left text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            📊 View Analytics
          </button>
          <button className="w-full p-2 text-left text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
            🔄 Replay Execution
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeLibrary;
