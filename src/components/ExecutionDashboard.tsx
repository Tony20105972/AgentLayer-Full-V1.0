import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play, 
  Eye, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Shield,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';

interface ExecutionRun {
  id: string;
  uuid: string;
  agentName: string;
  status: 'completed' | 'failed' | 'running';
  startTime: string;
  endTime?: string;
  duration: number;
  violations: Array<{
    rule: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  input: string;
  output?: string;
  constitutionVersion: string;
}

const ExecutionDashboard: React.FC = () => {
  const [runs, setRuns] = useState<ExecutionRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<ExecutionRun | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockRuns: ExecutionRun[] = [
      {
        id: '1',
        uuid: 'run-abc123',
        agentName: 'Email Summarizer',
        status: 'completed',
        startTime: '2024-01-15T10:30:00Z',
        endTime: '2024-01-15T10:31:23Z',
        duration: 83,
        violations: [],
        input: 'Summarize the latest quarterly report email',
        output: 'Q4 revenue increased 15% to $2.3M. Key highlights: new product launch successful, customer retention at 94%.',
        constitutionVersion: 'v1.2.0'
      },
      {
        id: '2',
        uuid: 'run-def456',
        agentName: 'Content Moderator',
        status: 'failed',
        startTime: '2024-01-15T09:15:00Z',
        endTime: '2024-01-15T09:15:45Z',
        duration: 45,
        violations: [
          {
            rule: 'no_harmful_content',
            description: 'Detected potentially harmful language patterns',
            severity: 'high'
          }
        ],
        input: 'Review this user comment for publication',
        output: undefined,
        constitutionVersion: 'v1.2.0'
      },
      {
        id: '3',
        uuid: 'run-ghi789',
        agentName: 'Translation Bot',
        status: 'running',
        startTime: '2024-01-15T11:00:00Z',
        duration: 30,
        violations: [],
        input: 'Translate technical documentation to Spanish',
        constitutionVersion: 'v1.2.0'
      }
    ];

    setTimeout(() => {
      setRuns(mockRuns);
      setLoading(false);
    }, 1000);
  }, []);

  const stats = {
    totalRuns: runs.length,
    successRate: runs.filter(r => r.status === 'completed').length / runs.length * 100,
    totalViolations: runs.reduce((acc, run) => acc + run.violations.length, 0),
    avgDuration: runs.reduce((acc, run) => acc + run.duration, 0) / runs.length
  };

  const getStatusIcon = (status: ExecutionRun['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
    }
  };

  const getStatusBadge = (status: ExecutionRun['status']) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleReplay = (run: ExecutionRun) => {
    // Navigate to builder with preloaded run configuration
    console.log('Replaying run:', run.uuid);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Execution Dashboard</h2>
          <p className="text-gray-600">Monitor AI agent runs and constitutional compliance</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalRuns}</div>
                  <div className="text-sm text-gray-500">Total Runs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.successRate.toFixed(1)}%</div>
                  <div className="text-sm text-gray-500">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.totalViolations}</div>
                  <div className="text-sm text-gray-500">Rule Violations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stats.avgDuration.toFixed(0)}s</div>
                  <div className="text-sm text-gray-500">Avg Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Runs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Recent Agent Runs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {runs.map((run, index) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {getStatusIcon(run.status)}
                  <div>
                    <div className="font-medium text-gray-900">{run.agentName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(run.startTime).toLocaleString()} • {run.duration}s
                    </div>
                    {run.violations.length > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">
                          {run.violations.length} violation{run.violations.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(run.status)}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRun(run)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Report
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                      {selectedRun && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="flex items-center space-x-2">
                              {getStatusIcon(selectedRun.status)}
                              <span>Execution Report: {selectedRun.agentName}</span>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Run ID</label>
                                <div className="font-mono text-sm">{selectedRun.uuid}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Status</label>
                                <div>{getStatusBadge(selectedRun.status)}</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Duration</label>
                                <div>{selectedRun.duration}s</div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-500">Constitution</label>
                                <div>{selectedRun.constitutionVersion}</div>
                              </div>
                            </div>

                            {/* Input/Output */}
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Input</label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm">
                                  {selectedRun.input}
                                </div>
                              </div>
                              {selectedRun.output && (
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Output</label>
                                  <div className="mt-1 p-3 bg-green-50 rounded-lg text-sm">
                                    {selectedRun.output}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Violations */}
                            {selectedRun.violations.length > 0 && (
                              <div>
                                <label className="text-sm font-medium text-gray-500 mb-2 block">
                                  Constitutional Violations
                                </label>
                                <div className="space-y-2">
                                  {selectedRun.violations.map((violation, idx) => (
                                    <div key={idx} className="p-3 bg-red-50 rounded-lg border border-red-200">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-red-900">{violation.rule}</span>
                                        <Badge className={getSeverityColor(violation.severity)}>
                                          {violation.severity}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-red-700">{violation.description}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex justify-end space-x-2 pt-4 border-t">
                              <Button
                                variant="outline"
                                onClick={() => handleReplay(selectedRun)}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Replay Run
                              </Button>
                              <Button>
                                Download Report
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExecutionDashboard;