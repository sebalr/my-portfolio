import { IPieChartData } from 'common/graph.interfaces';
import { IInvestment } from 'common/state.interfaces';
import chroma from 'chroma-js';

const getColors = (length: number) => {
  const scale = chroma.scale([chroma.random(), chroma.random()]).domain([0, length]);
  return new Array(length).fill(undefined).map((_, index) => scale(index).toString());
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
    data.push(x.amount);
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
