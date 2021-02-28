import {
  IDashboardContext,
  IInvestment,
  IInvestmentOperation,
  InvestmentOperation,
} from 'common/state.interfaces';
import { createContext, useState } from 'react';
import InvestmentsDatabase from 'database/database';
import { importDB, exportDB } from 'dexie-export-import';
import download from 'downloadjs';

interface IDashboardProviderState {
  db: InvestmentsDatabase;
  investments: Array<IInvestment>;
  selectedInvestment: IInvestment | null;
}

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
      db: new InvestmentsDatabase('investmentsDb'),
      investments: [],
      selectedInvestment: null,
    },
  );

  // Update an existing investment with indicated operation
  const newInvestmentOperation = async (operation: IInvestmentOperation) => {
    await state.db.transaction('rw', state.db.investments, state.db.operations, async () => {
      await state.db.investments.update(
        operation.investmentId,
        {
          amount: operation.amountAfter,
          date: operation.date,
        },
      );

      await state.db.operations.add(operation);
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
    await state.db.transaction('rw', state.db.investments, state.db.operations, async () => {
      const id = await state.db.investments.add(investment);
      await state.db.operations.add({
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
    await state.db.investments.delete(id);
    setState(prevState => {
      const newArray = prevState.investments.filter(item => item.id !== id);
      return ({ ...prevState, investments: newArray });
    });
  };

  const updateInvestments = (investments: IInvestment[]) => {
    setState(prevState => ({ ...prevState, investments }));
  };

  const exportDb = async () => {
    const blob = await exportDB(state.db);
    const name = `portfolio-export-${new Date().toISOString().slice(0, 10)}.json`;
    download(blob, name, 'application/json');
  };

  const loadDataFromDb = async () => {
    const investments = await state.db.investments.toArray();
    updateInvestments(investments);
  };

  const removeDb = async () => {
    await state.db.delete();
    const newDb = new InvestmentsDatabase('investmentsDb');
    setState({ ...state, db: newDb });
    updateInvestments([]);
  };

  const importDb = async (blob: Blob) => {
    await removeDb();
    const newDb = await importDB(blob) as InvestmentsDatabase;
    setState({ ...state, db: newDb });
    updateInvestments(await newDb.investments.toArray());
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
          exportDb,
          importDb,
          loadDataFromDb,
          removeDb,
        }
      }
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
