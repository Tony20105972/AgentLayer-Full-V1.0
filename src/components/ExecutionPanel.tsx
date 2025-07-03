
import React from 'react';

interface ExecutionPanelProps {
  executionLogs: string[];
  isExecuting: boolean;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({ executionLogs, isExecuting }) => {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Execution Monitor</h3>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          isExecuting 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            isExecuting ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
          }`} />
          {isExecuting ? 'Running' : 'Idle'}
        </div>
      </div>

      <div className="flex-1 bg-gray-900 text-green-400 font-mono text-sm rounded-lg p-4 overflow-y-auto">
        <div className="mb-2 text-gray-500">AgentLayer Execution Console</div>
        <div className="border-b border-gray-700 mb-4 pb-2">
          {new Date().toLocaleString()}
        </div>
        
        {executionLogs.length === 0 ? (
          <div className="text-gray-500">
            Waiting for workflow execution...
          </div>
        ) : (
          <div className="space-y-1">
            {executionLogs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-gray-500 text-xs mt-0.5">
                  {String(index + 1).padStart(3, '0')}
                </span>
                <span className="flex-1">{log}</span>
              </div>
            ))}
          </div>
        )}

        {isExecuting && (
          <div className="mt-4 flex items-center space-x-2 text-yellow-400">
            <div className="animate-spin w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full" />
            <span>Processing...</span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
          Stop Execution
        </button>
        <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
          Clear Logs
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Execution Stats</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-500">Success Rate</div>
            <div className="font-medium text-green-600">94.2%</div>
          </div>
          <div>
            <div className="text-gray-500">Avg Duration</div>
            <div className="font-medium text-blue-600">2.4s</div>
          </div>
          <div>
            <div className="text-gray-500">Total Runs</div>
            <div className="font-medium text-gray-900">127</div>
          </div>
          <div>
            <div className="text-gray-500">Last Run</div>
            <div className="font-medium text-gray-900">2 min ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;
