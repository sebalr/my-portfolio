import React, { useContext } from 'react';
import Summary from 'components/Layout/Dashboard/Summary/Summary';
import Investment from 'components/Layout/Dashboard/Investment/Investment';
import { DashboardContext } from 'context/DashboardContext';

const Dashboard = () => {
  const { state } = useContext(DashboardContext);
  return (
    <div>
      <h2>Dashboard</h2>
      <Summary investments={state.investments} />
      <Investment />
      <Investment />
      <Investment />
    </div>
  );
};

export default Dashboard;
