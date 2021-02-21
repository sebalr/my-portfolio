/* eslint-disable no-unused-vars */
export interface IAppState {
  addDialogOn: boolean,
}

export interface IDashboardState {
  investments: Array<IInvestment>;
}

export interface IDashboardContext {
  state: IDashboardState;
  updateInvestments?: (investment: IInvestment[]) => void;
  addInvestment?: (investment: IInvestment) => void;
  removeInvestment?: (id: number) => void;
}

export interface IInvestment {
  id?: number,
  asset: IAsset;
  ammount: number;
  date: Date
}

export interface IAsset {
  name: string;
  abbreviation?: string;
}
