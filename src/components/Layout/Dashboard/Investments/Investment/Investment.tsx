import { memo, useCallback } from 'react';
import { IInvestment, InvestmentOperation } from 'common/state.interfaces';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import ProfitLabel from 'components/Layout/Dashboard/Investments/Investment/ProfitLabel/ProfitLabel';
import { useAppDispatch } from 'store/hooks';
import { removeInvestment } from 'store/dashboard/dashboardReducer';

import styles from './Investment.module.css';

interface IInvestmentProps {
  investment: IInvestment;
  /* eslint-disable-next-line */
  update: (item: IInvestment) => void;
  /* eslint-disable-next-line */
  newOperation: (item: IInvestment, operation: InvestmentOperation) => void;
}

const Investment = (props: IInvestmentProps) => {
  const { investment, update, newOperation } = props;
  const dispatch = useAppDispatch();

  const removeInvestmentHandler = useCallback(() => {
    dispatch(removeInvestment(investment.id!));
  }, [dispatch, investment]);

  const openUpdateInvestmentHandler = useCallback(() => {
    update(investment);
  }, [update, investment]);

  const openIncreaseOperationHandler = useCallback(() => {
    newOperation(investment, InvestmentOperation.increase);
  }, [newOperation, investment, InvestmentOperation]);

  const openDecreaseOperationHandler = useCallback(() => {
    newOperation(investment, InvestmentOperation.decrease);
  }, [newOperation, investment, InvestmentOperation]);

  return (
    <div className={styles.row}>
      <IconButton
        color="secondary"
        onClick={removeInvestmentHandler}
      >
        <DeleteIcon />
      </IconButton>
      <span>{investment.asset.name}</span>
      <strong>
        $
        {investment.amount.toLocaleString()}
      </strong>
      <ProfitLabel investmentId={investment.id!} />
      <div className="flex-row no-wrap">
        <Button
          onClick={openDecreaseOperationHandler}
          color="secondary"
          size="small"
        >
          Decrease
        </Button>
        <Button
          onClick={openIncreaseOperationHandler}
          color="primary"
          size="small"
        >
          Increase
        </Button>
        <Button
          color="primary"
          size="small"
          onClick={openUpdateInvestmentHandler}
        >
          Update
        </Button>
      </div>
    </div>
  );
};

export default memo(Investment);
