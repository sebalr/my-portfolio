export enum InvestmnetOperation {
  add = 1,
  remove,
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
  amount: number;
  operation: InvestmnetOperation;
  date: Date;
}

export interface IAsset {
  name: string;
  abbreviation?: string;
}
