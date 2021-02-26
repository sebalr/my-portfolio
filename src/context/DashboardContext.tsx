import {
  IDashboardContext,
  IDashboardProviderState,
  IInvestment,
  IInvestmentOperation,
  InvestmentOperation,
} from 'common/state.interfaces';
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

  // Update an existing investment with indicated operation
  const newInvestmentOperation = async (operation: IInvestmentOperation) => {
    await InvestmentsDatabase.transaction('rw', InvestmentsDatabase.investments, InvestmentsDatabase.operations, async () => {
      await InvestmentsDatabase.investments.update(
        operation.investmentId,
        {
          amount: operation.amountAfter,
          date: operation.date,
        },
      );

      await InvestmentsDatabase.operations.add(operation);
      setState(prevState => {
        const investmentIndex = prevState.investments.findIndex(x => x.id === operation.investmentId);
        const updatedInvestments = [...prevState.investments];
        updatedInvestments[investmentIndex].amount = operation.amountAfter;
        updatedInvestments[investmentIndex].date = operation.date;
        return ({ ...prevState, investments: updatedInvestments });
      });
    });
  };

  // investment operations
  const addInvestment = async (investment: IInvestment) => {
    await InvestmentsDatabase.transaction('rw', InvestmentsDatabase.investments, InvestmentsDatabase.operations, async () => {
      const id = await InvestmentsDatabase.investments.add(investment);
      await InvestmentsDatabase.operations.add({
        investmentId: id,
        asset: investment.asset,
        date: investment.date,
        amount: investment.amount,
        amountAfter: investment.amount,
        amountBefore: 0,
        operation: InvestmentOperation.new,
      });
      const updatedInvestment = { ...investment, id };
      setState(prevState => ({ ...prevState, investments: [...prevState.investments, updatedInvestment] }));
    });
  };

  const updateInvestment = async (investment: IInvestment, amount: number, date: Date) => {
    const operation: IInvestmentOperation = {
      investmentId: investment.id!,
      asset: investment.asset,
      date,
      amount,
      amountBefore: investment.amount,
      amountAfter: amount,
      operation: InvestmentOperation.update,
    };

    newInvestmentOperation(operation);
  };

  const removeInvestment = async (id: number) => {
    await InvestmentsDatabase.investments.delete(id);
    setState(prevState => {
      const newArray = prevState.investments.filter(item => item.id !== id);
      return ({ ...prevState, investments: newArray });
    });
  };

  const updateInvestments = (investments: IInvestment[]) => {
    setState(prevState => ({ ...prevState, investments }));
  };

  return (
    <DashboardContext.Provider
      value={
        {
          dashboardContext: state,
          addInvestment,
          removeInvestment,
          updateInvestments,
          updateInvestment,
          newInvestmentOperation,
        }
      }
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
