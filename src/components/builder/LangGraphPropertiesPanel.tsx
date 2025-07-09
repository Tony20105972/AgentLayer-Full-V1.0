
import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, HelpCircle, Sparkles, Settings } from 'lucide-react';
import { NodeConfig } from '@/types/flow';

interface LangGraphPropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
  onOptimizeWithAI: (nodeId: string) => void;
  nodes: Node[];
}

const LangGraphPropertiesPanel: React.FC<LangGraphPropertiesPanelProps> = ({
  selectedNode,
  onUpdateNode,
  onOptimizeWithAI,
  nodes
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!selectedNode) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500 mt-20">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Select a Block</h3>
          <p className="text-sm">Click on any block in your flow to edit its settings</p>
        </div>
      </div>
    );
  }

  const config = (selectedNode.data.config as NodeConfig) || {};

  const updateConfig = (field: string, value: any) => {
    onUpdateNode(selectedNode.id, {
      config: {
        ...config,
        [field]: value
      }
    });
  };

  const updateLabel = (label: string) => {
    onUpdateNode(selectedNode.id, { label });
  };

  const addInputField = () => {
    const newInputs = [...(config.inputVars || []), ''];
    updateConfig('inputVars', newInputs);
  };

  const updateInputField = (index: number, value: string) => {
    const newInputs = [...(config.inputVars || [])];
    newInputs[index] = value;
    updateConfig('inputVars', newInputs);
  };

  const removeInputField = (index: number) => {
    const newInputs = (config.inputVars || []).filter((_, i) => i !== index);
    updateConfig('inputVars', newInputs);
  };

  const addOutputField = () => {
    const newOutputs = [...(config.outputVars || []), ''];
    updateConfig('outputVars', newOutputs);
  };

  const updateOutputField = (index: number, value: string) => {
    const newOutputs = [...(config.outputVars || [])];
    newOutputs[index] = value;
    updateConfig('outputVars', newOutputs);
  };

  const removeOutputField = (index: number) => {
    const newOutputs = (config.outputVars || []).filter((_, i) => i !== index);
    updateConfig('outputVars', newOutputs);
  };

  const renderStateTab = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Label className="text-sm font-medium">Block Name</Label>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        <Input
          value={String(selectedNode.data.label || '')}
          onChange={(e) => updateLabel(e.target.value)}
          placeholder="e.g., Email Input Manager"
          className="text-sm"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">What Goes In? (Input Fields)</Label>
          <Button onClick={addInputField} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </Button>
        </div>
        <div className="space-y-2">
          {(config.inputVars || []).map((input, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => updateInputField(index, e.target.value)}
                placeholder="email, user_message, etc."
                className="flex-1 text-sm"
              />
              <Button
                onClick={() => removeInputField(index)}
                size="sm"
                variant="ghost"
                className="text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {(config.inputVars || []).length === 0 && (
            <p className="text-sm text-gray-500 italic">Click "Add Field" to define what data comes into this block</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">What Goes Out? (Output Fields)</Label>
          <Button onClick={addOutputField} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Field
          </Button>
        </div>
        <div className="space-y-2">
          {(config.outputVars || []).map((output, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={output}
                onChange={(e) => updateOutputField(index, e.target.value)}
                placeholder="summary, analysis, result, etc."
                className="flex-1 text-sm"
              />
              <Button
                onClick={() => removeOutputField(index)}
                size="sm"
                variant="ghost"
                className="text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {(config.outputVars || []).length === 0 && (
            <p className="text-sm text-gray-500 italic">Click "Add Field" to define what data comes out of this block</p>
          )}
        </div>
      </div>

      <div className="p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800 font-medium mb-1">💡 State Manager Tips</div>
        <div className="text-xs text-blue-600">
          • This is your data hub - define all fields your flow will use<br/>
          • Input: What users provide (email, question, file)<br/>
          • Output: What your AI creates (summary, answer, report)
        </div>
      </div>
    </div>
  );

  const renderNodeTab = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Label className="text-sm font-medium">Block Name</Label>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        <Input
          value={String(selectedNode.data.label || '')}
          onChange={(e) => updateLabel(e.target.value)}
          placeholder="e.g., Email Summarizer"
          className="text-sm"
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">What does this block do?</Label>
        <Textarea
          value={config.prompt || ''}
          onChange={(e) => updateConfig('prompt', e.target.value)}
          placeholder="Summarize the email and identify key action items. Be concise and highlight urgent matters."
          className="text-sm"
          rows={4}
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Block Type</Label>
        <Select value={config.model || 'gpt-4'} onValueChange={(value) => updateConfig('model', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt-4">🧠 AI Assistant (GPT-4)</SelectItem>
            <SelectItem value="gpt-3.5-turbo">⚡ Fast AI (GPT-3.5)</SelectItem>
            <SelectItem value="claude-3">🤖 Claude AI</SelectItem>
            <SelectItem value="function">⚙️ Custom Function</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Advanced Settings</Label>
        <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
      </div>

      {showAdvanced && (
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <Label className="text-sm mb-2 block">Creativity Level</Label>
            <div className="px-3 py-2 bg-white rounded border text-sm">
              Temperature: {config.temperature || 0.7}
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature || 0.7}
              onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Focused</span>
              <span>Creative</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          onClick={() => onOptimizeWithAI(selectedNode.id)}
          variant="outline" 
          className="flex-1"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI Optimize
        </Button>
      </div>

      <div className="p-3 bg-green-50 rounded-lg">
        <div className="text-sm text-green-800 font-medium mb-1">🎯 AI Node Tips</div>
        <div className="text-xs text-green-600">
          • Write clear instructions like you're talking to a person<br/>
          • Include examples: "Like this: [example]"<br/>
          • Be specific about the output format you want
        </div>
      </div>
    </div>
  );

  const renderRouterTab = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Block Name</Label>
        <Input
          value={String(selectedNode.data.label || '')}
          onChange={(e) => updateLabel(e.target.value)}
          placeholder="e.g., Priority Router"
          className="text-sm"
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Decision Logic (Plain English)</Label>
        <Textarea
          value={config.conditions as string || ''}
          onChange={(e) => updateConfig('conditions', e.target.value)}
          placeholder="If the email contains 'urgent' OR 'asap' → send to Priority Handler
If the sentiment is negative → send to Support Team
Otherwise → send to Standard Processor"
          className="text-sm font-mono"
          rows={6}
        />
      </div>

      <div className="p-3 bg-orange-50 rounded-lg">
        <div className="text-sm text-orange-800 font-medium mb-1">🔀 Router Tips</div>
        <div className="text-xs text-orange-600">
          • Use simple IF-THEN logic<br/>
          • Include keywords like "contains", "equals", "greater than"<br/>
          • Always have an "Otherwise" fallback route
        </div>
      </div>
    </div>
  );

  const renderRuleCheckerTab = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Block Name</Label>
        <Input
          value={String(selectedNode.data.label || '')}
          onChange={(e) => updateLabel(e.target.value)}
          placeholder="e.g., Safety Guardian"
          className="text-sm"
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Constitution Rule Set</Label>
        <Select value={config.ruleSetName || 'default_constitution'} onValueChange={(value) => updateConfig('ruleSetName', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default_constitution">🔒 Default Safety Rules</SelectItem>
            <SelectItem value="professional_communication">💼 Professional Communication</SelectItem>
            <SelectItem value="content_moderation">🛡️ Content Moderation</SelectItem>
            <SelectItem value="custom_rules">⚙️ Custom Rule Set</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">What to Check</Label>
        <div className="space-y-2">
          {(config.inputVars || []).map((input, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <span className="text-sm flex-1">{input || `Field ${index + 1}`}</span>
              <Badge variant="secondary" className="text-xs">Monitoring</Badge>
            </div>
          ))}
          {(config.inputVars || []).length === 0 && (
            <p className="text-sm text-gray-500 italic">Add input fields in the State tab to monitor them here</p>
          )}
        </div>
      </div>

      <div className="p-3 bg-red-50 rounded-lg">
        <div className="text-sm text-red-800 font-medium mb-1">🛡️ Constitution Tips</div>
        <div className="text-xs text-red-600">
          • This checks all AI outputs for safety and compliance<br/>
          • Violations will stop the flow and show warnings<br/>
          • Configure rules in the Constitution page
        </div>
      </div>
    </div>
  );

  const renderOutputTab = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium mb-3 block">Block Name</Label>
        <Input
          value={String(selectedNode.data.label || '')}
          onChange={(e) => updateLabel(e.target.value)}
          placeholder="e.g., Send to Slack"
          className="text-sm"
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Where to Send</Label>
        <Select value={config.outputType || 'webhook'} onValueChange={(value) => updateConfig('outputType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="slack">💬 Slack Channel</SelectItem>
            <SelectItem value="discord">🎮 Discord Channel</SelectItem>
            <SelectItem value="webhook">🔗 Webhook URL</SelectItem>
            <SelectItem value="email">📧 Email</SelectItem>
            <SelectItem value="nft">🎨 Mint NFT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Destination URL/Address</Label>
        <Input
          value={config.targetUrl || ''}
          onChange={(e) => updateConfig('targetUrl', e.target.value)}
          placeholder="https://hooks.slack.com/services/..."
          className="text-sm"
        />
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Message Template</Label>
        <Textarea
          value={config.template || ''}
          onChange={(e) => updateConfig('template', e.target.value)}
          placeholder="📧 New email summary: {{summary}}
Priority: {{priority_level}}
Action needed: {{action_items}}"
          className="text-sm font-mono"
          rows={4}
        />
      </div>

      <div className="p-3 bg-purple-50 rounded-lg">
        <div className="text-sm text-purple-800 font-medium mb-1">📤 Output Tips</div>
        <div className="text-xs text-purple-600">
          • Use {{field_name}} to insert data from your flow<br/>
          • Test your webhook URL before running the flow<br/>
          • You can have multiple Output blocks for different channels
        </div>
      </div>
    </div>
  );

  const getActiveTab = () => {
    switch (selectedNode.type) {
      case 'state': return 'state';
      case 'llm': return 'node';
      case 'router': return 'router';
      case 'ruleChecker': return 'rules';
      case 'output': return 'output';
      default: return 'node';
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Block Settings</h3>
          <Badge variant="secondary" className="text-xs">
            {selectedNode.type?.toUpperCase()}
          </Badge>
        </div>
      </div>

      <Tabs value={getActiveTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-5 m-4">
          <TabsTrigger value="state" className="text-xs">State</TabsTrigger>
          <TabsTrigger value="node" className="text-xs">Node</TabsTrigger>
          <TabsTrigger value="router" className="text-xs">Router</TabsTrigger>
          <TabsTrigger value="rules" className="text-xs">Rules</TabsTrigger>
          <TabsTrigger value="output" className="text-xs">Output</TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="state" className="mt-0">
            {renderStateTab()}
          </TabsContent>

          <TabsContent value="node" className="mt-0">
            {renderNodeTab()}
          </TabsContent>

          <TabsContent value="router" className="mt-0">
            {renderRouterTab()}
          </TabsContent>

          <TabsContent value="rules" className="mt-0">
            {renderRuleCheckerTab()}
          </TabsContent>

          <TabsContent value="output" className="mt-0">
            {renderOutputTab()}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default LangGraphPropertiesPanel;
