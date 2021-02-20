import { IPieChartData } from 'interfaces/graph.interfaces';
import { IInvestment } from 'interfaces/state.interfaces';
import chroma from 'chroma-js';

const getColors = (length: number) => {
  const scale = chroma.scale([chroma.random(), chroma.random()]).domain([0, length]);
  return new Array(length).map(() => scale(length).toString());
};

const parseDashboardData = (investments: Array<IInvestment>): IPieChartData | null => {
  if (investments.length <= 0) {
    return null;
  }
  const backgroundColor = getColors(investments.length);
  const labels: string[] = [];
  const data: number[] = [];
  investments.forEach(x => {
    labels.push(x.asset.abbreviation || x.asset.name);
    data.push(x.ammount);
  });
  return {
    labels,
    datasets: [{
      label: 'Total investment',
      data,
      backgroundColor,
      borderWidth: 1,
    }],
  } as IPieChartData;
};

export default parseDashboardData;
