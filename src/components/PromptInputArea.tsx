
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, FileText, MessageSquare } from 'lucide-react';

interface PromptInputAreaProps {
  onPromptSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

const PromptInputArea: React.FC<PromptInputAreaProps> = ({ onPromptSubmit, isLoading = false }) => {
  const [prompt, setPrompt] = useState('');

  const samplePrompts = [
    {
      id: 'summary',
      label: 'Summary',
      icon: <FileText className="w-4 h-4" />,
      prompt: 'Create a document summarizer that extracts key points from any text input'
    },
    {
      id: 'summary-translate',
      label: 'Summary → Translation',
      icon: <Sparkles className="w-4 h-4" />,
      prompt: 'Create a workflow that first summarizes text, then translates the summary to Spanish'
    },
    {
      id: 'summary-translate-slack',
      label: 'Summary → Translation → Slack',
      icon: <MessageSquare className="w-4 h-4" />,
      prompt: 'Create a complete workflow: summarize text, translate to Spanish, then send results to Slack'
    }
  ];

  const handleSubmit = (promptText: string) => {
    if (promptText.trim()) {
      onPromptSubmit(promptText.trim());
      setPrompt('');
    }
  };

  const handleSampleClick = (samplePrompt: string) => {
    setPrompt(samplePrompt);
    handleSubmit(samplePrompt);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/50 p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your AI workflow in natural language..."
              className="text-base"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(prompt);
                }
              }}
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={() => handleSubmit(prompt)}
            disabled={!prompt.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              'Generate'
            )}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 font-medium">Quick Start:</span>
          {samplePrompts.map((sample) => (
            <Button
              key={sample.id}
              variant="outline"
              size="sm"
              onClick={() => handleSampleClick(sample.prompt)}
              disabled={isLoading}
              className="flex items-center space-x-2 text-sm hover:bg-blue-50 hover:border-blue-300"
            >
              {sample.icon}
              <span>{sample.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInputArea;
