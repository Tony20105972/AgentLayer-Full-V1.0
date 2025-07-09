
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  Save,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface ConstitutionRule {
  id: string;
  rule_name: string;
  description: string;
  violation_action: 'block' | 'warn' | 'log';
  severity: 'high' | 'medium' | 'low';
  category: string;
}

const Constitution: React.FC = () => {
  const [rules, setRules] = useState<ConstitutionRule[]>([
    {
      id: '1',
      rule_name: 'no_harmful_content',
      description: 'Prevent generation of harmful, dangerous, or illegal content',
      violation_action: 'block',
      severity: 'high',
      category: 'Safety'
    },
    {
      id: '2',
      rule_name: 'factual_accuracy',
      description: 'Ensure responses are factually accurate and well-sourced',
      violation_action: 'warn',
      severity: 'medium',
      category: 'Quality'
    },
    {
      id: '3',
      rule_name: 'no_bias',
      description: 'Avoid discriminatory or biased language and content',
      violation_action: 'warn',
      severity: 'high',
      category: 'Ethics'
    }
  ]);

  const [newRule, setNewRule] = useState<Partial<ConstitutionRule>>({
    rule_name: '',
    description: '',
    violation_action: 'warn',
    severity: 'medium',
    category: ''
  });

  const [jsonView, setJsonView] = useState(false);

  const addRule = () => {
    if (!newRule.rule_name || !newRule.description) return;
    
    const rule: ConstitutionRule = {
      id: Date.now().toString(),
      rule_name: newRule.rule_name,
      description: newRule.description,
      violation_action: newRule.violation_action as 'block' | 'warn' | 'log',
      severity: newRule.severity as 'high' | 'medium' | 'low',
      category: newRule.category || 'General'
    };
    
    setRules([...rules, rule]);
    setNewRule({
      rule_name: '',
      description: '',
      violation_action: 'warn',
      severity: 'medium',
      category: ''
    });
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
  };

  const updateRule = (id: string, field: keyof ConstitutionRule, value: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, [field]: value } : rule
    ));
  };

  const exportConstitution = () => {
    const constitution = {
      version: "1.0",
      name: "Agent Constitution",
      created_at: new Date().toISOString(),
      rules: rules.map(({ id, ...rule }) => rule)
    };
    
    const blob = new Blob([JSON.stringify(constitution, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `constitution-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'block': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'log': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Constitution Manager</h1>
                <p className="text-gray-600">Define and manage AI constitutional rules</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setJsonView(!jsonView)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>{jsonView ? 'Visual View' : 'JSON View'}</span>
              </Button>
              
              <Button
                onClick={exportConstitution}
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>

        {!jsonView ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add New Rule */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Add New Rule</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Rule Name</label>
                    <Input
                      value={newRule.rule_name || ''}
                      onChange={(e) => setNewRule({...newRule, rule_name: e.target.value})}
                      placeholder="e.g., no_personal_info"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={newRule.description || ''}
                      onChange={(e) => setNewRule({...newRule, description: e.target.value})}
                      placeholder="Describe what this rule enforces..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={newRule.category || ''}
                      onChange={(e) => setNewRule({...newRule, category: e.target.value})}
                      placeholder="e.g., Safety, Ethics, Quality"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Severity</label>
                      <select
                        value={newRule.severity || 'medium'}
                        onChange={(e) => setNewRule({...newRule, severity: e.target.value as any})}
                        className="w-full p-2 border rounded"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Action</label>
                      <select
                        value={newRule.violation_action || 'warn'}
                        onChange={(e) => setNewRule({...newRule, violation_action: e.target.value as any})}
                        className="w-full p-2 border rounded"
                      >
                        <option value="block">Block</option>
                        <option value="warn">Warn</option>
                        <option value="log">Log</option>
                      </select>
                    </div>
                  </div>
                  
                  <Button
                    onClick={addRule}
                    className="w-full"
                    disabled={!newRule.rule_name || !newRule.description}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rule
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Rules List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Constitution Rules ({rules.length})</span>
                    <Badge variant="secondary">Active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rules.map((rule) => (
                      <div key={rule.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Input
                              value={rule.rule_name}
                              onChange={(e) => updateRule(rule.id, 'rule_name', e.target.value)}
                              className="font-medium"
                            />
                            <Badge className={getSeverityColor(rule.severity)}>
                              {rule.severity}
                            </Badge>
                            <Badge variant="outline" className="flex items-center space-x-1">
                              {getActionIcon(rule.violation_action)}
                              <span>{rule.violation_action}</span>
                            </Badge>
                          </div>
                          
                          <Button
                            onClick={() => deleteRule(rule.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Textarea
                          value={rule.description}
                          onChange={(e) => updateRule(rule.id, 'description', e.target.value)}
                          rows={2}
                          className="mb-2"
                        />
                        
                        <div className="flex items-center space-x-4">
                          <div>
                            <label className="text-xs text-gray-500">Category</label>
                            <Input
                              value={rule.category}
                              onChange={(e) => updateRule(rule.id, 'category', e.target.value)}
                              className="text-sm"
                            />
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-500">Severity</label>
                            <select
                              value={rule.severity}
                              onChange={(e) => updateRule(rule.id, 'severity', e.target.value)}
                              className="p-1 border rounded text-sm"
                            >
                              <option value="high">High</option>
                              <option value="medium">Medium</option>
                              <option value="low">Low</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-500">Action</label>
                            <select
                              value={rule.violation_action}
                              onChange={(e) => updateRule(rule.id, 'violation_action', e.target.value)}
                              className="p-1 border rounded text-sm"
                            >
                              <option value="block">Block</option>
                              <option value="warn">Warn</option>
                              <option value="log">Log</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Constitution JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
                {JSON.stringify({
                  version: "1.0",
                  name: "Agent Constitution",
                  created_at: new Date().toISOString(),
                  rules: rules.map(({ id, ...rule }) => rule)
                }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Constitution;
