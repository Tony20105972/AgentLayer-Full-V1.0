import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Vote, 
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  MessageSquare,
  Users,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected';
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  endDate: string;
  constitutionChanges?: {
    before: string;
    after: string;
  };
  comments: Array<{
    author: string;
    content: string;
    timestamp: string;
  }>;
}

interface ConstitutionRule {
  rule_name: string;
  description: string;
  violation_action: 'block' | 'warn' | 'log';
}

const DAOGovernance: React.FC = () => {
  const { address } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'Add Privacy Protection Rule',
      description: 'Proposal to add a new constitutional rule preventing agents from processing or storing personal information without explicit consent.',
      proposer: '0x1234...5678',
      status: 'active',
      votes: { for: 127, against: 23, abstain: 8 },
      endDate: '2024-01-22T00:00:00Z',
      constitutionChanges: {
        before: '{\n  "rules": [\n    {\n      "rule_name": "no_harmful_content",\n      "description": "Prevent harmful content",\n      "violation_action": "block"\n    }\n  ]\n}',
        after: '{\n  "rules": [\n    {\n      "rule_name": "no_harmful_content",\n      "description": "Prevent harmful content",\n      "violation_action": "block"\n    },\n    {\n      "rule_name": "privacy_protection",\n      "description": "Prevent processing personal data without consent",\n      "violation_action": "block"\n    }\n  ]\n}'
      },
      comments: [
        {
          author: '0xabcd...efgh',
          content: 'This is essential for GDPR compliance. Strong support from me.',
          timestamp: '2024-01-16T10:30:00Z'
        }
      ]
    },
    {
      id: '2',
      title: 'Increase Violation Penalty',
      description: 'Proposal to increase the reputation penalty for constitutional violations from -5 to -10 points.',
      proposer: '0x9876...4321',
      status: 'passed',
      votes: { for: 89, against: 45, abstain: 12 },
      endDate: '2024-01-10T00:00:00Z',
      comments: []
    }
  ]);

  const [currentConstitution] = useState<ConstitutionRule[]>([
    {
      rule_name: 'no_harmful_content',
      description: 'Prevent generation of harmful or dangerous content',
      violation_action: 'block'
    },
    {
      rule_name: 'factual_accuracy',
      description: 'Ensure responses are factually accurate',
      violation_action: 'warn'
    },
    {
      rule_name: 'respect_privacy',
      description: 'Do not process or store personal information',
      violation_action: 'block'
    }
  ]);

  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    constitutionChanges: ''
  });

  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [newComment, setNewComment] = useState('');

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusBadge = (status: Proposal['status']) => {
    const variants = {
      active: 'bg-blue-100 text-blue-800',
      passed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const handleVote = (proposalId: string, voteType: 'for' | 'against' | 'abstain') => {
    if (!address) {
      console.log('Please connect your wallet to vote');
      return;
    }
    
    setProposals(props => props.map(p => 
      p.id === proposalId 
        ? { ...p, votes: { ...p.votes, [voteType]: p.votes[voteType] + 1 } }
        : p
    ));
  };

  const handleSubmitProposal = () => {
    if (!address || !newProposal.title || !newProposal.description) {
      return;
    }

    const proposal: Proposal = {
      id: Date.now().toString(),
      title: newProposal.title,
      description: newProposal.description,
      proposer: address,
      status: 'active',
      votes: { for: 0, against: 0, abstain: 0 },
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      comments: []
    };

    setProposals(prev => [proposal, ...prev]);
    setNewProposal({ title: '', description: '', constitutionChanges: '' });
  };

  const handleAddComment = () => {
    if (!selectedProposal || !newComment.trim() || !address) return;

    const comment = {
      author: address,
      content: newComment,
      timestamp: new Date().toISOString()
    };

    setProposals(props => props.map(p => 
      p.id === selectedProposal.id 
        ? { ...p, comments: [...p.comments, comment] }
        : p
    ));

    setSelectedProposal(prev => prev ? { ...prev, comments: [...prev.comments, comment] } : null);
    setNewComment('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">DAO Governance</h2>
          <p className="text-gray-600">Community voting for constitution rules and proposals</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Proposal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Proposal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newProposal.title}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Proposal title..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your proposal..."
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Constitution Changes (Optional)</label>
                <Textarea
                  value={newProposal.constitutionChanges}
                  onChange={(e) => setNewProposal(prev => ({ ...prev, constitutionChanges: e.target.value }))}
                  placeholder="JSON of proposed constitution changes..."
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleSubmitProposal}
                disabled={!address || !newProposal.title || !newProposal.description}
                className="w-full"
              >
                Submit Proposal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="proposals" className="space-y-6">
        <TabsList>
          <TabsTrigger value="proposals">Active Proposals</TabsTrigger>
          <TabsTrigger value="constitution">Current Constitution</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="space-y-4">
          {proposals.map((proposal, index) => (
            <motion.div
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center space-x-2">
                        {getStatusIcon(proposal.status)}
                        <span>{proposal.title}</span>
                      </CardTitle>
                      <p className="text-gray-600">{proposal.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}</span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Ends {new Date(proposal.endDate).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                    {getStatusBadge(proposal.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Vote Counts */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{proposal.votes.for}</div>
                      <div className="text-sm text-green-700">For</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{proposal.votes.against}</div>
                      <div className="text-sm text-red-700">Against</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{proposal.votes.abstain}</div>
                      <div className="text-sm text-gray-700">Abstain</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    {proposal.status === 'active' && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleVote(proposal.id, 'for')}
                          disabled={!address}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Vote className="w-4 h-4 mr-1" />
                          Vote For
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVote(proposal.id, 'against')}
                          disabled={!address}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Vote Against
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVote(proposal.id, 'abstain')}
                          disabled={!address}
                        >
                          Abstain
                        </Button>
                      </div>
                    )}

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProposal(proposal)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          View Details ({proposal.comments.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-3xl">
                        {selectedProposal && (
                          <>
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                {getStatusIcon(selectedProposal.status)}
                                <span>{selectedProposal.title}</span>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div>
                                <p className="text-gray-600">{selectedProposal.description}</p>
                              </div>

                              {selectedProposal.constitutionChanges && (
                                <div>
                                  <h4 className="font-medium mb-2">Constitutional Changes</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">Before</label>
                                      <pre className="mt-1 p-3 bg-red-50 rounded text-xs overflow-auto">
                                        {selectedProposal.constitutionChanges.before}
                                      </pre>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-500">After</label>
                                      <pre className="mt-1 p-3 bg-green-50 rounded text-xs overflow-auto">
                                        {selectedProposal.constitutionChanges.after}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Comments */}
                              <div>
                                <h4 className="font-medium mb-3">Discussion</h4>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                  {selectedProposal.comments.map((comment, idx) => (
                                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm">
                                          {comment.author.slice(0, 6)}...{comment.author.slice(-4)}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {new Date(comment.timestamp).toLocaleString()}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700">{comment.content}</p>
                                    </div>
                                  ))}
                                </div>

                                {address && selectedProposal.status === 'active' && (
                                  <div className="mt-3 flex space-x-2">
                                    <Textarea
                                      value={newComment}
                                      onChange={(e) => setNewComment(e.target.value)}
                                      placeholder="Add your comment..."
                                      rows={2}
                                      className="flex-1"
                                    />
                                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                                      Post
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="constitution">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Current Constitution (v1.2.0)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentConstitution.map((rule, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{rule.rule_name}</h4>
                      <Badge variant={rule.violation_action === 'block' ? 'destructive' : 'secondary'}>
                        {rule.violation_action}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm">{rule.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DAOGovernance;