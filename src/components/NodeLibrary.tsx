
import React from 'react';

const NodeLibrary = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-4 h-full overflow-y-auto bg-white">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AgentLayer Nodes</h3>
        <p className="text-sm text-gray-600">Fixed flow + draggable notifiers</p>
      </div>

      {/* Fixed Flow Overview */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          🔒 Fixed Flow Structure
        </h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Start → Agent → Router → RuleChecker → End</span>
          </div>
          <div className="text-xs text-gray-500 ml-4">
            These nodes are auto-placed and cannot be deleted
          </div>
        </div>
      </div>

      {/* Draggable Notifier Node */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          📢 Communication Nodes
        </h4>
        <div className="space-y-2">
          <div
            draggable
            onDragStart={(event) => onDragStart(event, 'notifier')}
            className="p-3 border border-gray-200 rounded-lg cursor-grab hover:bg-purple-50 hover:border-purple-300 transition-all group"
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">📢</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  Notifier Node
                </div>
                <div className="text-xs text-gray-500 truncate">
                  Slack, Discord, Telegram, Webhook
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node Connection Rules */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">📋 Connection Rules</h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div>• Notifiers can only connect after End or Router nodes</div>
          <div>• Maximum 5 notifier nodes per workflow</div>
          <div>• Each notifier supports multiple delivery types</div>
        </div>
      </div>

      {/* Quick Actions */}
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
            🔄 Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeLibrary;
