import { useEffect, useContext } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import Toolbar from 'components/Layout/Toolbar/Toolbar';
import { DashboardContext } from 'context/DashboardContext';
import Dashboard from 'components/Layout/Dashboard/Dashboard';
import InvestmentsDatabase from 'database/database';

const Layout = () => {
  const { updateInvestments } = useContext(DashboardContext);

  useEffect(() => {
    const loadDataFromDb = async () => {
      const investments = await InvestmentsDatabase.investments.toArray();
      updateInvestments!(investments);
    };
    loadDataFromDb();
  }, []);

  return (
    <div>
      <Toolbar />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Container maxWidth="md">
          <main>
            <Dashboard />
          </main>
        </Container>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default Layout;
