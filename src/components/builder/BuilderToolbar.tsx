
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
  Check,
  Loader2
} from 'lucide-react';
import APIKeyModal from './APIKeyModal';

interface BuilderToolbarProps {
  onExecute: () => void;
  isExecuting: boolean;
  onSaveApiKeys: () => void;
  apiKeysSaved: boolean;
  onDeleteNode: () => void;
  hasSelectedNode: boolean;
}

const BuilderToolbar: React.FC<BuilderToolbarProps> = ({
  onExecute,
  isExecuting,
  onSaveApiKeys,
  apiKeysSaved,
  onDeleteNode,
  hasSelectedNode
}) => {
  const [showApiModal, setShowApiModal] = useState(false);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');

  const handleGenerateFlow = () => {
    if (!naturalLanguageInput.trim()) return;
    // AI flow generation logic would go here
    console.log('Generating flow:', naturalLanguageInput);
    setNaturalLanguageInput('');
  };

  return (
    <>
      <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
        {/* Left Section - AI Generation */}
        <div className="flex items-center space-x-4 flex-1 max-w-md">
          <div className="flex items-center space-x-2 flex-1">
            <Input
              placeholder="Describe your agent flow... (e.g., Summarize → Translate → Slack)"
              value={naturalLanguageInput}
              onChange={(e) => setNaturalLanguageInput(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateFlow()}
            />
            <Button 
              onClick={handleGenerateFlow}
              disabled={!naturalLanguageInput.trim()}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Generate
            </Button>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {hasSelectedNode && (
            <Button
              onClick={onDeleteNode}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}

          <Button
            onClick={() => setShowApiModal(true)}
            variant="outline"
            size="sm"
            className="relative"
          >
            <Key className="w-4 h-4 mr-2" />
            API Keys
            {apiKeysSaved && (
              <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1">
                <Check className="w-3 h-3" />
              </Badge>
            )}
          </Button>

          <Button variant="outline" size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button 
            onClick={onExecute}
            disabled={isExecuting}
            className="bg-green-600 hover:bg-green-700"
            size="sm"
          >
            {isExecuting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isExecuting ? 'Running...' : 'Run Flow'}
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
