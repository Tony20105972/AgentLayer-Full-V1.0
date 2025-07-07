
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Shield, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConstitutionUploaderProps {
  constitution: string;
  onConstitutionChange: (constitution: string) => void;
}

const defaultConstitution = `# AI Agent Constitution

## Core Principles
1. Be helpful, harmless, and honest
2. Respect user privacy and data
3. Avoid generating harmful or illegal content
4. Maintain neutrality on controversial topics
5. Acknowledge limitations and uncertainty

## Prohibited Actions
- Generate hate speech or discriminatory content
- Provide instructions for illegal activities
- Share or request personal information
- Impersonate individuals or organizations
- Generate misleading or false information

## Required Behaviors
- Always disclose AI nature when relevant
- Cite sources when providing factual information
- Ask for clarification when requests are ambiguous
- Provide balanced perspectives on complex topics
- Respect intellectual property rights`;

const ConstitutionUploader: React.FC<ConstitutionUploaderProps> = ({
  constitution,
  onConstitutionChange
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (file.type === 'application/json') {
          const parsed = JSON.parse(content);
          onConstitutionChange(parsed.constitution || content);
        } else {
          onConstitutionChange(content);
        }
        toast({
          title: "Constitution Loaded",
          description: "Successfully loaded constitution from file."
        });
      } catch (error) {
        toast({
          title: "Error Loading File",
          description: "Failed to parse the uploaded file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const loadDefault = () => {
    onConstitutionChange(defaultConstitution);
    toast({
      title: "Default Constitution Loaded",
      description: "Loaded the default AI ethics constitution."
    });
  };

  const saveConstitution = () => {
    localStorage.setItem('agentlayer_constitution', constitution);
    setIsEditing(false);
    toast({
      title: "Constitution Saved",
      description: "Constitution has been saved locally."
    });
  };

  React.useEffect(() => {
    const saved = localStorage.getItem('agentlayer_constitution');
    if (saved) {
      onConstitutionChange(saved);
    } else {
      onConstitutionChange(defaultConstitution);
    }
  }, [onConstitutionChange]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Constitution</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('constitution-file')?.click()}
            className="flex items-center space-x-1"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadDefault}
            className="flex items-center space-x-1"
          >
            <FileText className="w-4 h-4" />
            <span>Default</span>
          </Button>
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={saveConstitution}
              className="flex items-center space-x-1"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </Button>
          )}
        </div>

        <input
          id="constitution-file"
          type="file"
          accept=".txt,.md,.json"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="space-y-2">
          <Label>Constitution Rules</Label>
          {isEditing ? (
            <Textarea
              value={constitution}
              onChange={(e) => onConstitutionChange(e.target.value)}
              placeholder="Enter your AI agent constitution..."
              className="min-h-64 font-mono text-sm"
            />
          ) : (
            <div className="border rounded-lg p-4 bg-gray-50 min-h-64 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {constitution || 'No constitution loaded'}
              </pre>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500">
          The constitution defines ethical guidelines and rules that your AI agent must follow during execution.
        </div>
      </CardContent>
    </Card>
  );
};

export default ConstitutionUploader;
