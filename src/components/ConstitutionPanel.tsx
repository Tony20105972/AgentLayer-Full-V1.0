
import React, { useState } from 'react';

interface ConstitutionRule {
  id: string;
  name: string;
  description: string;
  category: 'privacy' | 'security' | 'ethics' | 'performance' | 'compliance';
  enabled: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  trigger: 'pre' | 'post' | 'both';
}

const defaultRules: ConstitutionRule[] = [
  {
    id: 'privacy-001',
    name: 'Personal Data Protection',
    description: 'Prevent exposure of personal information (email, phone, SSN)',
    category: 'privacy',
    enabled: true,
    severity: 'critical',
    trigger: 'both'
  },
  {
    id: 'security-001',
    name: 'API Key Validation',
    description: 'Ensure all external API calls use valid authentication',
    category: 'security',
    enabled: true,
    severity: 'high',
    trigger: 'pre'
  },
  {
    id: 'ethics-001',
    name: 'Bias Detection',
    description: 'Monitor AI responses for potential bias or discrimination',
    category: 'ethics',
    enabled: true,
    severity: 'medium',
    trigger: 'post'
  },
  {
    id: 'performance-001',
    name: 'Response Time Limit',
    description: 'Ensure responses are generated within 30 seconds',
    category: 'performance',
    enabled: false,
    severity: 'low',
    trigger: 'both'
  },
  {
    id: 'compliance-001',
    name: 'RAG Source Attribution',
    description: 'All RAG responses must include source references',
    category: 'compliance',
    enabled: true,
    severity: 'high',
    trigger: 'post'
  }
];

const ConstitutionPanel = () => {
  const [rules, setRules] = useState<ConstitutionRule[]>(defaultRules);
  const [violations, setViolations] = useState([
    { 
      rule: 'Privacy-001', 
      timestamp: '2024-01-15 14:30', 
      severity: 'high', 
      message: 'Potential PII detected in response',
      nodeId: 'ai-chat-1',
      action: 'blocked'
    },
    { 
      rule: 'Security-001', 
      timestamp: '2024-01-15 12:15', 
      severity: 'medium', 
      message: 'API call without proper authentication',
      nodeId: 'api-call-2',
      action: 'warned'
    },
    { 
      rule: 'Ethics-001', 
      timestamp: '2024-01-15 10:45', 
      severity: 'low', 
      message: 'Potential bias detected in language model response',
      nodeId: 'ai-chat-3',
      action: 'logged'
    }
  ]);

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'privacy': return '🔒';
      case 'security': return '🛡️';
      case 'ethics': return '⚖️';
      case 'performance': return '⚡';
      case 'compliance': return '📋';
      default: return '📋';
    }
  };

  const getTriggerColor = (trigger: string) => {
    switch (trigger) {
      case 'pre': return 'bg-blue-100 text-blue-800';
      case 'post': return 'bg-green-100 text-green-800';
      case 'both': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Constitution Rules</h3>
        <p className="text-sm text-gray-600">
          Governance rules that monitor and control agent behavior
        </p>
      </div>

      {/* Constitution Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="bg-green-50 p-2 rounded-lg text-center">
          <div className="text-lg font-bold text-green-600">{rules.filter(r => r.enabled).length}</div>
          <div className="text-xs text-green-600">Active Rules</div>
        </div>
        <div className="bg-red-50 p-2 rounded-lg text-center">
          <div className="text-lg font-bold text-red-600">{violations.length}</div>
          <div className="text-xs text-red-600">Violations</div>
        </div>
        <div className="bg-blue-50 p-2 rounded-lg text-center">
          <div className="text-lg font-bold text-blue-600">94%</div>
          <div className="text-xs text-blue-600">Compliance</div>
        </div>
      </div>

      {/* Active Rules */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Active Rules</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {rules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span>{getCategoryIcon(rule.category)}</span>
                    <span className="font-medium text-sm text-gray-900">{rule.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(rule.severity)}`}>
                      {rule.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTriggerColor(rule.trigger)}`}>
                      {rule.trigger}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{rule.description}</p>
                </div>
                <label className="flex items-center ml-3">
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => toggleRule(rule.id)}
                    className="rounded text-blue-600"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Violations */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Recent Violations</h4>
        {violations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-sm">No violations detected</div>
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {violations.map((violation, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-red-600">⚠️</span>
                      <span className="font-medium text-sm text-red-900">{violation.rule}</span>
                      <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-xs">
                        {violation.action}
                      </span>
                    </div>
                    <p className="text-xs text-red-700">{violation.message}</p>
                    <p className="text-xs text-red-500 mt-1">
                      Node: {violation.nodeId} • {violation.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Constitution Editor */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Rule Management</h4>
        <div className="space-y-2">
          <button className="w-full p-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            ➕ Add New Rule
          </button>
          <button className="w-full p-2 text-left text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
            📤 Export Constitution
          </button>
          <button className="w-full p-2 text-left text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            📥 Import Rules
          </button>
          <button className="w-full p-2 text-left text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
            🧪 Test Rules
          </button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Alert Settings</h4>
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm text-gray-700">Slack Alerts</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm text-gray-700">Email Reports</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" />
            <span className="text-sm text-gray-700">Real-time Dashboard</span>
          </label>
          <label className="flex items-center space-x-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm text-gray-700">Auto-block Violations</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ConstitutionPanel;
