import React, { useContext, useState } from 'react';
import Summary from 'components/Layout/Dashboard/Summary/Summary';
import Investment from 'components/Layout/Dashboard/Investment/Investment';
import { DashboardContext } from 'context/DashboardContext';
import Welcome from 'components/Layout/Dashboard/Welcome/Welcome';
import UpdateInvestmentDialog from 'components/Layout/Dashboard/Dialogs/UpdateInvestmentDialog';
import { IInvestment } from 'common/state.interfaces';

interface IDashboardState {
  updateDialogOn: boolean;
  newOperationOn: boolean;
  selectedInvestment: IInvestment | null;
}

const Dashboard = () => {
  const { dashboardContext: contextState } = useContext(DashboardContext);

  const [state, setstate] = useState<IDashboardState>(
    {
      updateDialogOn: false,
      newOperationOn: false,
      selectedInvestment: null,
    },
  );

  const openUpdateDialogHandler = (investment: IInvestment) => {
    setstate({
      updateDialogOn: true,
      newOperationOn: false,
      selectedInvestment: investment,
    });
  };

  const closeDialogHandler = () => {
    setstate({ updateDialogOn: false, newOperationOn: false, selectedInvestment: null });
  };

  let dashboard = <Welcome />;

  if (contextState.investments.length > 0) {
    dashboard = (
      <>
        <Summary investments={contextState.investments} />
        { contextState.investments.map(item => (
          <Investment
            key={item.id}
            investment={item}
            update={openUpdateDialogHandler}
          />
        ))}
      </>
    );
  }

  const dialog = state.selectedInvestment ? (
    <UpdateInvestmentDialog
      open={state.updateDialogOn}
      investment={state.selectedInvestment!}
      close={closeDialogHandler}
    />
  ) : null;

  return (
    <div>
      <h2>Dashboard</h2>
      {dialog}
      {dashboard}
    </div>
  );
};

export default Dashboard;
