import { IFilterOperations, IInvestmentOperation, InvestmentOperation } from 'common/state.interfaces';

const getNexValueForProfit = (investment: IInvestmentOperation) => {
  if (investment.operation === InvestmentOperation.update || investment.operation === InvestmentOperation.new) {
    return investment.amount;
  }
  return investment.amountBefore;
};

const percentCalculator = (value1: number, value2: number): number => {
  if (value1 === 0) {
    return value2 > 0 ? 1 : -1;
  }
  return (value2 - value1) / value1;
};

const calculateProfit = (investments: IInvestmentOperation[]): number | undefined => {
  if (investments.length <= 1) {
    return undefined;
  }

  const profits: number[] = [];
  for (let index = 0; index < investments.length - 1; index++) {
    const currentValue = investments[index].amountAfter;
    const nextValue = getNexValueForProfit(investments[index + 1]);
    profits.push(percentCalculator(currentValue, nextValue));
  }
  const totalProfit = profits.reduce((current, acc) => current + acc, 0);
  return totalProfit / profits.length;
};

export const defaultFilter = () => {
  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - 1);
  const toDate = new Date();
  const filters: IFilterOperations = {
    from: fromDate,
    to: toDate,
  };

  return filters;
};

export default calculateProfit;
