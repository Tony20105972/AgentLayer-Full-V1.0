
import React, { useState, useEffect } from 'react';
import { ConstitutionRule } from '@/types/AgentState';

interface ConstitutionEngineProps {
  rules: ConstitutionRule[];
  onViolationDetected: (violation: { ruleId: string; message: string; nodeId: string }) => void;
}

const ConstitutionEngine: React.FC<ConstitutionEngineProps> = ({ rules, onViolationDetected }) => {
  const [violations, setViolations] = useState<Array<{
    id: string;
    ruleId: string;
    nodeId: string;
    message: string;
    timestamp: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>>([]);

  const checkConstitution = (nodeId: string, output: any) => {
    const activeRules = rules.filter(rule => rule.enabled);
    
    activeRules.forEach(rule => {
      try {
        // 간단한 규칙 평가 (실제로는 더 복잡한 로직 필요)
        const violationDetected = evaluateRule(rule, output);
        
        if (violationDetected) {
          const violation = {
            id: `violation-${Date.now()}-${Math.random()}`,
            ruleId: rule.id,
            nodeId,
            message: `Rule "${rule.name}" violated: ${rule.description}`,
            timestamp: Date.now(),
            severity: 'medium' as const
          };
          
          setViolations(prev => [...prev, violation]);
          onViolationDetected({
            ruleId: rule.id,
            message: violation.message,
            nodeId
          });
        }
      } catch (error) {
        console.error(`Error evaluating rule ${rule.id}:`, error);
      }
    });
  };

  const evaluateRule = (rule: ConstitutionRule, output: any): boolean => {
    // 간단한 규칙 평가 로직 (실제로는 더 정교한 평가 엔진 필요)
    const outputStr = JSON.stringify(output).toLowerCase();
    
    // 예시 규칙들
    if (rule.condition.includes('pii')) {
      return /email|phone|ssn|address/.test(outputStr);
    }
    
    if (rule.condition.includes('harmful')) {
      return /violence|hate|discrimination/.test(outputStr);
    }
    
    if (rule.condition.includes('length')) {
      return outputStr.length > 1000;
    }
    
    return false;
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Constitution Engine</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-50 p-2 rounded-lg text-center">
            <div className="text-lg font-bold text-green-600">{rules.filter(r => r.enabled).length}</div>
            <div className="text-xs text-green-600">Active Rules</div>
          </div>
          <div className="bg-red-50 p-2 rounded-lg text-center">
            <div className="text-lg font-bold text-red-600">{violations.length}</div>
            <div className="text-xs text-red-600">Violations</div>
          </div>
          <div className="bg-blue-50 p-2 rounded-lg text-center">
            <div className="text-lg font-bold text-blue-600">
              {violations.length === 0 ? '100%' : `${Math.max(0, 100 - (violations.length * 10))}%`}
            </div>
            <div className="text-xs text-blue-600">Compliance</div>
          </div>
        </div>
      </div>

      {/* Recent Violations */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {violations.slice(-5).map((violation) => (
          <div key={violation.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-red-600">⚠️</span>
                  <span className="font-medium text-sm text-red-900">{violation.ruleId}</span>
                  <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs">
                    {violation.severity}
                  </span>
                </div>
                <p className="text-xs text-red-700">{violation.message}</p>
                <p className="text-xs text-red-500 mt-1">
                  Node: {violation.nodeId} • {new Date(violation.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConstitutionEngine;
