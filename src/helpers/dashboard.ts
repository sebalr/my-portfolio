/* eslint-disable max-len */
import { IPieChartData } from 'common/graph.interfaces';
import { IFilterOperations, IInvestment, IInvestmentOperation } from 'common/state.interfaces';
import chroma from 'chroma-js';
import { ISerializableFilterOperations, ISerializableInvestment, ISerializableInvestmentOperation } from 'store/types';

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

export const toSerializableInvestment = (i: IInvestment): ISerializableInvestment => ({ ...i, date: i.date.toISOString() });
export const toSerializableOperation = (o: IInvestmentOperation): ISerializableInvestmentOperation => ({ ...o, date: o.date.toISOString() });
export const toSerializableFilters = (f: IFilterOperations): ISerializableFilterOperations => ({ ...f, from: f.from.toISOString(), to: f.to.toISOString() });

export const toInvestment = (i: ISerializableInvestment): IInvestment => ({ ...i, date: new Date(i.date) });
export const toOperation = (o: ISerializableInvestmentOperation): IInvestmentOperation => ({ ...o, date: new Date(0) });
export const toFilters = (f: ISerializableFilterOperations): IFilterOperations => ({ ...f, from: new Date(f.from), to: new Date(f.to) });

export default parseDashboardData;
