import { useState, useEffect } from 'react';
import Dashboard from 'components/Layout/Dashboard/Dashboard';
import Toolbar from 'components/Layout/Toolbar/Toolbar';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { IAppState, IInvestment } from 'interfaces/state.interfaces';
import AddInvestmentDialog from 'components/Layout/Dashboard/AddInvestmentDialog/AddInvestmentDialog';
import InvestmentsDatabase from 'database/database';
import Container from '@material-ui/core/Container';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import styles from './Layout.module.css';

const Layout = () => {
  const [layoutState, setState] = useState<IAppState>({
    dashboard: { investments: [] as IInvestment[] },
    addDialogOn: false,
  });

  useEffect(() => {
    const loadDataFromDb = async () => {
      try {
        await InvestmentsDatabase.open();
        const investments = await InvestmentsDatabase.investments.toArray();
        setState({ dashboard: { investments }, addDialogOn: false });
      } catch (error) {
        console.log('db error', error);
      }
    };
    loadDataFromDb();
    return InvestmentsDatabase.close();
  }, []);

  const addClickHandler = () => {
    setState({ ...layoutState, addDialogOn: true });
  };

  const addCloseHandler = () => {
    setState({ ...layoutState, addDialogOn: false });
  };

  return (
    <div>
      <Toolbar />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>

        <Container maxWidth="md">
          <main>
            <AddInvestmentDialog open={layoutState.addDialogOn} close={addCloseHandler} />
            <Dashboard investments={layoutState.dashboard.investments} />
            <Fab onClick={addClickHandler} className={styles.floating} color="primary" aria-label="add">
              <AddIcon />
            </Fab>
          </main>
        </Container>
      </MuiPickersUtilsProvider>
    </div>
  );
};

export default Layout;
