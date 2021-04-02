import { useCallback } from 'react';
import { IInvestment, InvestmentOperation } from 'common/state.interfaces';
import Investment from 'components/Layout/Dashboard/Investments/Investment/Investment';
import FillterInvestments from 'components/Layout/Dashboard/Investments/FilterInvestments/FillterInvestments';
import { useAppDispatch } from 'store/hooks';
import { showUpdate, showNewOperation, hideAll } from 'store/modal/modalReducer';
import { selectInvestment, selectInvestmentOperation } from 'store/dashboard/dashboardReducer';

interface IInvestmentsProps {
  investments: IInvestment[]
}

const Investments = (props: IInvestmentsProps) => {
  const dispatch = useAppDispatch();

  const openUpdateDialogHandler = useCallback((investment: IInvestment) => {
    dispatch(selectInvestment(investment));
    dispatch(hideAll());
    dispatch(showUpdate());
  }, [dispatch]);

  const openOperationDialogHandler = useCallback((selectedInvestment: IInvestment, operation: InvestmentOperation) => {
    dispatch(selectInvestmentOperation({ selectedInvestment, operation }));
    dispatch(hideAll());
    dispatch(showNewOperation());
  }, [dispatch]);

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
