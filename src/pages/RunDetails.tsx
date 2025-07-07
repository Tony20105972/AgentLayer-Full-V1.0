
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, AlertTriangle, CheckCircle, Play, Clock } from 'lucide-react';
import FlowViewer from '@/components/FlowViewer';
import RuleCheckReport from '@/components/RuleCheckReport';
import AgentOutputDisplay from '@/components/AgentOutputDisplay';

interface ExecutionDetails {
  uuid: string;
  flow: any;
  result: string;
  violations: Array<{
    ruleId: string;
    description: string;
    suggestion: string;
  }>;
  timestamp: number;
  success: boolean;
  runTime: number;
}

const RunDetails: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [execution, setExecution] = useState<ExecutionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExecution = async () => {
      setIsLoading(true);
      try {
        // Mock API call - replace with actual endpoint
        const mockExecution: ExecutionDetails = {
          uuid: uuid || '',
          flow: {
            nodes: [
              { id: 'start', type: 'start', position: { x: 0, y: 0 } },
              { id: 'agent', type: 'agent', position: { x: 200, y: 0 } },
              { id: 'end', type: 'end', position: { x: 400, y: 0 } }
            ],
            edges: [
              { id: 'e1', source: 'start', target: 'agent' },
              { id: 'e2', source: 'agent', target: 'end' }
            ]
          },
          result: 'Agent executed successfully and generated a comprehensive response.',
          violations: Math.random() > 0.5 ? [] : [
            {
              ruleId: 'ETHICAL_001',
              description: 'Agent response contained potentially biased language',
              suggestion: 'Review the prompt to ensure neutral tone'
            }
          ],
          timestamp: Date.now(),
          success: Math.random() > 0.3,
          runTime: 1200 + Math.random() * 2000
        };
        
        setTimeout(() => {
          setExecution(mockExecution);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch execution:', error);
        setIsLoading(false);
      }
    };

    if (uuid) {
      fetchExecution();
    }
  }, [uuid]);

  const downloadReport = () => {
    if (!execution) return;
    
    const report = {
      uuid: execution.uuid,
      timestamp: new Date(execution.timestamp).toISOString(),
      success: execution.success,
      runTime: execution.runTime,
      violations: execution.violations,
      result: execution.result
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution-${execution.uuid}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-lg font-semibold text-gray-900">Loading Execution Details</div>
        </div>
      </div>
    );
  }

  if (!execution) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 mb-2">Execution Not Found</div>
          <div className="text-gray-600">UUID: {uuid}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Execution Report</h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge variant={execution.success ? "default" : "destructive"}>
                {execution.success ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Success
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Failed
                  </>
                )}
              </Badge>
              <span className="text-sm text-gray-600">
                UUID: {execution.uuid}
              </span>
              <span className="text-sm text-gray-600">
                {new Date(execution.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
          <Button onClick={downloadReport} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{execution.runTime}ms</div>
                  <div className="text-sm text-gray-600">Execution Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  execution.violations.length === 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {execution.violations.length === 0 ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{execution.violations.length}</div>
                  <div className="text-sm text-gray-600">Violations</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Play className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {execution.success ? '100%' : '0%'}
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flow Viewer */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agent Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <FlowViewer flow={execution.flow} />
              </CardContent>
            </Card>
            
            <RuleCheckReport violations={execution.violations} />
          </div>

          {/* Output Display */}
          <div>
            <AgentOutputDisplay result={execution.result} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunDetails;
