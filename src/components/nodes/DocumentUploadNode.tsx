
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const DocumentUploadNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[140px]">
      <div className="flex items-center justify-center space-x-2 mb-1">
        <span className="text-lg">📄</span>
        <span className="font-medium text-sm">{data.label || 'Document Upload'}</span>
      </div>
      <div className="text-xs text-center text-green-200">File Processing</div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-white border-2 border-green-500"
      />
    </div>
  );
};

export default DocumentUploadNode;
