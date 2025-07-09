
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Save, 
  Download, 
  Key, 
  Trash2, 
  Sparkles,
  RotateCcw,
  Loader2,
  Zap,
  Share
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
      console.log('Generating flow from:', naturalLanguage);
      setNaturalLanguage('');
    }
  };

  return (
    <>
      <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          {/* AI Flow Generator */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-blue-50 px-3 py-2 rounded-lg border border-purple-200">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">AI Flow Builder</span>
            </div>
            <Input
              placeholder="Describe your agent flow... (e.g., 'Email summarizer that sends urgent ones to Slack')"
              value={naturalLanguage}
              onChange={(e) => setNaturalLanguage(e.target.value)}
              className="w-96 text-sm"
              onKeyPress={(e) => e.key === 'Enter' && handleGenerateFlow()}
            />
            <Button
              onClick={handleGenerateFlow}
              disabled={!naturalLanguage.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Flow Control */}
          <div className="flex items-center space-x-2 border-r border-gray-200 pr-3">
            <Button
              onClick={onExecute}
              disabled={isExecuting || isReplaying}
              className="bg-green-600 hover:bg-green-700 text-white font-medium"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Flow
                </>
              )}
            </Button>

            <Button
              onClick={onReplay}
              disabled={isExecuting || isReplaying}
              variant="outline"
              className="border-orange-200 text-orange-700 hover:bg-orange-50"
            >
              {isReplaying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Replaying...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Replay
                </>
              )}
            </Button>
          </div>

          {/* Configuration */}
          <Button
            onClick={() => setShowApiModal(true)}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Key className="w-4 h-4 mr-2" />
            <span>API Keys</span>
            {apiKeysSaved && (
              <Badge className="ml-2 bg-green-500 text-white text-xs px-2 py-0">
                ✅ Saved
              </Badge>
            )}
          </Button>

          {/* Node Actions */}
          {hasSelectedNode && (
            <Button
              onClick={onDeleteNode}
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Block
            </Button>
          )}

          {/* Save & Share */}
          <div className="flex items-center space-x-2 border-l border-gray-200 pl-3">
            <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>

            <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
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
