
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
      description: 'Define your data fields',
      required: true,
      tooltip: 'This is where you define what data flows through your agent'
    },
    { 
      type: 'llm', 
      icon: '🧠', 
      name: 'AI Agent Node', 
      color: 'from-purple-500 to-purple-600', 
      description: 'AI processing block',
      required: false,
      tooltip: 'This is where your AI does the work - like analyzing, writing, or deciding'
    },
    { 
      type: 'router', 
      icon: '🔀', 
      name: 'Decision Router', 
      color: 'from-orange-500 to-orange-600', 
      description: 'Smart flow control',
      required: false,
      tooltip: 'Routes your data to different paths based on conditions you set'
    },
    { 
      type: 'ruleChecker', 
      icon: '🛡️', 
      name: 'Constitution Checker', 
      color: 'from-red-500 to-red-600', 
      description: 'Safety & compliance',
      required: true,
      tooltip: 'Ensures your AI follows the rules and safety guidelines'
    },
    { 
      type: 'output', 
      icon: '📤', 
      name: 'Output Handler', 
      color: 'from-green-500 to-green-600', 
      description: 'Send to external apps',
      required: true,
      tooltip: 'Sends your results to Slack, webhooks, or other destinations'
    }
  ];

  const presetFlows = [
    {
      name: 'Email Assistant',
      description: 'Summarize and prioritize emails',
      icon: '📧',
      blocks: 5
    },
    {
      name: 'Content Moderator',
      description: 'Check content for safety',
      icon: '🛡️',
      blocks: 4
    },
    {
      name: 'Data Analyzer',
      description: 'Process and analyze data',
      icon: '📊',
      blocks: 6
    }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">LangGraph Blocks</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Drag blocks to build your no-code AI agent
        </p>
      </div>

      {/* Core Blocks */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
          Essential Blocks
        </h4>
        <div className="space-y-3">
          {langGraphNodes.map((node, index) => (
            <div
              key={node.type}
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
              className={`group p-4 border-2 border-dashed rounded-lg cursor-grab hover:border-solid hover:shadow-md transition-all bg-white ${
                node.required ? 'border-blue-300 hover:border-blue-400' : 'border-gray-200 hover:border-gray-300'
              }`}
              title={node.tooltip}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${node.color} rounded-lg flex items-center justify-center text-lg shadow-sm`}>
                  {node.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 flex items-center">
                    {node.name}
                    {node.required && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
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
            💡 Flow Structure
          </div>
          <div className="text-xs text-blue-600">
            State → AI Node → Router → Rules → Output
          </div>
        </div>
      </div>

      {/* Quick Start Templates */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Quick Start Templates
        </h4>
        <div className="space-y-2">
          {presetFlows.map((preset, index) => (
            <button
              key={index}
              className="w-full p-3 text-left text-sm hover:bg-gray-50 rounded-lg transition-colors border border-gray-100 bg-white group"
              onClick={() => console.log('Load preset:', preset.name)}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{preset.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{preset.name}</div>
                  <div className="text-xs text-gray-500">{preset.description}</div>
                </div>
                <div className="text-xs text-gray-400 font-mono">
                  {preset.blocks} blocks
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Flow Guidelines */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
          No-Code Tips
        </h4>
        <div className="space-y-3 text-xs text-gray-600">
          <div className="flex items-start space-x-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Start with State Manager to define your data</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Connect blocks with lines (edges)</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500 mt-0.5">✓</span>
            <span>Always end with Constitution + Output</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-500 mt-0.5">💡</span>
            <span>Click any block to edit its settings</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-6 mt-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h4>
        <div className="space-y-2">
          <button className="w-full p-3 text-left text-sm text-purple-700 hover:bg-purple-50 rounded-lg transition-colors border border-purple-100 bg-white">
            <span className="mr-2">🎯</span>AI Flow Generator
          </button>
          <button className="w-full p-3 text-left text-sm text-green-700 hover:bg-green-50 rounded-lg transition-colors border border-green-100 bg-white">
            <span className="mr-2">💾</span>Save My Flow
          </button>
          <button className="w-full p-3 text-left text-sm text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-100 bg-white">
            <span className="mr-2">🏛️</span>Manage Rules
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeLibrary;
