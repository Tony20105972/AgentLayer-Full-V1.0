
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PropertyPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: Partial<Node>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({ selectedNode, onUpdateNode }) => {
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeConfig, setNodeConfig] = useState<Record<string, any>>({});

  useEffect(() => {
    if (selectedNode) {
      setNodeLabel(selectedNode.data.label || '');
      setNodeConfig(selectedNode.data.config || {});
    }
  }, [selectedNode]);

  const handleLabelChange = (value: string) => {
    setNodeLabel(value);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        data: { ...selectedNode.data, label: value }
      });
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    const newConfig = { ...nodeConfig, [key]: value };
    setNodeConfig(newConfig);
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        data: { ...selectedNode.data, config: newConfig }
      });
    }
  };

  if (!selectedNode) {
    return (
      <div className="p-6 text-center">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚙️</span>
          </div>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-2">No Node Selected</h3>
        <p className="text-xs text-gray-500">Click on a node to view and edit its properties</p>
      </div>
    );
  }

  const renderNodeSpecificFields = () => {
    switch (selectedNode.type) {
      case 'aichat':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="model">AI Model</Label>
              <select 
                id="model"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={nodeConfig.model || 'gpt-4'}
                onChange={(e) => handleConfigChange('model', e.target.value)}
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prompt">System Prompt</Label>
              <textarea 
                id="prompt"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows={4}
                value={nodeConfig.prompt || ''}
                onChange={(e) => handleConfigChange('prompt', e.target.value)}
                placeholder="Enter system prompt..."
              />
            </div>
          </>
        );
      
      case 'api':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="url">API URL</Label>
              <Input 
                id="url"
                value={nodeConfig.url || ''}
                onChange={(e) => handleConfigChange('url', e.target.value)}
                placeholder="https://api.example.com/endpoint"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">HTTP Method</Label>
              <select 
                id="method"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={nodeConfig.method || 'GET'}
                onChange={(e) => handleConfigChange('method', e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </>
        );

      case 'mcp':
        return (
          <>
            <div className="bg-blue-50 p-3 rounded-lg mb-4">
              <div className="flex items-center space-x-2 text-blue-700">
                <span>🧠</span>
                <span className="font-medium">Main Control Plane</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">
                This node orchestrates the entire workflow execution
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxRetries">Max Retries</Label>
              <Input 
                id="maxRetries"
                type="number"
                value={nodeConfig.maxRetries || 3}
                onChange={(e) => handleConfigChange('maxRetries', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (seconds)</Label>
              <Input 
                id="timeout"
                type="number"
                value={nodeConfig.timeout || 30}
                onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value))}
              />
            </div>
          </>
        );

      default:
        return (
          <div className="text-sm text-gray-500">
            No specific configuration available for this node type.
          </div>
        );
    }
  };

  return (
    <div className="p-4 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Node Properties</h3>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Type: <span className="font-medium">{selectedNode.type}</span></div>
          <div className="text-sm text-gray-600">ID: <span className="font-mono text-xs">{selectedNode.id}</span></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nodeLabel">Node Label</Label>
          <Input 
            id="nodeLabel"
            value={nodeLabel}
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Enter node name..."
          />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Configuration</h4>
          {renderNodeSpecificFields()}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Advanced Settings</h4>
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={nodeConfig.enabled !== false}
                onChange={(e) => handleConfigChange('enabled', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Enabled</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={nodeConfig.breakpoint || false}
                onChange={(e) => handleConfigChange('breakpoint', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Debug Breakpoint</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
