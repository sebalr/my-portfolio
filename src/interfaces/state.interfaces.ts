export interface IAppState {
  dashboard: IDashboardState
}

export interface IDashboardState {
  investments: Array<IInvestment>;
}

export interface IInvestment {
  id: number,
  asset: IAsset;
  ammount: number;
  date: Date
}

export interface IAsset {
  name: string;
  abbreviation?: string;
}
