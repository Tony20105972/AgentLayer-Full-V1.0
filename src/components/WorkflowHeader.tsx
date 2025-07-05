
import React from 'react';

const WorkflowHeader: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AL</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AgentLayer</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            AI Agent Builder Platform
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Workflow
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Load Template
          </button>
        </div>
      </div>
    </header>
  );
};

export default WorkflowHeader;
