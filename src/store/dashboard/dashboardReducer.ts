import { createAction, createAsyncThunk, createReducer } from '@reduxjs/toolkit';
import { IFilterOperations, IInvestment, IInvestmentOperation, InvestmentOperation } from 'common/state.interfaces';
import InvestmentsDatabase from 'database/database';
import { exportDB, importDB } from 'dexie-export-import';
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
} from 'store/dashboard/dashboardActionTypes';
import { IDashboardState, RootState } from 'store/types';

// Investment
export const addInvestment = createAsyncThunk<
  [IInvestment, IInvestmentOperation],
  IInvestment,
  { state: RootState }>(
    ADD_INVESTMENT,
    async (investment, thunkAPI) => {
      const state = thunkAPI.getState();
      const id = await state.dashboard.db.investments.add(investment);
      const operation = {
        investmentId: id,
        asset: investment.asset,
        date: investment.date,
        amount: investment.amount,
        amountAfter: investment.amount,
        amountBefore: 0,
        operation: InvestmentOperation.new,
      };
      await state.dashboard.db.operations.add(operation);
      const updatedInvestment = { ...investment, id };

      return [updatedInvestment, operation];
    },
  );

export const removeInvestment = createAsyncThunk<
  number,
  number,
  { state: RootState }>(
    REMOVE_INVESTMENT,
    async (id, thunkAPI) => {
      const state = thunkAPI.getState();
      await state.dashboard.db.investments.delete(id);
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
    async ({ investment, amount, date }, thunkAPI) => {
      const state = thunkAPI.getState();
      const operation: IInvestmentOperation = {
        investmentId: investment.id!,
        asset: investment.asset,
        date,
        amount,
        amountBefore: investment.amount,
        amountAfter: amount,
        operation: InvestmentOperation.update,
      };
      await state.dashboard.db.transaction('rw', state.dashboard.db.investments, state.dashboard.db.operations, async () => {
        await state.dashboard.db.investments.update(
          operation.investmentId,
          {
            amount: operation.amountAfter,
            date: operation.date,
          },
        );

        await state.dashboard.db.operations.add(operation);
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
    async (filters, thunkAPI) => {
      const state = thunkAPI.getState();
      const filtered = await state.dashboard.db.operations.where('date').between(filters.from, filters.to).toArray();
      return [filters, filtered];
    },
  );

export const newInvestmentOperation = createAsyncThunk<
  IInvestmentOperation,
  IInvestmentOperation,
  { state: RootState }>(
    NEW_INVESTMENT_OPERATION,
    async (operation, thunkAPI) => {
      const state = thunkAPI.getState();
      await state.dashboard.db.transaction('rw', state.dashboard.db.investments, state.dashboard.db.operations, async () => {
        await state.dashboard.db.investments.update(
          operation.investmentId,
          {
            amount: operation.amountAfter,
            date: operation.date,
          },
        );

        await state.dashboard.db.operations.add(operation);
      });
      return operation;
    },
  );

// DB
export const removeDb = createAsyncThunk<InvestmentsDatabase, void, { state: RootState }>(
  REMOVE_DB,
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    await state.dashboard.db.delete();
    const newDb = new InvestmentsDatabase('investmentsDb');
    return newDb;
  },
);

export const exportDb = createAsyncThunk<Blob, void, { state: RootState }>(
  EXPORT_DB,
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const blob = await exportDB(state.dashboard.db);
    return blob;
  },
);

export const loadFromDb = createAsyncThunk<
  [IInvestment[], IFilterOperations, IInvestmentOperation[]],
  void,
  { state: RootState }>(
    LOAD_FROM_DB,
    async (_, thunkAPI) => {
      const state = thunkAPI.getState();
      const investments = await state.dashboard.db.investments.toArray();
      const filters = defaultFilter();
      const operations = await state.dashboard.db.operations.toArray();
      return [investments, filters, operations];
    },
  );

export const importDb = createAsyncThunk<
  [InvestmentsDatabase, IInvestment[], IFilterOperations, IInvestmentOperation[]],
  Blob,
  { state: RootState }>(
    IMPORT_DB,
    async (db, thunkAPI) => {
      const state = thunkAPI.getState();
      await state.dashboard.db.delete();
      const newDb = await importDB(db) as InvestmentsDatabase;
      const investments = await newDb.investments.toArray();
      const filters = defaultFilter();
      const operations = await state.dashboard.db.operations.where('date')
        .between(filters.from, filters.to).toArray();

      return [newDb, investments, filters, operations];
    },
  );

export const investmentProfit = createAction(INVESTMENT_PROFIT);

const initialState: IDashboardState = {
  db: new InvestmentsDatabase('investmentsDb'),
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
        state.investments.push(investment);
        state.operations.push(operation);
      })
      .addCase(updateInvestment.fulfilled, (state, action) => {
        const operation = action.payload;
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
        state.selectedInvestment = action.payload;
      })
      .addCase(newInvestmentOperation.fulfilled, (state, action) => {
        const operation = action.payload;
        const investmentIndex = state.investments.findIndex(x => x.id === operation.investmentId);
        state.investments[investmentIndex].amount = operation.amountAfter;
        state.investments[investmentIndex].date = operation.date;
        state.operations.push(operation);
      })
      .addCase(selectInvestmentOperation, (state, action) => {
        const { selectedInvestment, operation } = action.payload;
        state.selectedInvestment = selectedInvestment;
        state.operation = operation;
      })
      .addCase(filterInvestmentOperations.fulfilled, (state, action) => {
        const [filters, operations] = action.payload;
        state.operationFilters = filters;
        state.operations = operations;
      })
      .addCase(importDb.fulfilled, (state, action) => {
        const [db, investments, filters, operations] = action.payload;
        state.db = db;
        state.investments = investments;
        state.operationFilters = filters;
        state.operations = operations;
      })
      .addCase(removeDb.fulfilled, (state, action) => {
        const newDb = action.payload;
        state.db = newDb;
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
        state.investments = investments;
        state.operationFilters = filters;
        state.operations = operations;
      })
      .addDefaultCase(state => state);
  });

export default reducer;
