
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgentOutputDisplayProps {
  result: string;
}

const AgentOutputDisplay: React.FC<AgentOutputDisplayProps> = ({ result }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Agent Output</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-50 border rounded-lg p-4">
          <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
            {result}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentOutputDisplay;
