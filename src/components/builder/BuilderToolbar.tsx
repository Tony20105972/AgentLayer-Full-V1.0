
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Save, 
  Download, 
  Key, 
  Trash2, 
  Sparkles,
  RotateCcw,
  Loader2
} from 'lucide-react';
import APIKeyModal from './APIKeyModal';

interface BuilderToolbarProps {
  onExecute: () => void;
  onReplay: () => void;
  isExecuting: boolean;
  isReplaying: boolean;
  onSaveApiKeys: () => void;
  apiKeysSaved: boolean;
  onDeleteNode: () => void;
  hasSelectedNode: boolean;
}

const BuilderToolbar: React.FC<BuilderToolbarProps> = ({
  onExecute,
  onReplay,
  isExecuting,
  isReplaying,
  onSaveApiKeys,
  apiKeysSaved,
  onDeleteNode,
  hasSelectedNode
}) => {
  const [showApiModal, setShowApiModal] = useState(false);
  const [naturalLanguage, setNaturalLanguage] = useState('');

  const handleGenerateFlow = () => {
    if (naturalLanguage.trim()) {
      // This would generate nodes based on natural language
      console.log('Generating flow from:', naturalLanguage);
      setNaturalLanguage('');
    }
  };

  return (
    <>
      <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Natural Language Generation */}
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Describe your agent flow... (e.g., 'Summarize → Translate → Slack')"
              value={naturalLanguage}
              onChange={(e) => setNaturalLanguage(e.target.value)}
              className="w-96"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateFlow()}
            />
            <Button
              onClick={handleGenerateFlow}
              disabled={!naturalLanguage.trim()}
              className="flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Execution Controls */}
          <Button
            onClick={onExecute}
            disabled={isExecuting || isReplaying}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isExecuting ? 'Running...' : 'Run Flow'}</span>
          </Button>

          <Button
            onClick={onReplay}
            disabled={isExecuting || isReplaying}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isReplaying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            <span>{isReplaying ? 'Replaying...' : 'Replay'}</span>
          </Button>

          {/* API Keys */}
          <Button
            onClick={() => setShowApiModal(true)}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Key className="w-4 h-4" />
            <span>API Keys</span>
            {apiKeysSaved && <Badge className="ml-1 bg-green-500">Saved ✅</Badge>}
          </Button>

          {/* Node Actions */}
          {hasSelectedNode && (
            <Button
              onClick={onDeleteNode}
              variant="outline"
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </Button>
          )}

          {/* Save & Export */}
          <Button variant="outline" className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save</span>
          </Button>

          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      <APIKeyModal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        onSave={onSaveApiKeys}
      />
    </>
  );
};

export default BuilderToolbar;
