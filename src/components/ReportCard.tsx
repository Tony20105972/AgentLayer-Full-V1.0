
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Violation {
  nodeId: string;
  ruleId: string;
  description: string;
  suggestion: string;
}

interface ReportCardProps {
  executionResult: {
    uuid: string;
    totalScore: number;
    runTime: number;
    violations: Violation[];
    summary: string;
    outputUrl?: string;
    timestamp: number;
  };
}

const ReportCard: React.FC<ReportCardProps> = ({ executionResult }) => {
  const { totalScore, runTime, violations, summary, outputUrl, timestamp } = executionResult;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    return 'D';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl"
    >
      <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">
              Execution Report
            </CardTitle>
            <div className="text-sm text-gray-500">
              {new Date(timestamp).toLocaleString()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score Section */}
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg border-2 ${getScoreColor(totalScore)}`}>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">
                  {totalScore}
                </div>
                <div className="text-sm font-medium">
                  {getScoreGrade(totalScore)} Grade
                </div>
                <div className="text-xs opacity-75">
                  Total Score
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Clock className="w-5 h-5 text-blue-600 mr-1" />
                  <span className="text-2xl font-bold text-blue-600">
                    {runTime}
                  </span>
                </div>
                <div className="text-sm font-medium text-blue-700">
                  Milliseconds
                </div>
                <div className="text-xs text-blue-600">
                  Execution Time
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${violations.length > 0 ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  {violations.length > 0 ? (
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-1" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-green-600 mr-1" />
                  )}
                  <span className={`text-2xl font-bold ${violations.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {violations.length}
                  </span>
                </div>
                <div className={`text-sm font-medium ${violations.length > 0 ? 'text-red-700' : 'text-green-700'}`}>
                  {violations.length > 0 ? 'Violations' : 'Clean Run'}
                </div>
                <div className={`text-xs ${violations.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  Constitution
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h4 className="font-semibold text-gray-900 mb-2">Execution Summary</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Violations Section */}
          {violations.length > 0 && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Constitutional Violations
              </h4>
              <div className="space-y-3">
                {violations.map((violation, index) => (
                  <div key={index} className="bg-white p-3 rounded border border-red-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-red-700">
                        Node: {violation.nodeId}
                      </span>
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                        {violation.ruleId}
                      </span>
                    </div>
                    <p className="text-sm text-red-600 mb-2">
                      {violation.description}
                    </p>
                    <div className="text-xs text-red-500 italic bg-red-50 p-2 rounded">
                      💡 {violation.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Download Section */}
          {outputUrl && (
            <div className="flex justify-center">
              <Button
                onClick={() => window.open(outputUrl, '_blank')}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Download Report (HTML)</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReportCard;
