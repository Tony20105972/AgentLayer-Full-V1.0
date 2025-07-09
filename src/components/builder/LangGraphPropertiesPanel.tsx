
import React, { useState } from 'react';
import { Node } from '@xyflow/react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Database, Split, Shield, Send, Sparkles } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('state');

  if (!selectedNode) {
    return (
      <div className="w-96 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No Node Selected</h3>
          <p className="text-sm">Click on a node to configure its properties</p>
        </div>
      </div>
    );
  }

  const updateConfig = (field: string, value: any) => {
    const currentConfig = (selectedNode.data.config as NodeConfig) || {};
    onUpdateNode(selectedNode.id, {
      config: {
        ...currentConfig,
        [field]: value
      }
    });
  };

  const updateLabel = (label: string) => {
    onUpdateNode(selectedNode.id, { label });
  };

  const renderStateTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Shared State Configuration</h3>
        <Database className="w-5 h-5 text-blue-500" />
      </div>
      
      {selectedNode.type === 'state' && (
        <div className="space-y-4">
          <div>
            <Label>Initial State (JSON)</Label>
            <Textarea
              value={(selectedNode.data.config as NodeConfig)?.initialState || '{}'}
              onChange={(e) => updateConfig('initialState', e.target.value)}
              className="font-mono text-sm"
              rows={8}
              placeholder='{\n  "input": "",\n  "context": {},\n  "user_id": ""\n}'
            />
          </div>
          <div>
            <Label>Global Input Variables</Label>
            <Input
              value={(selectedNode.data.config as NodeConfig)?.inputVars?.join(', ') || ''}
              onChange={(e) => updateConfig('inputVars', e.target.value.split(', ').filter(Boolean))}
              placeholder="input, context, user_id"
            />
          </div>
        </div>
      )}
      
      {selectedNode.type !== 'state' && (
        <div className="text-gray-500 text-sm">
          <p>State configuration is only available for State nodes.</p>
          <p className="mt-2">Current global state variables will be accessible to all nodes in the flow.</p>
        </div>
      )}
    </div>
  );

  const renderNodeTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Node Configuration</h3>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{selectedNode.type}</Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOptimizeWithAI(selectedNode.id)}
            className="flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Optimize</span>
          </Button>
        </div>
      </div>

      <div>
        <Label>Node Name</Label>
        <Input
          value={String(selectedNode.data.label || '')}
          onChange={(e) => updateLabel(e.target.value)}
          placeholder="Enter node name"
        />
      </div>

      {selectedNode.type === 'llm' && (
        <div className="space-y-4">
          <div>
            <Label>Prompt Template</Label>
            <Textarea
              value={(selectedNode.data.config as NodeConfig)?.prompt || ''}
              onChange={(e) => updateConfig('prompt', e.target.value)}
              placeholder="Process the following input: {input}"
              rows={4}
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => updateConfig('prompt', `[AI Suggested] ${(selectedNode.data.config as NodeConfig)?.prompt || ''}`)}
              className="mt-2 text-xs"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              AI Suggestion
            </Button>
          </div>
          
          <div>
            <Label>Temperature ({(selectedNode.data.config as NodeConfig)?.temperature || 0.7})</Label>
            <Slider
              value={[(selectedNode.data.config as NodeConfig)?.temperature || 0.7]}
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
              value={(selectedNode.data.config as NodeConfig)?.model || 'gpt-4'}
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
              <Label>Input Variables</Label>
              <Input
                value={(selectedNode.data.config as NodeConfig)?.inputVars?.join(', ') || ''}
                onChange={(e) => updateConfig('inputVars', e.target.value.split(', ').filter(Boolean))}
                placeholder="input"
              />
            </div>
            <div>
              <Label>Output Variables</Label>
              <Input
                value={(selectedNode.data.config as NodeConfig)?.outputVars?.join(', ') || ''}
                onChange={(e) => updateConfig('outputVars', e.target.value.split(', ').filter(Boolean))}
                placeholder="response"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRouterTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Conditional Flow Logic</h3>
        <Split className="w-5 h-5 text-orange-500" />
      </div>
      
      {selectedNode.type === 'router' && (
        <div className="space-y-4">
          <div>
            <Label>Routing Conditions</Label>
            <Textarea
              value={(selectedNode.data.config as NodeConfig)?.conditions as string || ''}
              onChange={(e) => updateConfig('conditions', e.target.value)}
              placeholder={`if response.sentiment == "negative" → moderation_node\nif response.length > 1000 → summary_node\nelse → output_node`}
              rows={6}
            />
            <div className="text-xs text-gray-500 mt-1">
              Use format: if condition → target_node
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Input Variables</Label>
              <Input
                value={(selectedNode.data.config as NodeConfig)?.inputVars?.join(', ') || ''}
                onChange={(e) => updateConfig('inputVars', e.target.value.split(', ').filter(Boolean))}
                placeholder="response"
              />
            </div>
            <div>
              <Label>Output Variables</Label>
              <Input
                value={(selectedNode.data.config as NodeConfig)?.outputVars?.join(', ') || ''}
                onChange={(e) => updateConfig('outputVars', e.target.value.split(', ').filter(Boolean))}
                placeholder="route_decision"
              />
            </div>
          </div>
        </div>
      )}
      
      {selectedNode.type !== 'router' && (
        <div className="text-gray-500 text-sm">
          <p>Router configuration is only available for Router nodes.</p>
          <p className="mt-2">Create conditional logic to direct flow between different nodes.</p>
        </div>
      )}
    </div>
  );

  const renderRuleCheckerTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Constitution Enforcement</h3>
        <Shield className="w-5 h-5 text-red-500" />
      </div>
      
      {selectedNode.type === 'ruleChecker' && (
        <div className="space-y-4">
          <div>
            <Label>Constitution Ruleset</Label>
            <select
              value={(selectedNode.data.config as NodeConfig)?.ruleSetName || 'default_constitution'}
              onChange={(e) => updateConfig('ruleSetName', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="default_constitution">Default Constitution</option>
              <option value="no_bias">No Bias Rules</option>
              <option value="safety_first">Safety First</option>
              <option value="custom">Custom Ruleset</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Input Variables</Label>
              <Input
                value={(selectedNode.data.config as NodeConfig)?.inputVars?.join(', ') || ''}
                onChange={(e) => updateConfig('inputVars', e.target.value.split(', ').filter(Boolean))}
                placeholder="response"
              />
            </div>
            <div>
              <Label>Output Variables</Label>
              <Input
                value={(selectedNode.data.config as NodeConfig)?.outputVars?.join(', ') || ''}
                onChange={(e) => updateConfig('outputVars', e.target.value.split(', ').filter(Boolean))}
                placeholder="compliance_check"
              />
            </div>
          </div>
          
          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="text-sm text-yellow-800">
              🛡️ This node will check all responses against the selected constitution rules
            </div>
          </div>
        </div>
      )}
      
      {selectedNode.type !== 'ruleChecker' && (
        <div className="text-gray-500 text-sm">
          <p>Constitution rules are enforced by RuleChecker nodes.</p>
          <p className="mt-2">All agent outputs will be validated against your constitution.</p>
        </div>
      )}
    </div>
  );

  const renderOutputTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">External Output Channels</h3>
        <Send className="w-5 h-5 text-purple-500" />
      </div>
      
      {selectedNode.type === 'output' && (
        <div className="space-y-4">
          <div>
            <Label>Output Type</Label>
            <select
              value={(selectedNode.data.config as NodeConfig)?.outputType || 'webhook'}
              onChange={(e) => updateConfig('outputType', e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="webhook">Webhook</option>
              <option value="slack">Slack</option>
              <option value="discord">Discord</option>
              <option value="email">Email</option>
            </select>
          </div>
          
          <div>
            <Label>Target URL/Channel</Label>
            <Input
              value={(selectedNode.data.config as NodeConfig)?.targetUrl || ''}
              onChange={(e) => updateConfig('targetUrl', e.target.value)}
              placeholder="https://hooks.slack.com/..."
            />
          </div>
          
          <div>
            <Label>Variables to Send</Label>
            <Input
              value={(selectedNode.data.config as NodeConfig)?.sendVars?.join(', ') || ''}
              onChange={(e) => updateConfig('sendVars', e.target.value.split(', ').filter(Boolean))}
              placeholder="response, metadata"
            />
          </div>
        </div>
      )}
      
      {selectedNode.type !== 'output' && (
        <div className="text-gray-500 text-sm">
          <p>Output configuration is only available for Output nodes.</p>
          <p className="mt-2">Configure external channels to send your agent results.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            LangGraph Properties
            <Badge variant="secondary">{selectedNode.type}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="state" className="text-xs">
                <Database className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="node" className="text-xs">
                <Settings className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="router" className="text-xs">
                <Split className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="rules" className="text-xs">
                <Shield className="w-3 h-3" />
              </TabsTrigger>
              <TabsTrigger value="output" className="text-xs">
                <Send className="w-3 h-3" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="state" className="mt-4">
              {renderStateTab()}
            </TabsContent>
            
            <TabsContent value="node" className="mt-4">
              {renderNodeTab()}
            </TabsContent>
            
            <TabsContent value="router" className="mt-4">
              {renderRouterTab()}
            </TabsContent>
            
            <TabsContent value="rules" className="mt-4">
              {renderRuleCheckerTab()}
            </TabsContent>
            
            <TabsContent value="output" className="mt-4">
              {renderOutputTab()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LangGraphPropertiesPanel;
