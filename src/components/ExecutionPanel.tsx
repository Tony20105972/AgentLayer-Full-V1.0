
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Slack, Key, Loader2 } from 'lucide-react';

interface ExecutionPanelProps {
  onExecute: () => Promise<any>;
  onReplay: (uuid: string) => Promise<void>;
  isExecuting: boolean;
  isReplaying: boolean;
  lastResult: any;
  onOpenSlackModal: () => void;
  onOpenAPIKeys: () => void;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  onExecute,
  onReplay,
  isExecuting,
  isReplaying,
  lastResult,
  onOpenSlackModal,
  onOpenAPIKeys
}) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onExecute}
            disabled={isExecuting || isReplaying}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6"
          >
            {isExecuting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Agent
              </>
            )}
          </Button>

          {lastResult && (
            <Button
              variant="outline"
              onClick={() => onReplay(lastResult.uuid)}
              disabled={isExecuting || isReplaying}
            >
              {isReplaying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Replaying...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Replay
                </>
              )}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={onOpenAPIKeys}
            className="flex items-center space-x-2"
          >
            <Key className="w-4 h-4" />
            <span>API Keys</span>
          </Button>
        </div>

        <div className="flex items-center space-x-4">
          {lastResult && (
            <div className="flex items-center space-x-2">
              <Badge variant={lastResult.violations?.length > 0 ? "destructive" : "default"}>
                {lastResult.violations?.length > 0 ? 'Violations Detected' : 'Clean Run'}
              </Badge>
              <span className="text-sm text-gray-600">
                Score: {lastResult.totalScore || 0}/100
              </span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenSlackModal}
            disabled={!lastResult}
          >
            <Slack className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;
