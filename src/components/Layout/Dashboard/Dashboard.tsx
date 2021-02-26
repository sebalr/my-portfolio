import React, { useContext, useState } from 'react';
import Summary from 'components/Layout/Dashboard/Summary/Summary';
import Investment from 'components/Layout/Dashboard/Investment/Investment';
import { DashboardContext } from 'context/DashboardContext';
import Welcome from 'components/Layout/Dashboard/Welcome/Welcome';
import UpdateInvestmentDialog from 'components/Layout/Dashboard/Dialogs/UpdateInvestmentDialog';
import { IInvestment, InvestmentOperation } from 'common/state.interfaces';
import AddInvestmentDialog from 'components/Layout/Dashboard/Dialogs/AddInvestmentDialog';
import NewOperationDialog from 'components/Layout/Dashboard/Dialogs/NewOperationDialog';

interface IDashboardState {
  newDialogOn: boolean;
  updateDialogOn: boolean;
  newOperationOn: boolean;
  selectedInvestment: IInvestment | null;
  operation?: InvestmentOperation;
}

const Dashboard = () => {
  const { dashboardContext: contextState } = useContext(DashboardContext);

  const [state, setstate] = useState<IDashboardState>(
    {
      newDialogOn: false,
      updateDialogOn: false,
      newOperationOn: false,
      selectedInvestment: null,
    },
  );

  const openNewDialogHandler = () => {
    setstate({
      newDialogOn: true,
      updateDialogOn: false,
      newOperationOn: false,
      selectedInvestment: null,
    });
  };

  const openUpdateDialogHandler = (investment: IInvestment) => {
    setstate({
      newDialogOn: false,
      updateDialogOn: true,
      newOperationOn: false,
      selectedInvestment: investment,
    });
  };

  const openOperationDialogHandler = (investment: IInvestment, operation: InvestmentOperation) => {
    setstate({
      newDialogOn: false,
      updateDialogOn: false,
      newOperationOn: true,
      selectedInvestment: investment,
      operation,
    });
  };

  const closeDialogHandler = () => {
    setstate({ newDialogOn: false, updateDialogOn: false, newOperationOn: false, selectedInvestment: null });
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
      <AddInvestmentDialog
        open={state.newDialogOn}
        close={closeDialogHandler}
      />
      <UpdateInvestmentDialog
        open={state.updateDialogOn}
        investment={state.selectedInvestment!}
        close={closeDialogHandler}
      />
      <NewOperationDialog
        open={state.newOperationOn}
        investment={state.selectedInvestment!}
        operation={state.operation}
        close={closeDialogHandler}
      />
    </>
  ) : <AddInvestmentDialog open={state.newDialogOn} close={closeDialogHandler} />;

  return (
    <div>
      {dialogs}
      <h2>Dashboard</h2>
      {dashboard}
    </div>
  );
};

export default Dashboard;
