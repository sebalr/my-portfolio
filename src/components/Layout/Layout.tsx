import { useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Container from '@material-ui/core/Container';
import Toolbar from 'components/Layout/Toolbar/MyToolbar';
import Dashboard from 'components/Layout/Dashboard/Dashboard';
import { useAppDispatch } from 'store/hooks';
import { loadFromDb } from 'components/Layout/Dashboard/dashboardReducer';

import styles from './Layout.module.css';

const Layout = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadFromDb());
  }, []);

  return (
    <div className={styles.layout}>
      <Toolbar />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <main className={styles.main}>
          <Container maxWidth="md">
            <Dashboard />
          </Container>
        </main>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default Layout;
