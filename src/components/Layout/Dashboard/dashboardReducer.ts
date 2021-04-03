import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { IFilterOperations, IInvestment, IInvestmentOperation, InvestmentOperation } from 'common/state.interfaces';
import { exportDB, importInto } from 'dexie-export-import';
import download from 'downloadjs';
import { defaultFilter } from 'helpers/investment';
import {
  ADD_INVESTMENT,
  EXPORT_DB,
  FILTER_INVESTMENT_OPERATIONS,
  IMPORT_DB,
  INVESTMENT_PROFIT,
  LOAD_FROM_DB,
  NEW_INVESTMENT_OPERATION,
  REMOVE_DB,
  REMOVE_INVESTMENT,
  SELECT_INVESTMENT,
  SELECT_INVESTMENT_OPERATION,
  UPDATE_INVESTMENT,
} from 'components/Layout/Dashboard/dashboardActionTypes';
import { IDashboardState, RootState } from 'store/types';
import db from 'database/database';
import { toSerializableFilters, toSerializableInvestment, toSerializableOperation } from 'helpers/dashboard';

// Investment
export const addInvestment = createAsyncThunk<
  [IInvestment, IInvestmentOperation],
  IInvestment,
  { state: RootState }>(
    ADD_INVESTMENT,
    async investment => {
      const id = await db.investments.add(investment);
      const operation = {
        investmentId: id,
        asset: investment.asset,
        date: investment.date,
        amount: investment.amount,
        amountAfter: investment.amount,
        amountBefore: 0,
        operation: InvestmentOperation.new,
      };
      await db.operations.add(operation);
      const updatedInvestment = { ...investment, id };

      return [updatedInvestment, operation];
    },
  );

export const removeInvestment = createAsyncThunk<
  number,
  number,
  { state: RootState }>(
    REMOVE_INVESTMENT,
    async id => {
      await db.investments.delete(id);
      return id;
    },
  );

export const updateInvestment = createAsyncThunk<
  IInvestmentOperation,
  {
    investment: IInvestment,
    amount: number,
    date: Date
  },
  { state: RootState }>(
    UPDATE_INVESTMENT,
    async ({ investment, amount, date }) => {
      const operation: IInvestmentOperation = {
        investmentId: investment.id!,
        asset: investment.asset,
        date,
        amount,
        amountBefore: investment.amount,
        amountAfter: amount,
        operation: InvestmentOperation.update,
      };
      await db.transaction('rw', db.investments, db.operations, async () => {
        await db.investments.update(
          operation.investmentId,
          {
            amount: operation.amountAfter,
            date: operation.date,
          },
        );

        await db.operations.add(operation);
      });
      return operation;
    },
  );

export const selectInvestment = createAction<IInvestment>(SELECT_INVESTMENT);

// Operation
export const selectInvestmentOperation = createAction<{
  selectedInvestment: IInvestment, operation: InvestmentOperation
}>(SELECT_INVESTMENT_OPERATION);

export const filterInvestmentOperations = createAsyncThunk<
  [IFilterOperations, IInvestmentOperation[]],
  IFilterOperations,
  { state: RootState }>(
    FILTER_INVESTMENT_OPERATIONS,
    async filters => {
      const filtered = await db.operations.where('date').between(filters.from, filters.to).toArray();
      return [filters, filtered];
    },
  );

export const newInvestmentOperation = createAsyncThunk<
  IInvestmentOperation,
  IInvestmentOperation,
  { state: RootState }>(
    NEW_INVESTMENT_OPERATION,
    async operation => {
      await db.transaction('rw', db.investments, db.operations, async () => {
        await db.investments.update(
          operation.investmentId,
          {
            amount: operation.amountAfter,
            date: operation.date,
          },
        );

        await db.operations.add(operation);
      });
      return operation;
    },
  );

// DB
export const removeDb = createAsyncThunk<void, void, { state: RootState }>(
  REMOVE_DB,
  async () => {
    await db.operations.clear();
    await db.investments.clear();
  },
);

