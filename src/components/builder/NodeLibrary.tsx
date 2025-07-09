
import React from 'react';

const NodeLibrary = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const langGraphNodes = [
    { 
      type: 'state', 
      icon: '🗂️', 
      name: 'State Manager', 
      color: 'from-blue-500 to-blue-600', 
      description: 'Initialize shared state',
      required: true
    },
    { 
      type: 'llm', 
      icon: '🧠', 
      name: 'AI Agent Node', 
      color: 'from-purple-500 to-purple-600', 
      description: 'LLM processing unit',
      required: false
    },
    { 
      type: 'router', 
      icon: '🔀', 
      name: 'Decision Router', 
      color: 'from-orange-500 to-orange-600', 
      description: 'Conditional branching',
      required: false
    },
    { 
      type: 'ruleChecker', 
      icon: '🛡️', 
      name: 'Constitution Checker', 
      color: 'from-red-500 to-red-600', 
      description: 'Rule enforcement',
      required: true
    },
    { 
      type: 'output', 
      icon: '📤', 
      name: 'Output Handler', 
      color: 'from-green-500 to-green-600', 
      description: 'External channels',
      required: true
    }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">LangGraph Nodes</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Build constitutional AI workflows with visual blocks
        </p>
      </div>

      {/* LangGraph Flow Structure */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          LangGraph Flow Structure
        </h4>
        <div className="space-y-3">
          {langGraphNodes.map((node, index) => (
            <div
              key={node.type}
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
              className={`p-4 border-2 border-dashed rounded-lg cursor-grab hover:bg-gray-50 transition-all group bg-white shadow-sm ${
                node.required ? 'border-gray-300' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${node.color} rounded-lg flex items-center justify-center text-lg shadow-sm`}>
                  {node.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 flex items-center">
                    {node.name}
                    {node.required && (
                      <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">{node.description}</div>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="text-xs text-blue-700 font-medium mb-1">
            💡 LangGraph Best Practices
          </div>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• State → Node(s) → Router → RuleChecker → Output</li>
            <li>• Connect nodes with edges left-to-right</li>
            <li>• Always include RuleChecker for constitution</li>
            <li>• Use Router for complex conditional logic</li>
          </ul>
        </div>
      </div>

      {/* Flow Guidelines */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
          Flow Guidelines
        </h4>
        <div className="space-y-3 text-xs text-gray-600">
          <div className="flex items-start space-x-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Left-to-right execution flow</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Edge-based node connections</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Constitution rules enforced globally</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-amber-500 mt-0.5">⚠</span>
            <span>Violations highlighted in red during execution</span>
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
            <span className="mr-2">🏛️</span>Constitution Rules
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeLibrary;
