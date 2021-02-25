import { memo, useContext } from 'react';
import { IInvestment } from 'common/state.interfaces';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { DashboardContext } from 'context/DashboardContext';

import styles from './Investment.module.css';

interface IInvestmentProps {
  investment: IInvestment;
  /* eslint-disable-next-line */
  update: (item: IInvestment) => void;
}

const Investment = (props: IInvestmentProps) => {
  const { investment, update } = props;
  const { removeInvestment } = useContext(DashboardContext);

  const removeInvestmentHandler = () => {
    removeInvestment!(investment.id!);
  };

  const openUpdateInvestmentHandler = () => {
    update(investment);
  };

  return (
    <div className={styles.row}>
      <IconButton color="secondary" onClick={removeInvestmentHandler}>
        <DeleteIcon />
      </IconButton>
      <span>{investment.asset.name}</span>
      <strong>
        $
        {investment.amount.toLocaleString()}
      </strong>
      <div className="flex-row no-wrap">
        <Button color="secondary" size="small">
          Decrease
        </Button>
        <Button color="primary" size="small">
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
