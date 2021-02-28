import { useEffect, useContext } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import Toolbar from 'components/Layout/Toolbar/MyToolbar';
import { DashboardContext } from 'context/DashboardContext';
import Dashboard from 'components/Layout/Dashboard/Dashboard';
import InvestmentsDatabase from 'database/database';

import styles from './Layout.module.css';

const Layout = () => {
  const { loadDataFromDb } = useContext(DashboardContext);

  useEffect(() => {
    loadDataFromDb!();
  }, []);

  return (
    <div className={styles.layout}>
      <Toolbar />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <main className={styles.main}>
          <Container className={styles.scrollContainer} maxWidth="md">
            <Dashboard />
          </Container>
        </main>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default Layout;
