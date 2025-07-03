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
      setNodeLabel(typeof selectedNode.data.label === 'string' ? selectedNode.data.label : '');
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
      case 'control':
        return (
          <>
            <div className="bg-indigo-50 p-3 rounded-lg mb-4">
              <div className="flex items-center space-x-2 text-indigo-700">
                <span>🎯</span>
                <span className="font-medium">Control Center</span>
              </div>
              <p className="text-xs text-indigo-600 mt-1">
                Central coordination for all workflow execution
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priorityLevel">Priority Level</Label>
              <select 
                id="priorityLevel"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={nodeConfig.priorityLevel || 'normal'}
                onChange={(e) => handleConfigChange('priorityLevel', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </>
        );

      case 'documentUpload':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="acceptedFormats">Accepted Formats</Label>
              <Input 
                id="acceptedFormats"
                value={nodeConfig.acceptedFormats || 'pdf,docx,txt'}
                onChange={(e) => handleConfigChange('acceptedFormats', e.target.value)}
                placeholder="pdf,docx,txt"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input 
                id="maxFileSize"
                type="number"
                value={nodeConfig.maxFileSize || 10}
                onChange={(e) => handleConfigChange('maxFileSize', parseInt(e.target.value))}
              />
            </div>
          </>
        );

      case 'slack':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="slackChannel">Slack Channel</Label>
              <Input 
                id="slackChannel"
                value={nodeConfig.slackChannel || '#alerts'}
                onChange={(e) => handleConfigChange('slackChannel', e.target.value)}
                placeholder="#alerts"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="messageTemplate">Message Template</Label>
              <textarea 
                id="messageTemplate"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows={3}
                value={nodeConfig.messageTemplate || ''}
                onChange={(e) => handleConfigChange('messageTemplate', e.target.value)}
                placeholder="Alert: {{message}}"
              />
            </div>
          </>
        );

      case 'deploy':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="deployTarget">Deploy Target</Label>
              <select 
                id="deployTarget"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={nodeConfig.deployTarget || 'vercel'}
                onChange={(e) => handleConfigChange('deployTarget', e.target.value)}
              >
                <option value="vercel">Vercel</option>
                <option value="netlify">Netlify</option>
                <option value="github-pages">GitHub Pages</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buildCommand">Build Command</Label>
              <Input 
                id="buildCommand"
                value={nodeConfig.buildCommand || 'npm run build'}
                onChange={(e) => handleConfigChange('buildCommand', e.target.value)}
              />
            </div>
          </>
        );

      case 'queryContext':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="vectorStore">Vector Store</Label>
              <select 
                id="vectorStore"
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={nodeConfig.vectorStore || 'pinecone'}
                onChange={(e) => handleConfigChange('vectorStore', e.target.value)}
              >
                <option value="pinecone">Pinecone</option>
                <option value="weaviate">Weaviate</option>
                <option value="chroma">Chroma</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topK">Top K Results</Label>
              <Input 
                id="topK"
                type="number"
                value={nodeConfig.topK || 5}
                onChange={(e) => handleConfigChange('topK', parseInt(e.target.value))}
              />
            </div>
          </>
        );

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
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={nodeConfig.constitutionCheck !== false}
                onChange={(e) => handleConfigChange('constitutionCheck', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Constitution Check</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
