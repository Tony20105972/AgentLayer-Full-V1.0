
import React from 'react';
import { Card } from '@/components/ui/card';

const NodeLibrary: React.FC = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { 
      type: 'state', 
      icon: '🗂️', 
      name: 'State', 
      color: 'from-blue-500 to-blue-600',
      description: 'Initial state configuration'
    },
    { 
      type: 'llm', 
      icon: '🧠', 
      name: 'LLM Node', 
      color: 'from-purple-500 to-purple-600',
      description: 'Large Language Model processing'
    },
    { 
      type: 'tool', 
      icon: '🔧', 
      name: 'Tool Node', 
      color: 'from-orange-500 to-orange-600',
      description: 'External tool integration'
    },
    { 
      type: 'router', 
      icon: '🔀', 
      name: 'Router', 
      color: 'from-amber-500 to-amber-600',
      description: 'Conditional flow routing'
    },
    { 
      type: 'ruleChecker', 
      icon: '⚖️', 
      name: 'Rule Checker', 
      color: 'from-green-500 to-green-600',
      description: 'Constitution enforcement'
    },
    { 
      type: 'output', 
      icon: '📤', 
      name: 'Output', 
      color: 'from-indigo-500 to-indigo-600',
      description: 'Final output destination'
    }
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Node Library</h2>
        <p className="text-sm text-gray-600">Drag blocks to canvas to build your agent flow</p>
      </div>

      <div className="space-y-3">
        {nodeTypes.map((node) => (
          <Card
            key={node.type}
            className="p-4 cursor-grab hover:shadow-md transition-all duration-200 border-2 border-dashed border-gray-200 hover:border-gray-300"
            draggable
            onDragStart={(event) => onDragStart(event, node.type)}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${node.color} rounded-lg flex items-center justify-center text-lg shadow-sm`}>
                {node.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900">{node.name}</h3>
                <p className="text-xs text-gray-500 truncate">{node.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Flow Guidelines</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Connect nodes left to right</li>
          <li>• State → LLM → Router → Output</li>
          <li>• Rule Checker can be placed anywhere</li>
          <li>• Click nodes to edit properties</li>
        </ul>
      </div>
    </div>
  );
};

export default NodeLibrary;
