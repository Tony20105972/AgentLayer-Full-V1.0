
import React from 'react';
import { ExecutionStep } from '@/hooks/useExecutionFlow';

interface ExecutionPanelProps {
  executionSteps: ExecutionStep[];
  isExecuting: boolean;
  onClearLogs: () => void;
  onStopExecution: () => void;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({ 
  executionSteps, 
  isExecuting, 
  onClearLogs, 
  onStopExecution 
}) => {
  const getStatusIcon = (status: ExecutionStep['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'running': return '🔄';
      case 'success': return '✅';
      case 'failure': return '❌';
      case 'violation': return '⚠️';
      default: return '⚪';
    }
  };

  const getStatusColor = (status: ExecutionStep['status']) => {
    switch (status) {
      case 'running': return 'text-blue-600 bg-blue-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'failure': return 'text-red-600 bg-red-50';
      case 'violation': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Execution Monitor</h3>
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            isExecuting 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isExecuting ? 'bg-blue-400 animate-pulse' : 'bg-gray-400'
            }`} />
            {isExecuting ? 'Running' : 'Idle'}
          </div>
          <div className="text-xs text-gray-500">
            {executionSteps.length} steps
          </div>
        </div>
      </div>

      {/* Execution Steps */}
      <div className="flex-1 bg-gray-50 rounded-lg p-3 overflow-y-auto">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Execution Timeline</h4>
        {executionSteps.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-4xl mb-2">🎬</div>
            <p className="text-sm">No execution data</p>
            <p className="text-xs">Click "Execute Workflow" to start</p>
          </div>
        ) : (
          <div className="space-y-3">
            {executionSteps.map((step, index) => (
              <div key={step.id} className="bg-white rounded-lg p-3 border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getStatusIcon(step.status)}</span>
                    <span className="font-medium text-sm">Step {index + 1}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(step.status)}`}>
                      {step.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.duration > 0 ? `${step.duration.toFixed(0)}ms` : 'Running...'}
                  </div>
                </div>
                
                <div className="text-sm text-gray-700 mb-2">
                  <strong>Node:</strong> {step.nodeId}
                </div>
                
                {step.input && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-gray-600 mb-1">Input:</div>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(step.input, null, 2)}
                    </pre>
                  </div>
                )}
                
                {step.output && Object.keys(step.output).length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-gray-600 mb-1">Output:</div>
                    <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                      {JSON.stringify(step.output, null, 2)}
                    </pre>
                  </div>
                )}
                
                {step.errors && step.errors.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-red-600 mb-1">Errors:</div>
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                      {step.errors.map((error, i) => <div key={i}>{error}</div>)}
                    </div>
                  </div>
                )}
                
                {step.violations && step.violations.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium text-orange-600 mb-1">Constitution Violations:</div>
                    <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                      {step.violations.map((violation, i) => <div key={i}>{violation}</div>)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button 
          onClick={onStopExecution}
          disabled={!isExecuting}
          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Stop Execution
        </button>
        <button 
          onClick={onClearLogs}
          className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
        >
          Clear Logs
        </button>
      </div>
    </div>
  );
};

export default ExecutionPanel;
