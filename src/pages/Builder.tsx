
import React, { useState } from 'react';
import AgentBuilder from '@/components/AgentBuilder';

const Builder: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <AgentBuilder />
    </div>
  );
};

export default Builder;
