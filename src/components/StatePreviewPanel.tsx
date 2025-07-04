
import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { ExecutionStep } from '@/hooks/useExecutionFlow';

interface StatePreviewPanelProps {
  selectedNode: Node | null;
  executionSteps: ExecutionStep[];
}

const StatePreviewPanel: React.FC<StatePreviewPanelProps> = ({ selectedNode, executionSteps }) => {
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  if (!selectedNode) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">No Node Selected</h3>
        <p className="text-xs text-gray-500">Select a node to view its state data</p>
      </div>
    );
  }

  // Find the latest execution step for this node
  const nodeStep = executionSteps
    .filter(step => step.nodeId === selectedNode.id)
    .sort((a, b) => b.timestamp - a.timestamp)[0];

  // Type guard and safe access to config properties
  const nodeConfig = selectedNode.data?.config;
  const configInputState = nodeConfig && typeof nodeConfig === 'object' && 'inputState' in nodeConfig 
    ? nodeConfig.inputState as Record<string, any> 
    : {};
  const configOutputState = nodeConfig && typeof nodeConfig === 'object' && 'outputState' in nodeConfig 
    ? nodeConfig.outputState as Record<string, any> 
    : {};

  const inputState = nodeStep?.input || configInputState || {};
  const outputState = nodeStep?.output || configOutputState || {};

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Node State</h3>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">
            Node: <span className="font-medium">{selectedNode.data?.label || selectedNode.id}</span>
          </div>
          <div className="text-sm text-gray-600">Type: <span className="font-mono text-xs">{selectedNode.type}</span></div>
          {nodeStep && (
            <div className="text-sm text-gray-600">
              Status: <span className={`font-medium ${
                nodeStep.status === 'success' ? 'text-green-600' :
                nodeStep.status === 'failure' ? 'text-red-600' :
                nodeStep.status === 'violation' ? 'text-orange-600' :
                'text-blue-600'
              }`}>
                {String(nodeStep.status)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* State Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('input')}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'input'
              ? 'border-b-2 border-blue-600 text-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📥 Input State
        </button>
        <button
          onClick={() => setActiveTab('output')}
          className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
            activeTab === 'output'
              ? 'border-b-2 border-blue-600 text-blue-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📤 Output State
        </button>
      </div>

      {/* State Content */}
      <div className="flex-1 bg-gray-50 rounded-lg p-3 overflow-y-auto">
        {activeTab === 'input' ? (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Input State (JSON)</h4>
            {Object.keys(inputState).length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-3xl mb-2">📥</div>
                <p className="text-sm">No input state data</p>
                <p className="text-xs">Execute the workflow to see real-time data</p>
              </div>
            ) : (
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto font-mono">
                {JSON.stringify(inputState, null, 2)}
              </pre>
            )}
          </div>
        ) : (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Output State (JSON)</h4>
            {Object.keys(outputState).length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-3xl mb-2">📤</div>
                <p className="text-sm">No output state data</p>
                <p className="text-xs">Execute the workflow to see real-time data</p>
              </div>
            ) : (
              <pre className="text-xs bg-white p-3 rounded border overflow-x-auto font-mono">
                {JSON.stringify(outputState, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>

      {/* State Actions */}
      <div className="mt-4 space-y-2">
        <button className="w-full p-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
          📋 Copy State JSON
        </button>
        <button className="w-full p-2 text-left text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
          💾 Save State Snapshot
        </button>
        <button className="w-full p-2 text-left text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
          🔄 Reset State
        </button>
      </div>
    </div>
  );
};

export default StatePreviewPanel;
