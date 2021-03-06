import {
  IDashboardContext,
  IFilterOperations,
  IInvestment,
  IInvestmentOperation,
  InvestmentOperation,
} from 'common/state.interfaces';
import { createContext, useState } from 'react';
import InvestmentsDatabase from 'database/database';
import { importDB, exportDB } from 'dexie-export-import';
import download from 'downloadjs';
import calculateProfit, { defaultFilter } from 'helpers/investment';

interface IDashboardProviderState {
  db: InvestmentsDatabase;
  investments: Array<IInvestment>;
  selectedInvestment: IInvestment | null;
  operations: Array<IInvestmentOperation>;
  operation: InvestmentOperation;
  operationFilters: IFilterOperations | null;
}

export const DashboardContext = createContext<IDashboardContext>(
  {
    operations: [],
    investments: [],
    selectedInvestment: null,
    operation: InvestmentOperation.new,
    operationFilters: null,
  },
);

const DashboardProvider = (props: any) => {
  const { children } = props;
  const [state, setState] = useState<IDashboardProviderState>(
    {
      db: new InvestmentsDatabase('investmentsDb'),
      investments: [],
      selectedInvestment: null,
      operations: [],
      operationFilters: null,
      operation: InvestmentOperation.new,
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
        return (
          {
            ...prevState,
            investments: updatedInvestments,
            operations: prevState.operations.concat(operation),
          });
      });
    });
  };

  // investment operations
  const addInvestment = async (investment: IInvestment) => {
    await state.db.transaction('rw', state.db.investments, state.db.operations, async () => {
      const id = await state.db.investments.add(investment);
      const operation = {
        investmentId: id,
        asset: investment.asset,
        date: investment.date,
        amount: investment.amount,
        amountAfter: investment.amount,
        amountBefore: 0,
        operation: InvestmentOperation.new,
      };
      await state.db.operations.add(operation);
      const updatedInvestment = { ...investment, id };
      setState(prevState => (
        {
          ...prevState,
          investments: [...prevState.investments, updatedInvestment],
          operations: prevState.operations.concat(operation),
        }));
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
      const newOperations = prevState.operations.filter(item => item.investmentId !== id);
      return ({ ...prevState, investments: newArray, operations: newOperations });
    });
  };

  const updateInvestmentsAndOperations = (
    investments: IInvestment[], operations: IInvestmentOperation[], filter: IFilterOperations | null,
  ) => {
    setState(prevState => ({ ...prevState, investments, operations, operationFilters: filter }));
  };

  const exportDb = async () => {
    const blob = await exportDB(state.db);
    const name = `portfolio-export-${new Date().toISOString().slice(0, 10)}.json`;
    download(blob, name, 'application/json');
  };

  const loadDataFromDb = async () => {
    const investments = await state.db.investments.toArray();
    const filters = defaultFilter();
    const operations = await state.db.operations.toArray();
    updateInvestmentsAndOperations(investments, operations, filters);
  };

  const removeDb = async () => {
    await state.db.delete();
    const newDb = new InvestmentsDatabase('investmentsDb');
    setState(prevState => ({ ...prevState, db: newDb, investments: [], operations: [], operationFilters: null }));
  };

  const importDb = async (blob: Blob) => {
    await removeDb();
    const newDb = await importDB(blob) as InvestmentsDatabase;
    const investments = await newDb.investments.toArray();
    const operationFilters = defaultFilter();
    const operations = await state.db.operations.where('date')
      .between(operationFilters.from, operationFilters.to).toArray();
    setState(prevState => ({ ...prevState, db: newDb, investments, operations, operationFilters }));
  };

  const investmentProfit = async (investmentId: number): Promise<number | undefined> => {
    const operations = state.db.operations.where('investmentId').equals(investmentId);
    const array = await operations.toArray();
    return calculateProfit(array);
  };

  const selectInvestment = (investment: IInvestment) => {
    setState(prevState => ({ ...prevState, selectedInvestment: investment }));
  };

  const selectInvestmentOperation = (selectedInvestment: IInvestment, operation: InvestmentOperation) => {
    setState(prevState => ({ ...prevState, selectedInvestment, operation }));
  };

  const filterOperations = async (filters: IFilterOperations) => {
    const filtered = await state.db.operations.where('date').between(filters.from, filters.to).toArray();
    setState(prevState => ({ ...prevState, operationFilters: filters, operations: filtered }));
  };

  return (
    <DashboardContext.Provider
      value={
        {
          ...state,
          addInvestment,
          removeInvestment,
          updateInvestment,
          newInvestmentOperation,
          loadDataFromDb,
          exportDb,
          importDb,
          removeDb,
          investmentProfit,
          selectInvestment,
          selectInvestmentOperation,
          filterOperations,
        }
      }
    >
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
