
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const NodeLibraryPanel: React.FC = () => {
  const nodeTypes = [
    {
      type: 'state',
      name: 'State',
      icon: '🗂️',
      description: 'Initial state configuration',
      color: 'bg-blue-500'
    },
    {
      type: 'node',
      name: 'AI Node',
      icon: '🤖',
      description: 'LLM processing node',
      color: 'bg-green-500'
    },
    {
      type: 'router',
      name: 'Router',
      icon: '🔀',
      description: 'Conditional branching',
      color: 'bg-orange-500'
    },
    {
      type: 'ruleChecker',
      name: 'Rule Checker',
      icon: '🛡️',
      description: 'Constitution enforcement',
      color: 'bg-red-500'
    },
    {
      type: 'output',
      name: 'Output',
      icon: '📤',
      description: 'Final output handler',
      color: 'bg-purple-500'
    }
  ];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Node Library</h2>
        <p className="text-sm text-gray-600">
          Drag nodes to canvas to build your agent flow
        </p>
      </div>

      <div className="space-y-3">
        {nodeTypes.map((node) => (
          <Card
            key={node.type}
            className="cursor-grab hover:shadow-md transition-shadow"
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${node.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                  {node.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{node.name}</h3>
                  <p className="text-xs text-gray-500">{node.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">Flow Structure</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>1. State → Define initial data</div>
          <div>2. Node(s) → AI processing</div>
          <div>3. Router → Conditional logic</div>
          <div>4. Rule Checker → Constitution check</div>
          <div>5. Output → Final destination</div>
        </div>
      </div>
    </div>
  );
};

export default NodeLibraryPanel;
