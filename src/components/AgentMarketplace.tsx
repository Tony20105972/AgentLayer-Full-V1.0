import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Lock, Star, Download, Search, Filter, TrendingUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService, AgentTemplate } from '@/services/api';
import { useAccount } from 'wagmi';

const AgentMarketplace: React.FC = () => {
  const { address } = useAccount();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAgent, setSelectedAgent] = useState<AgentTemplate | null>(null);
  const [agents, setAgents] = useState<AgentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const categories = ['All', 'Content', 'Language', 'Developer', 'Business', 'Creative'];

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const templates = await apiService.getAgentTemplates();
        setAgents(templates);
      } catch (error) {
        console.error('Failed to fetch agent templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePurchase = async (agent: AgentTemplate) => {
    if (!address) {
      console.log('Please connect your wallet first');
      return;
    }

    try {
      setPurchasing(agent.id);
      const result = await apiService.purchaseTemplate(agent.id, address);
      console.log('Purchase successful:', result);
      // Handle successful purchase (show success message, update UI, etc.)
    } catch (error) {
      console.error('Purchase failed:', error);
      // Handle purchase failure
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading marketplace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Agent Marketplace</h2>
          <p className="text-gray-600">Discover and purchase AI agent templates</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <TrendingUp className="w-3 h-3" />
            <span>{agents.length} Templates</span>
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                    {agent.name}
                  </CardTitle>
                  {agent.isPremium && (
                    <Badge variant="secondary" className="flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Premium</span>
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {agent.description}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {agent.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{agent.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{agent.downloads}</span>
                  </div>
                  <div>
                    {agent.previewNodes} nodes
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      {agent.price} ETH
                    </div>
                    <div className="text-xs text-gray-500">
                      by {agent.creator.slice(0, 6)}...{agent.creator.slice(-4)}
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => setSelectedAgent(agent)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      {selectedAgent && (
                        <>
                          <DialogHeader>
                            <DialogTitle>{selectedAgent.name}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                              {selectedAgent.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-1">
                              {selectedAgent.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Price:</span>
                                <span className="font-bold">{selectedAgent.price} ETH</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Rating:</span>
                                <span className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  <span>{selectedAgent.rating}</span>
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Downloads:</span>
                                <span>{selectedAgent.downloads}</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => handlePurchase(selectedAgent)}
                              disabled={purchasing === selectedAgent.id || !address}
                              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                              {purchasing === selectedAgent.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Purchasing...
                                </>
                              ) : (
                                'Purchase Agent Template'
                              )}
                            </Button>
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
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No agents found</div>
          <div className="text-sm text-gray-500">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
};

export default AgentMarketplace;
