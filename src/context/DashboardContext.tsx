import { IDashboardContext, IDashboardProviderState, IInvestment, InvestmnetOperation } from 'common/state.interfaces';
import { createContext, useState } from 'react';
import InvestmentsDatabase from 'database/database';

export const DashboardContext = createContext<IDashboardContext>(
  {
    dashboardContext: {
      investments: [],
      selectedInvestment: null,
    },
  },
);

const DashboardProvider = (props: any) => {
  const { children } = props;
  const [state, setState] = useState<IDashboardProviderState>(
    {
      investments: [],
      selectedInvestment: null,
    },
  );

  const addInvestment = async (investment: IInvestment) => {
    await InvestmentsDatabase.transaction('rw', InvestmentsDatabase.investments, InvestmentsDatabase.operations, async () => {
      const id = await InvestmentsDatabase.investments.add(investment);
      await InvestmentsDatabase.operations.add({
        investmentId: id,
        asset: investment.asset,
        amount: investment.amount,
        operation: InvestmnetOperation.update,
        date: investment.date,
      });
      const updatedInvestment = { ...investment, id };
      setState(prevState => ({ ...prevState, investments: [...prevState.investments, updatedInvestment] }));
    });
  };

  const removeInvestment = async (id: number) => {
    await InvestmentsDatabase.investments.delete(id);
    setState(prevState => {
      const newArray = prevState.investments.filter(item => item.id !== id);
      return ({ ...prevState, investments: newArray });
    });
  };

  const updateInvestment = async (investment: IInvestment, amount: number, date: Date) => {
    await InvestmentsDatabase.transaction('rw', InvestmentsDatabase.investments, InvestmentsDatabase.operations, async () => {
      await InvestmentsDatabase.investments.update(investment.id!, { amount, date });
      await InvestmentsDatabase.operations.add({
        investmentId: investment.id!,
        asset: investment.asset,
        amount,
        operation: InvestmnetOperation.update,
        date: investment.date,
      });
      setState(prevState => {
        const investmentIndex = prevState.investments.findIndex(x => x.id === investment.id);
        const updatedInvestments = [...prevState.investments];
        updatedInvestments[investmentIndex].amount = amount;
        updatedInvestments[investmentIndex].date = date;
        return ({ ...prevState, investments: updatedInvestments });
      });
    });
  };

  const updateInvestments = (investments: IInvestment[]) => {
    setState(prevState => ({ ...prevState, investments }));
  };

  return (
    <DashboardContext.Provider value={{ dashboardContext: state, addInvestment, removeInvestment, updateInvestments, updateInvestment }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
