
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'slack': return 'from-green-500 to-green-600';
      case 'telegram': return 'from-blue-500 to-blue-600';
      case 'discord': return 'from-indigo-500 to-indigo-600';
      case 'webhook': return 'from-purple-500 to-purple-600';
      default: return 'from-purple-500 to-purple-600';
    }
  };

  const notifierType = data.config?.type || 'webhook';

  return (
    <div className={`w-[200px] h-[80px] bg-gradient-to-r ${getTypeColor(notifierType)} text-white rounded-lg shadow-lg border-2 border-white flex items-center justify-between px-4 relative`}>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <span className="text-xl">{getIcon(notifierType)}</span>
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm truncate">{data.label || 'Notifier'}</div>
          <div className="text-xs text-purple-100 truncate">
            {notifierType.charAt(0).toUpperCase() + notifierType.slice(1)}
            {data.config?.channel && ` • ${data.config.channel}`}
          </div>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-white border-2 border-purple-500 rounded-full shadow-md"
      />
    </div>
  );
};

export default NotifierNode;
