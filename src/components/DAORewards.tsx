
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DAOGovernance from './DAOGovernance';

// Legacy DAORewards component - keeping for backwards compatibility
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, TrendingUp, Users, Coins, Loader2 } from 'lucide-react';
import { apiService, DAOStats } from '@/services/api';
import { useAccount } from 'wagmi';

const RewardsSection: React.FC = () => {
  const { address } = useAccount();
  const [stats, setStats] = useState<DAOStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const fetchDAOStats = async () => {
      try {
        setLoading(true);
        const daoStats = await apiService.getDAOStats();
        setStats(daoStats);
      } catch (error) {
        console.error('Failed to fetch DAO stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDAOStats();
  }, []);

  const handleClaimRewards = async () => {
    if (!address) {
      console.log('Please connect your wallet first');
      return;
    }

    try {
      setClaiming(true);
      const result = await apiService.claimRewards(address);
      console.log('Rewards claimed:', result);
    } catch (error) {
      console.error('Failed to claim rewards:', error);
    } finally {
      setClaiming(false);
    }
  };

  const getReputationColor = (reputation: number) => {
    if (reputation >= 95) return 'text-green-600';
    if (reputation >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading DAO stats...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">Failed to load DAO stats</div>
        <div className="text-sm text-gray-500">Please try again later</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          onClick={handleClaimRewards}
          disabled={claiming || !address}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          {claiming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Claiming...
            </>
          ) : (
            <>
              <Trophy className="w-4 h-4 mr-2" />
              Claim Rewards
            </>
          )}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.treasuryBalance}</div>
                <div className="text-xs text-gray-500">ETH Treasury</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.totalExecutions}</div>
                <div className="text-xs text-gray-500">Total Executions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.averageReputation}</div>
                <div className="text-xs text-gray-500">Avg Reputation</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">Top 10%</div>
                <div className="text-xs text-gray-500">Your Rank</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Community Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.leaderboard.map((entry) => (
              <div key={entry.address} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {getRankIcon(entry.rank)}
                  </div>
                  <div>
                    <div className="font-medium font-mono">
                      {entry.address}
                    </div>
                    <div className="text-sm text-gray-500">
                      {entry.executions} executions • {entry.violations} violations
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${getReputationColor(entry.reputation)}`}>
                      {entry.reputation}
                    </div>
                    <div className="text-xs text-gray-500">Reputation</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {entry.earnings} ETH
                    </div>
                    <div className="text-xs text-gray-500">Earned</div>
                  </div>
                  
                  <Badge 
                    variant={entry.rank <= 3 ? "default" : "secondary"}
                    className="ml-2"
                  >
                    Rank #{entry.rank}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reputation System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Reputation System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600">
            Your reputation is calculated based on execution success rate and constitutional compliance.
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Successful Executions</span>
              <span className="text-sm font-medium text-green-600">+2 points each</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Constitutional Violations</span>
              <span className="text-sm font-medium text-red-600">-5 points each</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Community Contributions</span>
              <span className="text-sm font-medium text-blue-600">+10 points each</span>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Reputation Progress</span>
              <span className="text-sm text-gray-600">87/100</span>
            </div>
            <Progress value={87} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const DAORewards: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">DAO & Governance</h2>
        <p className="text-gray-600">Community treasury, reputation system, and constitutional governance</p>
      </div>

      <Tabs defaultValue="governance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="rewards">Rewards & Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="governance">
          <DAOGovernance />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DAORewards;
