
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import VisualAgentBuilder from '@/components/VisualAgentBuilder';

const Builder: React.FC = () => {
  return (
    <div className="h-screen overflow-hidden">
      <VisualAgentBuilder />
      <Toaster />
    </div>
  );
};

export default Builder;
