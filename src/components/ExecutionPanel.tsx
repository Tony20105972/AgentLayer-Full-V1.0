
import React, { useState } from 'react';

interface ExecutionPanelProps {
  executionLogs: string[];
  isExecuting: boolean;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({ executionLogs, isExecuting }) => {
  const [showReplay, setShowReplay] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);

  // 시뮬레이션된 실행 히스토리
  const executionHistory = [
    { id: 'exec-001', timestamp: '2024-01-15 14:30', status: 'success', duration: '2.4s', nodes: 5 },
    { id: 'exec-002', timestamp: '2024-01-15 12:15', status: 'failed', duration: '1.2s', nodes: 3 },
    { id: 'exec-003', timestamp: '2024-01-15 10:45', status: 'success', duration: '3.1s', nodes: 7 },
  ];

  const handleReplay = (executionId: string) => {
    setSelectedExecution(executionId);
    setShowReplay(true);
    // 실제 구현에서는 여기서 선택된 실행의 로그를 불러와서 재생
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Execution Monitor</h3>
        <div className="flex items-center justify-between">
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
          <button 
            onClick={() => setShowReplay(!showReplay)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showReplay ? 'Hide History' : 'Show History'}
          </button>
        </div>
      </div>

      {/* Execution History */}
      {showReplay && (
        <div className="mb-4 border border-gray-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Execution History</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {executionHistory.map((exec) => (
              <div 
                key={exec.id} 
                className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs cursor-pointer hover:bg-gray-100"
                onClick={() => handleReplay(exec.id)}
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    exec.status === 'success' ? 'bg-green-400' : 'bg-red-400'
                  }`} />
                  <span className="font-mono">{exec.timestamp}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <span>{exec.nodes} nodes</span>
                  <span>{exec.duration}</span>
                  <span className="text-blue-600">▶️</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Console Output */}
      <div className="flex-1 bg-gray-900 text-green-400 font-mono text-sm rounded-lg p-4 overflow-y-auto">
        <div className="mb-2 text-gray-500">
          {selectedExecution ? `Replaying ${selectedExecution}` : 'AgentLayer Execution Console'}
        </div>
        <div className="border-b border-gray-700 mb-4 pb-2">
          {new Date().toLocaleString()}
        </div>
        
        {executionLogs.length === 0 ? (
          <div className="text-gray-500">
            {showReplay && selectedExecution ? 
              'Loading replay data...' : 
              'Waiting for workflow execution...'
            }
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

      {/* Control Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors">
          Stop Execution
        </button>
        <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors">
          Clear Logs
        </button>
      </div>

      {/* Execution Stats */}
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
            <div className="text-gray-500">Constitution Checks</div>
            <div className="font-medium text-purple-600">381</div>
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Advanced</h4>
        <div className="space-y-2">
          <button className="w-full p-2 text-left text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            🔄 Export Execution Data
          </button>
          <button className="w-full p-2 text-left text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
            📊 Performance Analysis
          </button>
          <button className="w-full p-2 text-left text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            🚀 Schedule Execution
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;
