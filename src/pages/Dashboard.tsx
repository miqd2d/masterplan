
import React from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import Layout from '@/components/layout/Layout';

const DashboardPage = () => {
  return (
    <Layout>
      <div className="p-6">
        <Dashboard />
      </div>
    </Layout>
  );
};

export default DashboardPage;
