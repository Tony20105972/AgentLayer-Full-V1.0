import React from 'react';
import ExecutionDashboard from '@/components/ExecutionDashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <ExecutionDashboard />
    </div>
  );
};

export default Dashboard;