
import React from 'react';

const NodeLibrary = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const fixedNodes = [
    { type: 'start', icon: '🎬', name: 'Start Node', color: 'from-emerald-400 to-teal-500', description: 'Initialize workflow' },
    { type: 'agent', icon: '🤖', name: 'AI Agent', color: 'from-blue-500 to-blue-600', description: 'LLM processing' },
    { type: 'router', icon: '🔀', name: 'Router', color: 'from-orange-400 to-orange-600', description: 'Conditional branching' },
    { type: 'ruleChecker', icon: '🛡️', name: 'Rule Checker', color: 'from-green-500 to-green-600', description: 'Constitution validation' },
    { type: 'end', icon: '🏁', name: 'End Node', color: 'from-gray-500 to-gray-600', description: 'Workflow completion' }
  ];

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">AgentLayer Nodes</h3>
        <p className="text-sm text-gray-600 leading-relaxed">Build constitutional AI workflows with visual blocks</p>
      </div>

      {/* Fixed Flow Overview */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Fixed Flow Structure
        </h4>
        <div className="space-y-3">
          {fixedNodes.map((node, index) => (
            <div key={node.type} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className={`w-8 h-8 bg-gradient-to-r ${node.color} rounded-lg flex items-center justify-center text-sm shadow-sm`}>
                {node.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{node.name}</div>
                <div className="text-xs text-gray-500 truncate">{node.description}</div>
              </div>
              <div className="text-xs text-gray-400 font-mono">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-xs text-blue-700 font-medium">
            💡 These nodes are auto-placed and form the core workflow
          </div>
        </div>
      </div>

      {/* Draggable Notifier Node */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
          Communication Nodes
        </h4>
        <div
          draggable
          onDragStart={(event) => onDragStart(event, 'notifier')}
          className="p-4 border-2 border-dashed border-purple-200 rounded-lg cursor-grab hover:bg-purple-50 hover:border-purple-300 transition-all group bg-white shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-lg">📢</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900">
                Notifier Node
              </div>
              <div className="text-xs text-gray-500">
                Slack • Discord • Telegram • Webhook
              </div>
            </div>
            <div className="text-purple-400 group-hover:text-purple-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        </div>
        <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
          <div className="text-xs text-purple-700">
            🎯 Drag to canvas • Connect after End or Router nodes only
          </div>
        </div>
      </div>

      {/* Connection Guidelines */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
          Flow Guidelines
        </h4>
        <div className="space-y-3 text-xs text-gray-600">
          <div className="flex items-start space-x-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Left-to-right flow direction</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Snap-to-grid alignment (20px)</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Constitution rules enforced globally</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-amber-500 mt-0.5">⚠</span>
            <span>Max 5 notifier nodes per workflow</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full p-3 text-left text-sm text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 bg-white">
            <span className="mr-2">📋</span>Load Template
          </button>
          <button className="w-full p-3 text-left text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-green-100 bg-white">
            <span className="mr-2">💾</span>Save Workflow
          </button>
          <button className="w-full p-3 text-left text-sm text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border border-purple-100 bg-white">
            <span className="mr-2">🔄</span>Reset Flow
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeLibrary;
