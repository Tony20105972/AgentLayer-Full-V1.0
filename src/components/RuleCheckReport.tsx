
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';

interface Violation {
  ruleId: string;
  description: string;
  suggestion: string;
}

interface RuleCheckReportProps {
  violations: Violation[];
}

const RuleCheckReport: React.FC<RuleCheckReportProps> = ({ violations }) => {
  const hasViolations = violations.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Constitution Check</span>
          <Badge variant={hasViolations ? "destructive" : "default"}>
            {hasViolations ? (
              <>
                <AlertTriangle className="w-3 h-3 mr-1" />
                {violations.length} Violations
              </>
            ) : (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Passed
              </>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasViolations ? (
          <div className="space-y-4">
            {violations.map((violation, index) => (
              <div key={index} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-800">Rule Violation</span>
                  <Badge variant="outline" className="text-red-600 border-red-300">
                    {violation.ruleId}
                  </Badge>
                </div>
                <p className="text-sm text-red-700 mb-3">
                  {violation.description}
                </p>
                <div className="bg-red-100 p-3 rounded border border-red-200">
                  <div className="text-xs font-medium text-red-800 mb-1">Suggestion:</div>
                  <div className="text-xs text-red-700">{violation.suggestion}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <div className="text-lg font-semibold text-green-800 mb-2">All Rules Passed</div>
            <div className="text-sm text-green-600">
              The agent execution complied with all constitutional rules.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RuleCheckReport;