export const exportDb = createAsyncThunk<Blob, void, { state: RootState }>(
  EXPORT_DB,
  async () => {
    const blob = await exportDB(db);
    return blob;
  },
);

export const loadFromDb = createAsyncThunk<
  [IInvestment[], IFilterOperations, IInvestmentOperation[]],
  void,
  { state: RootState }>(
    LOAD_FROM_DB,
    async () => {
      const investments = await db.investments.toArray();
      const filters = defaultFilter();
      const operations = await db.operations.toArray();
      return [investments, filters, operations];
    },
  );

export const importDb = createAsyncThunk<
  [IInvestment[], IFilterOperations, IInvestmentOperation[]],
  Blob,
  { state: RootState }>(
    IMPORT_DB,
    async dbBlob => {
      await importInto(db, dbBlob, { clearTablesBeforeImport: true });
      const investments = await db.investments.toArray();
      const filters = defaultFilter();
      const operations = await db.operations.where('date')
        .between(filters.from, filters.to).toArray();

      return [investments, filters, operations];
    },
  );

export const investmentProfit = createAction(INVESTMENT_PROFIT);

const initialState: IDashboardState = {
  investments: [],
  selectedInvestment: null,
  operations: [],
  operationFilters: null,
  operation: InvestmentOperation.new,
};

const reducer = createReducer(initialState,
  builder => {
    builder
      .addCase(addInvestment.fulfilled, (state, action) => {
        const [investment, operation] = action.payload;
        state.investments.push(toSerializableInvestment(investment));
        state.operations.push(toSerializableOperation(operation));
      })
      .addCase(updateInvestment.fulfilled, (state, action) => {
        const operation = toSerializableOperation(action.payload);
        const investmentIndex = state.investments.findIndex(x => x.id === operation.investmentId);
        state.investments[investmentIndex].amount = operation.amountAfter;
        state.investments[investmentIndex].date = operation.date;
      })
      .addCase(removeInvestment.fulfilled, (state, action) => {
        const id = action.payload;
        state.investments = state.investments.filter(item => item.id !== id);
        state.operations = state.operations.filter(item => item.investmentId !== id);
      })
      .addCase(selectInvestment, (state, action) => {
        state.selectedInvestment = toSerializableInvestment(action.payload);
      })
      .addCase(newInvestmentOperation.fulfilled, (state, action) => {
        const operation = toSerializableOperation(action.payload);
        const investmentIndex = state.investments.findIndex(x => x.id === operation.investmentId);
        state.investments[investmentIndex].amount = operation.amountAfter;
        state.investments[investmentIndex].date = operation.date;
        state.operations.push(operation);
      })
      .addCase(selectInvestmentOperation, (state, action) => {
        const { selectedInvestment, operation } = action.payload;
        state.selectedInvestment = toSerializableInvestment(selectedInvestment);
        state.operation = operation;
      })
      .addCase(filterInvestmentOperations.fulfilled, (state, action) => {
        const [filters, operations] = action.payload;
        state.operationFilters = toSerializableFilters(filters);
        state.operations = operations.map(x => toSerializableOperation(x));
      })
      .addCase(importDb.fulfilled, (state, action) => {
        const [investments, filters, operations] = action.payload;
        state.investments = investments.map(x => toSerializableInvestment(x));
        state.operationFilters = toSerializableFilters(filters);
        state.operations = operations.map(x => toSerializableOperation(x));
      })
      .addCase(removeDb.fulfilled, state => {
        state.investments = [];
        state.operations = [];
        state.operationFilters = null;
      })
      .addCase(exportDb.fulfilled, (state, action) => {
        const blob = action.payload;
        const name = `portfolio-export-${new Date().toISOString().slice(0, 10)}.json`;
        download(blob, name, 'application/json');
        return state;
      })
      .addCase(loadFromDb.fulfilled, (state, action) => {
        const [investments, filters, operations] = action.payload;
        state.investments = investments.map(x => toSerializableInvestment(x));
        state.operationFilters = toSerializableFilters(filters);
        state.operations = operations.map(x => toSerializableOperation(x));
      })
      .addDefaultCase(state => state);
  });

export default reducer;
