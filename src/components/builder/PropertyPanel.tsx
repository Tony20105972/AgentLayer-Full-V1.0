
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Node } from '@xyflow/react';
import { Settings, FileText, Plus, Trash2 } from 'lucide-react';

interface PropertyPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
  constitution: any;
  onUpdateConstitution: (constitution: any) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  onUpdateNode,
  constitution,
  onUpdateConstitution
}) => {
  const [newRuleName, setNewRuleName] = useState('');

  const addRule = () => {
    if (!newRuleName.trim()) return;
    
    const newRule = {
      rule_name: newRuleName,
      description: 'New rule description',
      violation_action: 'warn' as const
    };
    
    onUpdateConstitution({
      ...constitution,
      rules: [...constitution.rules, newRule]
    });
    
    setNewRuleName('');
  };

  const removeRule = (index: number) => {
    onUpdateConstitution({
      ...constitution,
      rules: constitution.rules.filter((_: any, i: number) => i !== index)
    });
  };

  const updateRule = (index: number, field: string, value: string) => {
    const updatedRules = constitution.rules.map((rule: any, i: number) => 
      i === index ? { ...rule, [field]: value } : rule
    );
    
    onUpdateConstitution({
      ...constitution,
      rules: updatedRules
    });
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      <Tabs defaultValue="properties" className="flex-1">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="properties" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Properties</span>
          </TabsTrigger>
          <TabsTrigger value="constitution" className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Constitution</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 p-4 space-y-4">
          {selectedNode ? (
            <NodePropertyEditor 
              node={selectedNode}
              onUpdate={(updates) => onUpdateNode(selectedNode.id, updates)}
            />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a node to edit properties</p>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="constitution" className="flex-1 p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Constitution Rules</h3>
            
            <div className="space-y-3 mb-4">
              {constitution.rules.map((rule: any, index: number) => (
                <Card key={index} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        value={rule.rule_name}
                        onChange={(e) => updateRule(index, 'rule_name', e.target.value)}
                        className="font-medium"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRule(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={rule.description}
                      onChange={(e) => updateRule(index, 'description', e.target.value)}
                      placeholder="Rule description..."
                      rows={2}
                    />
                    <select
                      value={rule.violation_action}
                      onChange={(e) => updateRule(index, 'violation_action', e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="block">Block</option>
                      <option value="warn">Warn</option>
                      <option value="log">Log</option>
                    </select>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="New rule name..."
                value={newRuleName}
                onChange={(e) => setNewRuleName(e.target.value)}
              />
              <Button onClick={addRule}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const NodePropertyEditor: React.FC<{ node: Node; onUpdate: (updates: any) => void }> = ({
  node,
  onUpdate
}) => {
  const handleConfigUpdate = (field: string, value: any) => {
    onUpdate({
      config: {
        ...node.data.config,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">{node.data.label} Configuration</h3>
        <Badge variant="secondary">{node.type}</Badge>
      </div>

      <div>
        <label className="text-sm font-medium">Node Name</label>
        <Input
          value={node.data.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
        />
      </div>

      {node.type === 'node' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Prompt</label>
            <Textarea
              value={node.data.config?.prompt || ''}
              onChange={(e) => handleConfigUpdate('prompt', e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Model</label>
            <select
              value={node.data.config?.model || 'gpt-4'}
              onChange={(e) => handleConfigUpdate('model', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3">Claude 3</option>
            </select>
          </div>
        </div>
      )}

      {node.type === 'state' && (
        <div>
          <label className="text-sm font-medium">Initial State (JSON)</label>
          <Textarea
            value={node.data.config?.initialState || '{}'}
            onChange={(e) => handleConfigUpdate('initialState', e.target.value)}
            rows={6}
            className="font-mono text-sm"
          />
        </div>
      )}

      {node.type === 'output' && (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Destination</label>
            <select
              value={node.data.config?.destination || 'webhook'}
              onChange={(e) => handleConfigUpdate('destination', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="webhook">Webhook</option>
              <option value="slack">Slack</option>
              <option value="file">File</option>
              <option value="html">HTML</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Template</label>
            <Textarea
              value={node.data.config?.template || ''}
              onChange={(e) => handleConfigUpdate('template', e.target.value)}
              placeholder="Result: {{result}}"
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyPanel;
