import React, { useContext, useState } from 'react';
import Summary from 'components/Layout/Dashboard/Summary/Summary';
import Investment from 'components/Layout/Dashboard/Investment/Investment';
import { DashboardContext } from 'context/DashboardContext';
import Welcome from 'components/Layout/Dashboard/Welcome/Welcome';
import UpdateInvestmentDialog from 'components/Dialogs/UpdateInvestmentDialog';
import { IInvestment, InvestmentOperation } from 'common/state.interfaces';
import AddInvestmentDialog from 'components/Dialogs/AddInvestmentDialog';
import NewOperationDialog from 'components/Dialogs/NewOperationDialog';
import ImportDbDialog from 'components/Dialogs/ImportDbDialog';
import { ModalContext } from 'context/ModalContext';

interface IDashboardState {
  selectedInvestment: IInvestment | null;
  operation?: InvestmentOperation;
}

const Dashboard = () => {
  const { dashboardContext: contextState } = useContext(DashboardContext);
  const { dialogsState, openNewDialog, openUpdaeDialog, openNewOperationDialog, closeOpenDialogs } = useContext(ModalContext);

  const [state, setstate] = useState<IDashboardState>({ selectedInvestment: null });

  const openNewDialogHandler = () => {
    openNewDialog!();
  };

  const openUpdateDialogHandler = (investment: IInvestment) => {
    setstate({ selectedInvestment: investment });
    openUpdaeDialog!();
  };

  const openOperationDialogHandler = (investment: IInvestment, operation: InvestmentOperation) => {
    setstate({
      selectedInvestment: investment,
      operation,
    });
    openNewOperationDialog!();
  };

  const closeDialogHandler = () => {
    closeOpenDialogs!();
  };

  let dashboard = <Welcome openAddDialog={openNewDialogHandler} />;

  if (contextState.investments.length > 0) {
    dashboard = (
      <>
        <Summary
          openAddDialog={openNewDialogHandler}
          investments={contextState.investments}
        />
        { contextState.investments.map(item => (
          <Investment
            key={item.id}
            investment={item}
            update={openUpdateDialogHandler}
            newOperation={openOperationDialogHandler}
          />
        ))}
      </>
    );
  }

  const dialogs = state.selectedInvestment ? (
    <>
      <ImportDbDialog
        open={dialogsState.loadDbDialogOn}
        close={closeDialogHandler}
      />
      <AddInvestmentDialog
        open={dialogsState.newDialogOn}
        close={closeDialogHandler}
      />
      <UpdateInvestmentDialog
        open={dialogsState.updateDialogOn}
        investment={state.selectedInvestment!}
        close={closeDialogHandler}
      />
      <NewOperationDialog
        open={dialogsState.newOperationOn}
        investment={state.selectedInvestment!}
        operation={state.operation}
        close={closeDialogHandler}
      />
    </>
  )
    : (
      <>
        <ImportDbDialog
          open={dialogsState.loadDbDialogOn}
          close={closeDialogHandler}
        />
        <AddInvestmentDialog open={dialogsState.newDialogOn} close={closeDialogHandler} />
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
