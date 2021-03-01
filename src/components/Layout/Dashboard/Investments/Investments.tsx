import { IInvestment, InvestmentOperation } from 'common/state.interfaces';
import Investment from 'components/Layout/Dashboard/Investments/Investment/Investment';
import { DashboardContext } from 'context/DashboardContext';
import { ModalContext } from 'context/ModalContext';
import { useContext } from 'react';

interface IInvestmentsProps {
  investments: IInvestment[]
}

const Investments = (props: IInvestmentsProps) => {
  const { selectInvestment, selectInvestmentOperation } = useContext(DashboardContext);
  const { openUpdaeDialog, openNewOperationDialog } = useContext(ModalContext);

  const openUpdateDialogHandler = (investment: IInvestment) => {
    selectInvestment!(investment);
    openUpdaeDialog!();
  };

  const openOperationDialogHandler = (investment: IInvestment, operation: InvestmentOperation) => {
    selectInvestmentOperation!(investment, operation);
    openNewOperationDialog!();
  };

  const { investments } = props;
  const investmentsList = investments.map(item => (
    <Investment
      key={item.id}
      investment={item}
      update={openUpdateDialogHandler}
      newOperation={openOperationDialogHandler}
    />
  ));
  return (
    <>
      { investmentsList}
    </>
  );
};

export default Investments;
