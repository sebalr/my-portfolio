import { memo } from 'react';
import parseDashboardData from 'helpers/dashboard';
import { IInvestment } from 'common/state.interfaces';
import { Pie } from 'react-chartjs-2';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import styles from './Summary.module.css';

interface ISummaryProps {
  investments: IInvestment[],
  openAddDialog: () => void,
}

const Summary = (props: ISummaryProps) => {
  const { investments, openAddDialog } = props;
  const graphData = parseDashboardData(investments);
  let chart = null;

  if (investments.length > 0) {
    chart = (
      <Pie
        data={graphData}
      />
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <div className="flex-row">
          <h3>Inversiones</h3>
          <Button
            onClick={openAddDialog}
            variant="outlined"
            color="primary"
          >
            Add
          </Button>
        </div>
        <div className={styles.graphContainer}>
          {chart}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(Summary);
