
import React from 'react';
import AgentBuilder from '@/components/AgentBuilder';
import WorkflowHeader from '@/components/WorkflowHeader';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <WorkflowHeader />
      <AgentBuilder />
    </div>
  );
};

export default Index;
