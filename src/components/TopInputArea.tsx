
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TopInputAreaProps {
  config: {
    apiKey: string;
    purpose: string;
    description: string;
    rules: string[];
  };
  onConfigChange: (config: any) => void;
}

const TopInputArea: React.FC<TopInputAreaProps> = ({ config, onConfigChange }) => {
  const handleChange = (field: string, value: string | string[]) => {
    onConfigChange({ ...config, [field]: value });
  };

  const addRule = () => {
    const newRules = [...config.rules, ''];
    handleChange('rules', newRules);
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...config.rules];
    newRules[index] = value;
    handleChange('rules', newRules);
  };

  const removeRule = (index: number) => {
    const newRules = config.rules.filter((_, i) => i !== index);
    handleChange('rules', newRules);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🚀</span>
          Agent Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={config.apiKey}
              onChange={(e) => handleChange('apiKey', e.target.value)}
              placeholder="sk-..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Agent Purpose</Label>
            <Input
              id="purpose"
              value={config.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              placeholder="e.g., Customer Support Agent"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Input
              id="description"
              value={config.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Brief description of the agent's role"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Constitutional Rules</Label>
            <button
              onClick={addRule}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              + Add Rule
            </button>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {config.rules.map((rule, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={rule}
                  onChange={(e) => updateRule(index, e.target.value)}
                  placeholder="e.g., Never share personal information"
                  className="flex-1"
                />
                <button
                  onClick={() => removeRule(index)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopInputArea;
