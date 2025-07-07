
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, AlertTriangle } from 'lucide-react';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: Record<string, string>) => void;
}

interface APIKeyConfig {
  id: string;
  name: string;
  placeholder: string;
  required: boolean;
}

const apiKeyConfigs: APIKeyConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI API Key',
    placeholder: 'sk-...',
    required: true
  },
  {
    id: 'anthropic',
    name: 'Anthropic API Key',
    placeholder: 'sk-ant-...',
    required: false
  },
  {
    id: 'huggingface',
    name: 'HuggingFace API Key',
    placeholder: 'hf_...',
    required: false
  },
  {
    id: 'slack',
    name: 'Slack Webhook URL',
    placeholder: 'https://hooks.slack.com/...',
    required: false
  }
];

const APIKeyModal: React.FC<APIKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [keys, setKeys] = useState<Record<string, string>>(() => {
    const stored = sessionStorage.getItem('agentlayer_api_keys');
    return stored ? JSON.parse(stored) : {};
  });
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const handleSave = () => {
    sessionStorage.setItem('agentlayer_api_keys', JSON.stringify(keys));
    onSave(keys);
    onClose();
  };

  const toggleShowKey = (keyId: string) => {
    setShowKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const updateKey = (keyId: string, value: string) => {
    setKeys(prev => ({ ...prev, [keyId]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Key className="w-5 h-5" />
            <span>API Keys Configuration</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <div className="font-medium mb-1">Security Notice</div>
                <div>Keys are stored in your browser session only and never sent to our servers.</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {apiKeyConfigs.map((config) => (
              <div key={config.id} className="space-y-2">
                <Label htmlFor={config.id} className="flex items-center space-x-1">
                  <span>{config.name}</span>
                  {config.required && <span className="text-red-500">*</span>}
                </Label>
                <div className="relative">
                  <Input
                    id={config.id}
                    type={showKeys[config.id] ? 'text' : 'password'}
                    placeholder={config.placeholder}
                    value={keys[config.id] || ''}
                    onChange={(e) => updateKey(config.id, e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => toggleShowKey(config.id)}
                  >
                    {showKeys[config.id] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Keys
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeyModal;
