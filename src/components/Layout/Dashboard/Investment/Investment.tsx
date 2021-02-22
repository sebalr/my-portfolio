import { memo } from 'react';
import { IInvestment } from 'interfaces/state.interfaces';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import styles from './Investment.module.css';

interface IInvestmentProps {
  investment: IInvestment;
}

const Investment = (props: IInvestmentProps) => {
  const { investment } = props;
  return (
    <div className={styles.row}>
      <IconButton color="secondary">
        <DeleteIcon />
      </IconButton>
      <span>{investment.asset.name}</span>
      <strong>
        $
        {investment.ammount.toLocaleString()}
      </strong>
      <div>
        <Button color="secondary" size="small">
          Decrease
        </Button>
        <Button color="primary" size="small">
          Increase
        </Button>
      </div>
    </div>
  );
};

export default memo(Investment);
