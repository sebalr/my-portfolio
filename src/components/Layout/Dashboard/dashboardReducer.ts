import { createAction, createAsyncThunk, createReducer, createSelector } from '@reduxjs/toolkit';
import { IFilterOperations, IInvestment, IInvestmentOperation, InvestmentOperation } from 'common/state.interfaces';
import { exportDB, importInto } from 'dexie-export-import';
import download from 'downloadjs';
import { defaultFilter } from 'helpers/investment';
import db from 'database/database';
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
import {
  IDashboardState,
  ISerializableFilterOperations,
  ISerializableInvestment,
  ISerializableInvestmentOperation,
  RootState,
} from 'store/types';
import {
  toFilters,
  toInvestment,
  toOperation,
  toSerializableFilters,
  toSerializableInvestment,
  toSerializableOperation,
} from 'helpers/dashboard';

// Investment
export const addInvestment = createAsyncThunk<
  [ISerializableInvestment, ISerializableInvestmentOperation],
  ISerializableInvestment,
  { state: RootState }>(
    ADD_INVESTMENT,
    async investment => {
      const id = await db.investments.add(toInvestment(investment));
      const operation = {
        investmentId: id,
        asset: investment.asset,
        date: investment.date,
        amount: investment.amount,
        amountAfter: investment.amount,
        amountBefore: 0,
        operation: InvestmentOperation.new,
      };
      await db.operations.add(toOperation(operation));
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
  ISerializableInvestmentOperation,
  {
    investment: ISerializableInvestment,
    amount: number,
    date: string
  },
  { state: RootState }>(
    UPDATE_INVESTMENT,
    async ({ investment, amount, date }) => {
      const operation: ISerializableInvestmentOperation = {
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

        await db.operations.add(toOperation(operation));
      });
      return operation;
    },
  );

export const selectInvestment = createAction<ISerializableInvestment>(SELECT_INVESTMENT);

// Operation
export const selectInvestmentOperation = createAction<{
  selectedInvestment: ISerializableInvestment, operation: InvestmentOperation
}>(SELECT_INVESTMENT_OPERATION);

export const filterInvestmentOperations = createAsyncThunk<
  [ISerializableFilterOperations, ISerializableInvestmentOperation[]],
  ISerializableFilterOperations,
  { state: RootState }>(
    FILTER_INVESTMENT_OPERATIONS,
    async filters => {
      const filter = toFilters(filters);
      const filtered = await db.operations.where('date').between(filter.from, filter.to).toArray();
      const serialized = filtered.map(x => toSerializableOperation(x));
      return [filters, serialized];
    },
  );

export const newInvestmentOperation = createAsyncThunk<
  ISerializableInvestmentOperation,
  ISerializableInvestmentOperation,
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

        await db.operations.add(toOperation(operation));
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
  [ISerializableInvestment[], ISerializableFilterOperations, ISerializableInvestmentOperation[]],
  void,
  { state: RootState }>(
    LOAD_FROM_DB,
    async () => {
      const investments = (await db.investments.toArray()).map(x => toSerializableInvestment(x));
      const filters = toSerializableFilters(defaultFilter());
      const operations = (await db.operations.toArray()).map(x => toSerializableOperation(x));
      return [investments, filters, operations];
    },
  );

export const importDb = createAsyncThunk<
  [ISerializableInvestment[], ISerializableFilterOperations, ISerializableInvestmentOperation[]],
  Blob,
  { state: RootState }>(
    IMPORT_DB,
    async dbBlob => {
      await importInto(db, dbBlob, { clearTablesBeforeImport: true });
      const investments = (await db.investments.toArray()).map(x => toSerializableInvestment(x));
      const filters = toSerializableFilters(defaultFilter());
      const operations = (await db.operations.where('date')
        .between(filters.from, filters.to).toArray()).map(x => toSerializableOperation(x));

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
        const [investments, filters, operations] = action.payload;
        state.investments = investments;
        state.operationFilters = filters;
        state.operations = operations;
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
        state.investments = investments;
        state.operationFilters = filters;
        state.operations = operations;
      })
      .addDefaultCase(state => state);
  });

// selectors
export const selectDeserializedInvestments = createSelector<RootState, ISerializableInvestment[], IInvestment[]>(
  state => state.dashboard.investments,
  investments => investments.map(x => toInvestment(x)),
);

export const selectDeserializedSelectedInvestment = createSelector<RootState, ISerializableInvestment | null, IInvestment | null>(
  state => state.dashboard.selectedInvestment,
  selectedInvestment => (selectedInvestment ? toInvestment(selectedInvestment) : null),
);

export const selectDeserializedFilters = createSelector<RootState, ISerializableFilterOperations | null, IFilterOperations | null>(
  state => state.dashboard.operationFilters,
  selectedInvestment => (selectedInvestment ? toFilters(selectedInvestment) : null),
);

export const selectDeserializedOperations = createSelector<RootState, ISerializableInvestmentOperation[], IInvestmentOperation[]>(
  state => state.dashboard.operations,
  operations => operations.map(x => toOperation(x)),
);
export default reducer;
