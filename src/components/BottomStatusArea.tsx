
import React from 'react';

interface BottomStatusAreaProps {
  ruleCount: number;
  violations: Array<{ nodeId: string; message: string; ruleId: string }>;
  isExecuting: boolean;
  onExecute: () => void;
  onExportMCP: () => void;
}

const BottomStatusArea: React.FC<BottomStatusAreaProps> = ({
  ruleCount,
  violations,
  isExecuting,
  onExecute,
  onExportMCP
}) => {
  return (
    <div className="bg-gray-50 border-t border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🛡️</span>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Constitution Engine
                </div>
                <div className="text-xs text-gray-600">
                  {ruleCount} rules active
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                violations.length === 0 ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <div>
                <div className={`text-sm font-medium ${
                  violations.length === 0 ? 'text-green-700' : 'text-red-700'
                }`}>
                  {violations.length === 0 ? 'No Violations' : `${violations.length} Violations`}
                </div>
                {violations.length > 0 && (
                  <div className="text-xs text-red-600">
                    {violations.map(v => v.nodeId).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onExecute}
              disabled={isExecuting}
              className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                isExecuting
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white shadow-lg'
              }`}
            >
              <span>{isExecuting ? '🔄' : '▶️'}</span>
              <span>{isExecuting ? 'Executing...' : 'Execute Agent'}</span>
            </button>
            
            <button
              onClick={onExportMCP}
              className="px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition-all flex items-center space-x-2"
            >
              <span>📤</span>
              <span>Export MCP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomStatusArea;
