import { useEffect, useState } from 'react';
import calculateProfit from 'helpers/investment';
import { useAppSelector } from 'store/hooks';
import { selectDeserializedOperations } from 'components/Layout/Dashboard/dashboardReducer';

import styles from './ProfitLabel.module.css';

interface IProfitLabelProps {
  investmentId: number;
}

const ProfitLabel = (props: IProfitLabelProps) => {
  const { investmentId } = props;
  const [profit, setProfit] = useState<number>();
  const operations = useAppSelector(selectDeserializedOperations);

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
