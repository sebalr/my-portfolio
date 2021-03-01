/* eslint-disable no-unused-vars */

export enum InvestmentOperation {
  new = 1,
  increase,
  decrease,
  update
}

export interface IDialogsState {
  updateDialogOn: boolean;
  newOperationOn: boolean;
  newDialogOn: boolean;
  loadDbDialogOn: boolean;
}

export interface IModalProviderState {
  dialogsState: IDialogsState
}

export interface IModalContext {
  dialogsState: IDialogsState;
  openNewDialog?: () => void;
  openUpdaeDialog?: () => void;
  openNewOperationDialog?: () => void;
  openLoadDbDialog?: () => void;
  closeOpenDialogs?: () => void;
}

export interface IDashboardContextState {
  investments: Array<IInvestment>;
  selectedInvestment: IInvestment | null;
  operations: Array<IInvestmentOperation>;
}

export interface IDashboardContext {
  investments: Array<IInvestment>;
  selectedInvestment: IInvestment | null;
  operations: Array<IInvestmentOperation>;
  operation: InvestmentOperation;
  addInvestment?: (investment: IInvestment) => void;
  removeInvestment?: (id: number) => void;
  updateInvestment?: (investment: IInvestment, amount: number, date: Date) => void;
  newInvestmentOperation?: (operation: IInvestmentOperation) => void;
  loadDataFromDb?: () => Promise<void>;
  exportDb?: () => Promise<void>;
  importDb?: (blob: Blob) => Promise<void>;
  removeDb?: () => Promise<void>;
  investmentProfit?: (investmentId: number) => Promise<number | undefined>;
  selectInvestment?: (investment: IInvestment) => void;
  selectInvestmentOperation?: (selectedInvestment: IInvestment, operation: InvestmentOperation) => void;
}

export interface IInvestment {
  id?: number,
  asset: IAsset;
  amount: number;
  date: Date;
}

export interface IInvestmentOperation {
  investmentId: number;
  asset: IAsset;
  date: Date;
  amount: number;
  amountBefore: number;
  amountAfter: number;
  operation: InvestmentOperation;
}

export interface IAsset {
  name: string;
  abbreviation?: string;
}
