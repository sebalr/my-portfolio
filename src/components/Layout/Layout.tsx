import { useState, useEffect } from 'react';
import Dashboard from 'components/Layout/Dashboard/Dashboard';
import Toolbar from 'components/Layout/Toolbar/Toolbar';
import { IAppState, IInvestment } from 'interfaces/state.interfaces';
import InvestmentsDatabase from 'database/database';
import Container from '@material-ui/core/Container';

const Layout = () => {
  const [layoutState, setState] = useState<IAppState>({ dashboard: { investments: [] as IInvestment[] } });

  useEffect(() => {
    const loadDataFromDb = async () => {
      try {
        await InvestmentsDatabase.open();
        const investments = await InvestmentsDatabase.investments.toArray();
        setState({ dashboard: { investments } });
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
      <Container maxWidth="md">
        <main>
          <Dashboard investments={layoutState.dashboard.investments} />
        </main>
      </Container>
    </div>
  );
};

export default Layout;
