import React, { useContext } from 'react';
import Summary from 'components/Layout/Dashboard/Summary/Summary';
import Investment from 'components/Layout/Dashboard/Investment/Investment';
import { DashboardContext } from 'context/DashboardContext';
import Welcome from 'components/Layout/Dashboard/Welcome/Welcome';

const Dashboard = () => {
  const { state } = useContext(DashboardContext);

  let dashboard = <Welcome />;

  if (state.investments.length > 0) {
    dashboard = (
      <>
        <Summary investments={state.investments} />
        { state.investments.map(item => (<Investment key={item.id} investment={item} />))}
      </>
    );
  }
  return (
    <div>
      <h2>Dashboard</h2>
      {dashboard}
    </div>
  );
};

export default Dashboard;
