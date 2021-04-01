import { useCallback, useContext } from 'react';
import { IInvestment, InvestmentOperation } from 'common/state.interfaces';
import { DashboardContext } from 'context/DashboardContext';
import Investment from 'components/Layout/Dashboard/Investments/Investment/Investment';
import FillterInvestments from 'components/Layout/Dashboard/Investments/FilterInvestments/FillterInvestments';
import { useAppDispatch } from 'store/hooks';
import { showUpdate, showNewOperation, hideAll } from 'store/modal/modalReducer';

interface IInvestmentsProps {
  investments: IInvestment[]
}

const Investments = (props: IInvestmentsProps) => {
  const { selectInvestment, selectInvestmentOperation } = useContext(DashboardContext);
  const dispatch = useAppDispatch();

  const openUpdateDialogHandler = useCallback((investment: IInvestment) => {
    selectInvestment!(investment);
    dispatch(hideAll());
    dispatch(showUpdate());
  }, []);

  const openOperationDialogHandler = useCallback((investment: IInvestment, operation: InvestmentOperation) => {
    selectInvestmentOperation!(investment, operation);
    dispatch(hideAll());
    dispatch(showNewOperation());
  }, []);

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
      <FillterInvestments />
      { investmentsList}
    </>
  );
};

export default Investments;
