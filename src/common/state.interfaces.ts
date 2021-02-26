export enum InvestmentOperation {
  new = 1,
  increase,
  decrease,
  update
}

/* eslint-disable no-unused-vars */
export interface IAppState {
  addDialogOn: boolean,
}

export interface IDashboardProviderState {
  investments: Array<IInvestment>;
  selectedInvestment: IInvestment | null;
}

export interface IDashboardContext {
  dashboardContext: IDashboardProviderState;
  updateInvestments?: (investment: IInvestment[]) => void;
  addInvestment?: (investment: IInvestment) => void;
  removeInvestment?: (id: number) => void;
  updateInvestment?: (investment: IInvestment, amount: number, date: Date) => void;
  newInvestmentOperation?: (operation: IInvestmentOperation) => void;
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
