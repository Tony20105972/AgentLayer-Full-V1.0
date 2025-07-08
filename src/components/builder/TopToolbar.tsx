
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Textarea } from '@/components/ui/textarea';
import { Play, Key, Save, Download, Sparkles, Loader2 } from 'lucide-react';
import { useFlowStore } from '@/stores/flowStore';
import { useToast } from '@/hooks/use-toast';

interface TopToolbarProps {
  nodes: any[];
  edges: any[];
  onExecute: () => void;
  isExecuting: boolean;
  onGenerateFlow: (prompt: string) => void;
}

const TopToolbar: React.FC<TopToolbarProps> = ({
  nodes,
  edges,
  onExecute,
  isExecuting,
  onGenerateFlow
}) => {
  const [apiKeysOpen, setApiKeysOpen] = useState(false);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [generatePrompt, setGeneratePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { apiKeys, setApiKey, exportFlow } = useFlowStore();
  const { toast } = useToast();

  const handleGenerateFlow = async () => {
    if (!generatePrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      onGenerateFlow(generatePrompt);
      setGenerateOpen(false);
      setGeneratePrompt('');
      toast({
        title: "Flow Generated",
        description: "AI agent flow has been created successfully!"
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate flow. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFlow = () => {
    localStorage.setItem('agentlayer-current-flow', JSON.stringify({
      nodes,
      edges,
      timestamp: new Date().toISOString()
    }));
    
    toast({
      title: "Flow Saved",
      description: "Your agent flow has been saved locally."
    });
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-gray-900">AgentLayer Builder</h1>
        
        <Dialog open={generateOpen} onOpenChange={setGenerateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Generate</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Generate Agent Flow</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Describe your AI agent... (e.g., 'Create an agent that summarizes emails and filters inappropriate content')"
                value={generatePrompt}
                onChange={(e) => setGeneratePrompt(e.target.value)}
                rows={4}
              />
              <Button 
                onClick={handleGenerateFlow}
                disabled={!generatePrompt.trim() || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Flow
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-3">
        <Drawer open={apiKeysOpen} onOpenChange={setApiKeysOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">
              <Key className="w-4 h-4 mr-2" />
              API Keys
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Configure API Keys</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-4">
              <div>
                <label className="text-sm font-medium">OpenAI API Key</label>
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={apiKeys.openai || ''}
                  onChange={(e) => setApiKey('openai', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Anthropic API Key</label>
                <Input
                  type="password"
                  placeholder="sk-ant-..."
                  value={apiKeys.anthropic || ''}
                  onChange={(e) => setApiKey('anthropic', e.target.value)}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>

        <Button variant="outline" size="sm" onClick={handleSaveFlow}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button variant="outline" size="sm" onClick={() => exportFlow(nodes, edges)}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>

        <Button 
          onClick={onExecute}
          disabled={isExecuting || nodes.length === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Flow
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TopToolbar;
