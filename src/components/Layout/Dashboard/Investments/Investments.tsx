import { useCallback } from 'react';
import { IInvestment, InvestmentOperation } from 'common/state.interfaces';
import Investment from 'components/Layout/Dashboard/Investments/Investment/Investment';
import FillterInvestments from 'components/Layout/Dashboard/Investments/FilterInvestments/FillterInvestments';
import { useAppDispatch } from 'store/hooks';
import { selectInvestment, selectInvestmentOperation } from 'components/Layout/Dashboard/dashboardReducer';
import { hideAll, showNewOperation, showUpdate } from 'components/Dialogs/modalReducer';
import { toSerializableInvestment } from 'helpers/dashboard';

interface IInvestmentsProps {
  investments: IInvestment[]
}

const Investments = (props: IInvestmentsProps) => {
  const dispatch = useAppDispatch();

  const openUpdateDialogHandler = useCallback((investment: IInvestment) => {
    dispatch(selectInvestment(toSerializableInvestment(investment)));
    dispatch(hideAll());
    dispatch(showUpdate());
  }, [dispatch]);

  const openOperationDialogHandler = useCallback((investment: IInvestment, operation: InvestmentOperation) => {
    dispatch(selectInvestmentOperation({ selectedInvestment: toSerializableInvestment(investment), operation }));
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
