
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AuthButton from './AuthButton';
import AgentMarketplace from './AgentMarketplace';
import DAORewards from './DAORewards';
import { Store, Trophy, Bot } from 'lucide-react';

const WorkflowHeader: React.FC = () => {
  const [activeTab, setActiveTab] = useState('builder');

  return (
    <div className="bg-white border-b border-gray-200">
      <header className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Samantha OS</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Constitutional AI Platform
            </span>
          </div>
          <AuthButton />
        </div>
      </header>

      <div className="px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center space-x-1">
              <Store className="w-4 h-4" />
              <span>Marketplace</span>
            </TabsTrigger>
            <TabsTrigger value="dao" className="flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>DAO</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="builder" className="mt-0">
            {/* Builder content will be rendered by AgentBuilder component */}
          </TabsContent>
          
          <TabsContent value="marketplace" className="mt-6">
            <AgentMarketplace />
          </TabsContent>
          
          <TabsContent value="dao" className="mt-6">
            <DAORewards />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WorkflowHeader;
