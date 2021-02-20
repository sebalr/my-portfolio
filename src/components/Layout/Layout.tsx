import { useState, useEffect } from 'react';
import Dashboard from 'components/Layout/Dashboard/Dashboard';
import Toolbar from 'components/Layout/Toolbar/Toolbar';
import { IAppState, IInvestment } from 'interfaces/state.interfaces';
import InvestmentsDatabase from 'database/database';

const Layout = () => {
  const [layoutState, setState] = useState<IAppState>({ dashboard: { investments: [] as IInvestment[] } });

  useEffect(() => {
    const loadDataFromDb = async () => {
      try {
        await InvestmentsDatabase.open();
        setState({ dashboard: { investments: [] as IInvestment[] } });
      } catch (error) {
        console.log('db error', error);
      }
    };
    loadDataFromDb();
    return InvestmentsDatabase.close();
  }, []);

  return (
    <div>
      <Toolbar />
      <main>
        <Dashboard investments={layoutState.dashboard.investments} />
      </main>
    </div>
  );
};

export default Layout;
