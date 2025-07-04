
import React from 'react';
import { Handle, Position } from '@xyflow/react';

const NotifierNode = ({ data }: { data: any }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'slack': return '💬';
      case 'telegram': return '📱';
      case 'discord': return '🎮';
      case 'webhook': return '🔗';
      default: return '📢';
    }
  };

  const notifierType = data.config?.type || 'webhook';

  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-3 rounded-lg shadow-lg border-2 border-white min-w-[180px] relative">
      <div className="flex items-center justify-center space-x-2 mb-2">
        <span className="text-lg">{getIcon(notifierType)}</span>
        <span className="font-medium text-sm">{data.label || 'Notifier'}</span>
      </div>
      <div className="text-xs text-center text-purple-100 mb-1">
        {notifierType.toUpperCase()}
      </div>
      {data.config?.channel && (
        <div className="text-xs text-center text-pink-200 truncate">
          {data.config.channel}
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white border-2 border-purple-500"
      />
    </div>
  );
};

export default NotifierNode;
