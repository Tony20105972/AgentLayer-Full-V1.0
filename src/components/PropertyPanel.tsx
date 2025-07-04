
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
  const [activeTab, setActiveTab] = useState<'properties' | 'state' | 'execution' | 'rules'>('properties');

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
        <p className="text-xs text-gray-500">Click on a node to configure its settings</p>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'properties':
        return renderPropertiesTab();
      case 'state':
        return renderStateTab();
      case 'execution':
        return renderExecutionTab();
      case 'rules':
        return renderRulesTab();
      default:
        return renderPropertiesTab();
    }
  };

  const renderPropertiesTab = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nodeLabel">Node Name</Label>
        <Input 
          id="nodeLabel"
          value={nodeLabel}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="Enter node name..."
        />
      </div>

      {selectedNode.type === 'start' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="initialInput">Initial Input Schema</Label>
            <textarea 
              id="initialInput"
              className="w-full p-2 border border-gray-300 rounded-md text-sm font-mono"
              rows={4}
              value={nodeConfig.initialInput || '{}'}
              onChange={(e) => handleConfigChange('initialInput', e.target.value)}
              placeholder='{"message": "string", "user_id": "string"}'
            />
          </div>
        </>
      )}

      {selectedNode.type === 'agent' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="role">Agent Role</Label>
            <Input 
              id="role"
              value={nodeConfig.role || ''}
              onChange={(e) => handleConfigChange('role', e.target.value)}
              placeholder="e.g., Customer Support Specialist"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea 
              id="description"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={3}
              value={nodeConfig.description || ''}
              onChange={(e) => handleConfigChange('description', e.target.value)}
              placeholder="Describe the agent's capabilities and responsibilities"
            />
          </div>
        </>
      )}

      {selectedNode.type === 'notifier' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="notifierType">Notification Type</Label>
            <select 
              id="notifierType"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              value={nodeConfig.type || 'webhook'}
              onChange={(e) => handleConfigChange('type', e.target.value)}
            >
              <option value="slack">Slack</option>
              <option value="discord">Discord</option>
              <option value="telegram">Telegram</option>
              <option value="webhook">Webhook</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input 
              id="webhookUrl"
              value={nodeConfig.webhookUrl || ''}
              onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
              placeholder="https://hooks.slack.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="channel">Channel/Target</Label>
            <Input 
              id="channel"
              value={nodeConfig.channel || ''}
              onChange={(e) => handleConfigChange('channel', e.target.value)}
              placeholder="e.g., #alerts, @username"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderStateTab = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Expected Input/Output</h4>
      <div className="space-y-3">
        <div>
          <Label>Input Schema</Label>
          <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto font-mono">
            {JSON.stringify(getExpectedInput(selectedNode.type), null, 2)}
          </pre>
        </div>
        <div>
          <Label>Output Schema</Label>
          <pre className="text-xs bg-gray-100 p-3 rounded border overflow-x-auto font-mono">
            {JSON.stringify(getExpectedOutput(selectedNode.type), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );

  const renderExecutionTab = () => (
    <div className="space-y-4">
      {selectedNode.type === 'agent' && (
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
              <option value="gemini-pro">Gemini Pro</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System Prompt</Label>
            <textarea 
              id="systemPrompt"
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={6}
              value={nodeConfig.systemPrompt || ''}
              onChange={(e) => handleConfigChange('systemPrompt', e.target.value)}
              placeholder="You are a helpful AI assistant..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Input 
              id="temperature"
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={nodeConfig.temperature || 0.7}
              onChange={(e) => handleConfigChange('temperature', parseFloat(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={nodeConfig.toolsEnabled || false}
                onChange={(e) => handleConfigChange('toolsEnabled', e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Enable Tools</span>
            </label>
          </div>
        </>
      )}
    </div>
  );

  const renderRulesTab = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Constitutional Rules</h4>
      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          Rules are enforced by the RuleChecker node in the workflow.
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="text-sm text-yellow-800">
            🛡️ All nodes are subject to constitutional monitoring
          </div>
        </div>
      </div>
    </div>
  );

  const getExpectedInput = (nodeType: string) => {
    switch (nodeType) {
      case 'start':
        return { message: 'string', user_id: 'string', context: 'object' };
      case 'agent':
        return { prompt: 'string', context: 'object', user_input: 'string' };
      case 'router':
        return { decision_data: 'object', conditions: 'array' };
      case 'ruleChecker':
        return { content: 'string', metadata: 'object' };
      case 'notifier':
        return { message: 'string', metadata: 'object', urgency: 'string' };
      default:
        return {};
    }
  };

  const getExpectedOutput = (nodeType: string) => {
    switch (nodeType) {
      case 'start':
        return { processed_input: 'object', session_id: 'string' };
      case 'agent':
        return { response: 'string', confidence: 'number', tools_used: 'array' };
      case 'router':
        return { selected_path: 'string', reason: 'string' };
      case 'ruleChecker':
        return { violations: 'array', passed: 'boolean', score: 'number' };
      case 'notifier':
        return { sent: 'boolean', delivery_id: 'string', timestamp: 'string' };
      default:
        return {};
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Node Configuration</h3>
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm text-gray-600">Type: <span className="font-medium">{selectedNode.type}</span></div>
          <div className="text-sm text-gray-600">ID: <span className="font-mono text-xs">{selectedNode.id}</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        {[
          { key: 'properties', label: 'Properties', icon: '⚙️' },
          { key: 'state', label: 'State', icon: '📊' },
          { key: 'execution', label: 'Execution', icon: '🔄' },
          { key: 'rules', label: 'Rules', icon: '🛡️' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-2 py-2 text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PropertyPanel;
