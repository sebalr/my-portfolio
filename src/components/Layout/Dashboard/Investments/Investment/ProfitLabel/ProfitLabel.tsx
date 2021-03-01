import { DashboardContext } from 'context/DashboardContext';
import { useContext, useEffect, useState } from 'react';
import calculateProfit from 'helpers/investment';

import styles from './ProfitLabel.module.css';

interface IProfitLabelProps {
  investmentId: number;
}

const ProfitLabel = (props: IProfitLabelProps) => {
  const { investmentId } = props;
  const [profit, setProfit] = useState<number>();
  const { operations } = useContext(DashboardContext);

  useEffect(() => {
    const loadProfit = async () => {
      const assetOperations = operations.filter(x => x.investmentId === investmentId);
      const value = calculateProfit(assetOperations);
      setProfit(value);
    };
    loadProfit();
  }, [operations]);

  const color = profit && profit >= 0 ? styles.green : styles.red;
  return (
    <span className={color}>
      {profit ? `${(profit * 100).toFixed(2)} %` : '-'}
    </span>
  );
};

export default ProfitLabel;
