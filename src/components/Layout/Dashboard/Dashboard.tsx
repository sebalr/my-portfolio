import { useCallback, useContext } from 'react';
import Summary from 'components/Layout/Dashboard/Summary/Summary';
import Investments from 'components/Layout/Dashboard/Investments/Investments';
import { DashboardContext } from 'context/DashboardContext';
import Welcome from 'components/Layout/Dashboard/Welcome/Welcome';
import UpdateInvestmentDialog from 'components/Dialogs/UpdateInvestmentDialog';
import AddInvestmentDialog from 'components/Dialogs/AddInvestmentDialog';
import NewOperationDialog from 'components/Dialogs/NewOperationDialog';
import ImportDbDialog from 'components/Dialogs/ImportDbDialog';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { showNew as showNewAction, hideAll } from 'store/modal/modalReducer';

const Dashboard = () => {
  const { showNew, showUpdate, showNewOperation, showLoadDb } = useAppSelector(state => state.modal);
  const dispatch = useAppDispatch();
  const { selectedInvestment, investments, operation } = useContext(DashboardContext);

  const closeDialogHandler = useCallback(() => {
    dispatch(hideAll());
  }, []);

  const openNewDialogHandler = useCallback(() => {
    closeDialogHandler();
    dispatch(showNewAction());
  }, []);

  let dashboard = <Welcome openAddDialog={openNewDialogHandler} />;

  if (investments.length > 0) {
    dashboard = (
      <>
        <Summary
          openAddDialog={openNewDialogHandler}
          investments={investments}
        />
        <Investments investments={investments} />
      </>
    );
  }

  const dialogs = selectedInvestment ? (
    <>
      <ImportDbDialog
        open={showLoadDb}
        close={closeDialogHandler}
      />
      <AddInvestmentDialog
        open={showNew}
        close={closeDialogHandler}
      />
      <UpdateInvestmentDialog
        open={showUpdate}
        investment={selectedInvestment!}
        close={closeDialogHandler}
      />
      <NewOperationDialog
        open={showNewOperation}
        investment={selectedInvestment!}
        operation={operation!}
        close={closeDialogHandler}
      />
    </>
  )
    : (
      <>
        <ImportDbDialog
          open={showLoadDb}
          close={closeDialogHandler}
        />
        <AddInvestmentDialog open={showNew} close={closeDialogHandler} />
      </>
    );

  return (
    <>
      {dialogs}
      <h2>Dashboard</h2>
      {dashboard}
    </>
  );
};

export default Dashboard;
