
import React from 'react';
import { AgentState, MemoryChain } from '@/types/AgentState';

interface StatePanelProps {
  memoryChain: MemoryChain;
  executionState: {
    isExecuting: boolean;
    currentNodeId: string | null;
    executionPath: string[];
  };
}

const StatePanel: React.FC<StatePanelProps> = ({ memoryChain, executionState }) => {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Agent State</h3>
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            executionState.isExecuting 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              executionState.isExecuting ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'
            }`} />
            {executionState.isExecuting ? 'Active' : 'Idle'}
          </div>
          <span className="text-xs text-gray-500">
            Session: {memoryChain.sessionId.slice(-8)}
          </span>
        </div>
      </div>

      {/* Current Execution Path */}
      {executionState.isExecuting && (
        <div className="mb-4 border border-blue-200 rounded-lg p-3 bg-blue-50">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Execution Path</h4>
          <div className="flex flex-wrap gap-1">
            {executionState.executionPath.map((nodeId, index) => (
              <div key={index} className="flex items-center">
                <span className={`px-2 py-1 rounded text-xs ${
                  nodeId === executionState.currentNodeId
                    ? 'bg-blue-200 text-blue-900 font-medium'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {nodeId.split('-')[0]}
                </span>
                {index < executionState.executionPath.length - 1 && (
                  <span className="mx-1 text-blue-400">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Global Context */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Global Context</h4>
        <div className="bg-gray-50 rounded-lg p-3 max-h-32 overflow-y-auto">
          {Object.keys(memoryChain.globalContext).length === 0 ? (
            <div className="text-xs text-gray-500">No context data</div>
          ) : (
            <pre className="text-xs text-gray-700">
              {JSON.stringify(memoryChain.globalContext, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* State History */}
      <div className="flex-1">
        <h4 className="text-sm font-medium text-gray-900 mb-2">State History</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {memoryChain.states.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <div className="text-2xl mb-2">📊</div>
              <div className="text-xs">No state changes yet</div>
            </div>
          ) : (
            memoryChain.states.map((state, index) => (
              <div key={state.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {state.nodeId}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(state.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {state.metadata.constitutionViolations.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs text-red-600 font-medium">⚠️ Violations:</div>
                    {state.metadata.constitutionViolations.map((violation, vIndex) => (
                      <div key={vIndex} className="text-xs text-red-500 ml-2">
                        • {violation}
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-xs text-gray-600">
                  <div>Input: {Object.keys(state.input).length} keys</div>
                  <div>Output: {Object.keys(state.output).length} keys</div>
                  <div>Execution: {state.metadata.executionTime}ms</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">State Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
            📊 Export State
          </button>
          <button className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors">
            🔄 Reset Chain
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatePanel;
