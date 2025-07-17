
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles, Download, Upload, Play, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

interface Block {
  id: string;
  type: 'state' | 'node' | 'router' | 'ruleChecker' | 'output';
  name: string;
  config: any;
  position: number;
}

const AgentBuilder: React.FC = () => {
  const { toast } = useToast();

  const saveFlow = async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return toast({ title: "로그인 필요", description: "저장하려면 로그인해야 합니다." });

    const flow = { blocks };
    const { error } = await supabase.from("agent_configs").upsert([
      { user_id: user.data.user.id, flow, updated_at: new Date().toISOString() }
    ], { onConflict: ["user_id"] });

    if (error) toast({ title: "❌ 저장 실패", description: error.message });
    else toast({ title: "✅ 저장 완료", description: "Agent가 저장되었습니다." });
  };


  const loadFlow = async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return;

    const { data } = await supabase.from("agent_configs").select("*").eq("user_id", user.data.user.id).single();
    if (data?.flow?.blocks) {
      setBlocks(data.flow.blocks);
      toast({ title: "✅ 불러오기 성공", description: "이전 구성을 불러왔습니다." });
    }
  };

  useEffect(() => { loadFlow(); }, []);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [crewMode, setCrewMode] = useState(false);
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executingBlockId, setExecutingBlockId] = useState<string | null>(null);

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = {
      id: `${type}-${Date.now()}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${blocks.filter(b => b.type === type).length + 1}`,
      config: getDefaultConfig(type),
      position: blocks.length
    };
    setBlocks([...blocks, newBlock]);
  };

  const getDefaultConfig = (type: Block['type']) => {
    switch (type) {
      case 'state':
        return { initialState: '{\n  "message": "",\n  "context": {}\n}' };
      case 'node':
        return { 
          prompt: 'You are a helpful AI assistant. Process the input and provide a response.',
          inputs: [],
          outputs: ['result'],
          aiModel: 'gpt-4'
        };
      case 'router':
        return { 
          conditions: [
            { name: 'condition1', expression: 'true', description: 'Default condition' }
          ]
        };
      case 'ruleChecker':
        return { 
          rules: [
            { rule_name: 'no_harmful_content', description: 'Prevent harmful or inappropriate content', violation_action: 'block' }
          ]
        };
      case 'output':
        return { 
          destination: 'webhook',
          template: 'Result: {{result}}',
          config: { url: '' }
        };
      default:
        return {};
    }
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const generateFromNaturalLanguage = async () => {
    if (!naturalLanguageInput.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate basic flow based on input
      const generatedBlocks: Block[] = [
        {
          id: 'state-1',
          type: 'state',
          name: 'Initial State',
          config: { initialState: '{\n  "input_text": "",\n  "user_id": ""\n}' },
          position: 0
        },
        {
          id: 'node-1',
          type: 'node',
          name: 'Process Input',
          config: {
            prompt: `Process the following input: {{input_text}}. Provide a helpful response.`,
            inputs: ['input_text'],
            outputs: ['processed_result'],
            aiModel: 'gpt-4'
          },
          position: 1
        },
        {
          id: 'ruleChecker-1',
          type: 'ruleChecker',
          name: 'Rule Checker',
          config: {
            rules: [
              { rule_name: 'no_harmful_content', description: 'Prevent harmful content', violation_action: 'block' },
              { rule_name: 'factual_accuracy', description: 'Ensure factual accuracy', violation_action: 'warn' }
            ]
          },
          position: 2
        },
        {
          id: 'output-1',
          type: 'output',
          name: 'Final Output',
          config: {
            destination: 'webhook',
            template: 'Result: {{processed_result}}',
            config: { url: '' }
          },
          position: 3
        }
      ];
      
      setBlocks(generatedBlocks);
      toast({
        title: "Workflow Generated",
        description: "Successfully generated workflow from natural language description."
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate workflow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const executeWorkflow = async () => {
    if (blocks.length === 0) {
      toast({
        title: "No Workflow",
        description: "Please add blocks to your workflow before executing.",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);
    try {
      // Simulate execution with visual feedback
      for (const block of blocks.sort((a, b) => a.position - b.position)) {
        setExecutingBlockId(block.id);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate rule checker violations
        if (block.type === 'ruleChecker' && Math.random() > 0.8) {
          toast({
            title: "Rule Violation Detected",
            description: `${block.name} found a potential violation.`,
            variant: "destructive"
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      toast({
        title: "Execution Complete",
        description: "Workflow executed successfully!"
      });
    } catch (error) {
      toast({
        title: "Execution Failed",
        description: "Workflow execution encountered an error.",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
      setExecutingBlockId(null);
    }
  };

  const exportWorkflow = () => {
    const workflowData = {
      blocks,
      crewMode,
      metadata: {
        created: new Date().toISOString(),
        version: '1.0'
      }
    };
    
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agent-workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="backdrop-blur-xl bg-white/5 min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Agent Builder</h1>
            <p className="text-slate-300">Create constitutional AI workflows with visual blocks</p>
          </div>

          {/* Natural Language Input */}
          <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Describe Your Agent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={naturalLanguageInput}
                onChange={(e) => setNaturalLanguageInput(e.target.value)}
                placeholder="Build an agent that translates text, checks ethical rules, and sends to Discord..."
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                rows={3}
              />
              <Button 
                onClick={generateFromNaturalLanguage}
                disabled={isGenerating || !naturalLanguageInput.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Generate Workflow
              </Button>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="crew-mode"
                  checked={crewMode}
                  onCheckedChange={setCrewMode}
                />
                <Label htmlFor="crew-mode" className="text-white">Crew AI Mode</Label>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={executeWorkflow}
                  disabled={isExecuting || blocks.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Execute
                </Button>
                <Button 
                  onClick={exportWorkflow}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => addBlock('state')}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                State
              </Button>
              <Button 
                onClick={() => addBlock('node')}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                {crewMode ? 'Role/Task' : 'Node'}
              </Button>
              <Button 
                onClick={() => addBlock('router')}
                size="sm"
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Router
              </Button>
              <Button 
                onClick={() => addBlock('ruleChecker')}
                size="sm"
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Rules
              </Button>
              <Button 
                onClick={() => addBlock('output')}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Output
              </Button>
            </div>
          </div>

          {/* Workflow Blocks */}
          <div className="space-y-6">
            {blocks
              .sort((a, b) => a.position - b.position)
              .map((block) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  crewMode={crewMode}
                  isExecuting={executingBlockId === block.id}
                  onUpdate={(updates) => updateBlock(block.id, updates)}
                  onDelete={() => deleteBlock(block.id)}
                />
              ))}
          </div>

          {blocks.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🤖</div>
              <h3 className="text-2xl font-semibold text-white mb-2">No Blocks Yet</h3>
              <p className="text-slate-400 mb-6">
                Start by describing your agent or add blocks manually
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Block Editor Component
interface BlockEditorProps {
  block: Block;
  crewMode: boolean;
  isExecuting: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ 
  block, 
  crewMode, 
  isExecuting, 
  onUpdate, 
  onDelete 
}) => {
  const getBlockColor = (type: string) => {
    switch (type) {
      case 'state': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
      case 'node': return 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
      case 'router': return 'from-orange-500/20 to-orange-600/20 border-orange-500/30';
      case 'ruleChecker': return 'from-red-500/20 to-red-600/20 border-red-500/30';
      case 'output': return 'from-green-500/20 to-green-600/20 border-green-500/30';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  const executionClass = isExecuting 
    ? 'ring-4 ring-blue-400 ring-opacity-75 animate-pulse' 
    : '';

  return (
    <Card className={`bg-gradient-to-r ${getBlockColor(block.type)} backdrop-blur-sm border ${executionClass} transition-all duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {block.type.toUpperCase()}
          </Badge>
          <Input
            value={block.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="bg-transparent border-none text-white font-semibold text-lg p-0 h-auto focus-visible:ring-0"
          />
        </div>
        <Button
          onClick={onDelete}
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {/* Block-specific content will be rendered here */}
        <div className="text-white/80">
          <p>Block configuration for {block.type}</p>
          {/* Add specific block editors based on type */}
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentBuilder;
