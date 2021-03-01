import React, { useContext } from 'react';
import Summary from 'components/Layout/Dashboard/Summary/Summary';
import Investments from 'components/Layout/Dashboard/Investments/Investments';
import { DashboardContext } from 'context/DashboardContext';
import Welcome from 'components/Layout/Dashboard/Welcome/Welcome';
import UpdateInvestmentDialog from 'components/Dialogs/UpdateInvestmentDialog';
import AddInvestmentDialog from 'components/Dialogs/AddInvestmentDialog';
import NewOperationDialog from 'components/Dialogs/NewOperationDialog';
import ImportDbDialog from 'components/Dialogs/ImportDbDialog';
import { ModalContext } from 'context/ModalContext';

const Dashboard = () => {
  const { selectedInvestment, investments, operation } = useContext(DashboardContext);
  const { dialogsState, openNewDialog, closeOpenDialogs } = useContext(ModalContext);

  const openNewDialogHandler = () => {
    openNewDialog!();
  };

  const closeDialogHandler = () => {
    closeOpenDialogs!();
  };

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
        open={dialogsState.loadDbDialogOn}
        close={closeDialogHandler}
      />
      <AddInvestmentDialog
        open={dialogsState.newDialogOn}
        close={closeDialogHandler}
      />
      <UpdateInvestmentDialog
        open={dialogsState.updateDialogOn}
        investment={selectedInvestment!}
        close={closeDialogHandler}
      />
      <NewOperationDialog
        open={dialogsState.newOperationOn}
        investment={selectedInvestment!}
        operation={operation!}
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
