import { useCallback } from 'react';
import Summary from 'components/Layout/Dashboard/Summary/Summary';
import Investments from 'components/Layout/Dashboard/Investments/Investments';
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
  const selectedInvestment = useAppSelector(state => state.dashboard.selectedInvestment);
  const investments = useAppSelector(state => state.dashboard.investments);
  const operation = useAppSelector(state => state.dashboard.operation);

  const closeDialogHandler = useCallback(() => {
    dispatch(hideAll());
  }, [dispatch]);

  const openNewDialogHandler = useCallback(() => {
    closeDialogHandler();
    dispatch(showNewAction());
  }, [closeDialogHandler, dispatch]);

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
