
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface APIKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const APIKeyModal: React.FC<APIKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    anthropic: '',
    slack: '',
    discord: ''
  });

  const toggleKeyVisibility = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    onSave();
    onClose();
  };

  const apiServices = [
    { key: 'openai', name: 'OpenAI', description: 'For GPT models' },
    { key: 'anthropic', name: 'Anthropic', description: 'For Claude models' },
    { key: 'slack', name: 'Slack', description: 'For Slack notifications' },
    { key: 'discord', name: 'Discord', description: 'For Discord webhooks' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>API Keys Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {apiServices.map((service) => (
            <Card key={service.key}>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div>
                    <Label className="font-medium">{service.name}</Label>
                    <p className="text-xs text-gray-500">{service.description}</p>
                  </div>
                  <div className="relative">
                    <Input
                      type={showKeys[service.key] ? 'text' : 'password'}
                      value={apiKeys[service.key as keyof typeof apiKeys]}
                      onChange={(e) => setApiKeys(prev => ({ 
                        ...prev, 
                        [service.key]: e.target.value 
                      }))}
                      placeholder={`Enter ${service.name} API key`}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => toggleKeyVisibility(service.key)}
                    >
                      {showKeys[service.key] ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Save Keys
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeyModal;
