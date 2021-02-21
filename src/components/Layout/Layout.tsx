import { useState, useEffect, useContext } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Container from '@material-ui/core/Container';
import { IAppState } from 'interfaces/state.interfaces';
import Toolbar from 'components/Layout/Toolbar/Toolbar';
import { DashboardContext } from 'context/DashboardContext';
import Dashboard from 'components/Layout/Dashboard/Dashboard';
import AddInvestmentDialog from 'components/Layout/Dashboard/AddInvestmentDialog/AddInvestmentDialog';
import InvestmentsDatabase from 'database/database';

import styles from './Layout.module.css';

const Layout = () => {
  const { updateInvestments } = useContext(DashboardContext);

  const [layoutState, setState] = useState<IAppState>({ addDialogOn: false });

  useEffect(() => {
    const loadDataFromDb = async () => {
      try {
        await InvestmentsDatabase.open();
        const investments = await InvestmentsDatabase.investments.toArray();
        if (updateInvestments) {
          updateInvestments(investments);
        }
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
            <Dashboard />
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
