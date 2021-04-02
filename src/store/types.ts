import { IInvestment, IInvestmentOperation, IFilterOperations, InvestmentOperation } from 'common/state.interfaces';
import InvestmentsDatabase from 'database/database';

export interface IModalState {
  showNew: boolean;
  showUpdate: boolean;
  showNewOperation: boolean;
  showLoadDb: boolean;
}

export interface IDashboardState {
  investments: Array<IInvestment>;
  selectedInvestment: IInvestment | null;
  operations: Array<IInvestmentOperation>;
  operationFilters: IFilterOperations | null;
  operation: InvestmentOperation;
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = {
  dashboard: IDashboardState,
  modal: IModalState
}
