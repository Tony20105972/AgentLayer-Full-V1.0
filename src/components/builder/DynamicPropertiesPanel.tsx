
import React from 'react';
import { Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Settings } from 'lucide-react';

interface DynamicPropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
}

const DynamicPropertiesPanel: React.FC<DynamicPropertiesPanelProps> = ({
  selectedNode,
  onUpdateNode
}) => {
  if (!selectedNode) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Node Selected</h3>
          <p className="text-sm">Click on a node to edit its properties</p>
        </div>
      </div>
    );
  }

  const updateConfig = (field: string, value: any) => {
    onUpdateNode(selectedNode.id, {
      config: {
        ...selectedNode.data.config,
        [field]: value
      }
    });
  };

  const updateLabel = (label: string) => {
    onUpdateNode(selectedNode.id, { label });
  };

  const renderNodeProperties = () => {
    const config = selectedNode.data.config || {};
    
    switch (selectedNode.type) {
      case 'state':
        return (
          <div className="space-y-4">
            <div>
              <Label>Initial State (JSON)</Label>
              <Textarea
                value={config.initialState || '{}'}
                onChange={(e) => updateConfig('initialState', e.target.value)}
                className="font-mono text-sm"
                rows={6}
              />
            </div>
            <div>
              <Label>Input Variables</Label>
              <Input
                value={config.inputVars?.join(', ') || ''}
                onChange={(e) => updateConfig('inputVars', e.target.value.split(', ').filter(Boolean))}
                placeholder="topic, context"
              />
            </div>
          </div>
        );

      case 'llm':
        return (
          <div className="space-y-4">
            <div>
              <Label>Prompt Template</Label>
              <Textarea
                value={config.prompt || ''}
                onChange={(e) => updateConfig('prompt', e.target.value)}
                placeholder="Write a blog about {topic}"
                rows={4}
              />
            </div>
            <div>
              <Label>Temperature ({config.temperature || 0.7})</Label>
              <Slider
                value={[config.temperature || 0.7]}
                onValueChange={([value]) => updateConfig('temperature', value)}
                max={1}
                min={0}
                step={0.1}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Conservative</span>
                <span>Creative</span>
              </div>
            </div>
            <div>
              <Label>Model</Label>
              <select
                value={config.model || 'gpt-4'}
                onChange={(e) => updateConfig('model', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3">Claude 3</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Input Vars</Label>
                <Input
                  value={config.inputVars?.join(', ') || ''}
                  onChange={(e) => updateConfig('inputVars', e.target.value.split(', ').filter(Boolean))}
                  placeholder="topic"
                />
              </div>
              <div>
                <Label>Output Vars</Label>
                <Input
                  value={config.outputVars?.join(', ') || ''}
                  onChange={(e) => updateConfig('outputVars', e.target.value.split(', ').filter(Boolean))}
                  placeholder="blog_post"
                />
              </div>
            </div>
          </div>
        );

      case 'tool':
        return (
          <div className="space-y-4">
            <div>
              <Label>Tool Name</Label>
              <Input
                value={config.toolName || ''}
                onChange={(e) => updateConfig('toolName', e.target.value)}
                placeholder="translator"
              />
            </div>
            <div>
              <Label>Parameters (JSON)</Label>
              <Textarea
                value={config.params || '{}'}
                onChange={(e) => updateConfig('params', e.target.value)}
                className="font-mono text-sm"
                placeholder='{"lang": "fr"}'
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Input Vars</Label>
                <Input
                  value={config.inputVars?.join(', ') || ''}
                  onChange={(e) => updateConfig('inputVars', e.target.value.split(', ').filter(Boolean))}
                  placeholder="text"
                />
              </div>
              <div>
                <Label>Output Vars</Label>
                <Input
                  value={config.outputVars?.join(', ') || ''}
                  onChange={(e) => updateConfig('outputVars', e.target.value.split(', ').filter(Boolean))}
                  placeholder="translated_text"
                />
              </div>
            </div>
          </div>
        );

      case 'router':
        return (
          <div className="space-y-4">
            <div>
              <Label>Condition Logic</Label>
              <Textarea
                value={config.conditions || ''}
                onChange={(e) => updateConfig('conditions', e.target.value)}
                placeholder='if sentiment == "negative" → warn_node'
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Input Vars</Label>
                <Input
                  value={config.inputVars?.join(', ') || ''}
                  onChange={(e) => updateConfig('inputVars', e.target.value.split(', ').filter(Boolean))}
                  placeholder="sentiment"
                />
              </div>
              <div>
                <Label>Output Vars</Label>
                <Input
                  value={config.outputVars?.join(', ') || ''}
                  onChange={(e) => updateConfig('outputVars', e.target.value.split(', ').filter(Boolean))}
                  placeholder="decision_path"
                />
              </div>
            </div>
          </div>
        );

      case 'ruleChecker':
        return (
          <div className="space-y-4">
            <div>
              <Label>RuleSet Name</Label>
              <Input
                value={config.ruleSetName || ''}
                onChange={(e) => updateConfig('ruleSetName', e.target.value)}
                placeholder="no_bias"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Input Vars</Label>
                <Input
                  value={config.inputVars?.join(', ') || ''}
                  onChange={(e) => updateConfig('inputVars', e.target.value.split(', ').filter(Boolean))}
                  placeholder="response"
                />
              </div>
              <div>
                <Label>Output Vars</Label>
                <Input
                  value={config.outputVars?.join(', ') || ''}
                  onChange={(e) => updateConfig('outputVars', e.target.value.split(', ').filter(Boolean))}
                  placeholder="is_valid"
                />
              </div>
            </div>
          </div>
        );

      case 'output':
        return (
          <div className="space-y-4">
            <div>
              <Label>Output Type</Label>
              <select
                value={config.outputType || 'webhook'}
                onChange={(e) => updateConfig('outputType', e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="webhook">Webhook</option>
                <option value="slack">Slack</option>
                <option value="discord">Discord</option>
              </select>
            </div>
            <div>
              <Label>Target URL</Label>
              <Input
                value={config.targetUrl || ''}
                onChange={(e) => updateConfig('targetUrl', e.target.value)}
                placeholder="https://hooks.example.com"
              />
            </div>
            <div>
              <Label>Send Variables</Label>
              <Input
                value={config.sendVars?.join(', ') || ''}
                onChange={(e) => updateConfig('sendVars', e.target.value.split(', ').filter(Boolean))}
                placeholder="blog_post"
              />
            </div>
          </div>
        );

      default:
        return <div className="text-gray-500">No properties available</div>;
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            Properties
            <Badge variant="secondary">{selectedNode.type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Node Name</Label>
            <Input
              value={selectedNode.data.label || ''}
              onChange={(e) => updateLabel(e.target.value)}
              placeholder="Enter node name"
            />
          </div>
          
          {renderNodeProperties()}
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicPropertiesPanel;
