import { InvestmentOperation } from 'common/state.interfaces';

export interface ISerializableInvestment {
  id?: number,
  asset: ISerializableAsset;
  amount: number;
  date: string;
}

export interface ISerializableAsset {
  name: string;
  abbreviation?: string;
}

export interface ISerializableFilterOperations {
  from: string;
  to: string;
}

export interface ISerializableInvestmentOperation {
  investmentId: number;
  asset: ISerializableAsset;
  date: string;
  amount: number;
  amountBefore: number;
  amountAfter: number;
  operation: InvestmentOperation;
}

export interface IModalState {
  showNew: boolean;
  showUpdate: boolean;
  showNewOperation: boolean;
  showLoadDb: boolean;
}

export interface IDashboardState {
  investments: Array<ISerializableInvestment>;
  selectedInvestment: ISerializableInvestment | null;
  operations: Array<ISerializableInvestmentOperation>;
  operationFilters: ISerializableFilterOperations | null;
  operation: InvestmentOperation;
}

export type RootState = {
  dashboard: IDashboardState,
  modal: IModalState
}
