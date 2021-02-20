import parseDashboardData from 'helpers/dashboard';
import { IInvestment } from 'interfaces/state.interfaces';
import { Pie } from 'react-chartjs-2';

interface ISummaryProps {
  investments: IInvestment[]
}

const Summary = (props: ISummaryProps) => {
  const { investments } = props;
  const graphData = parseDashboardData(investments);
  return (
    <>
      <h3>Inversiones</h3>
      <Pie data={graphData} />
    </>
  );
};

export default Summary;
