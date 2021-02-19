export interface IDashboardState {
  investments: Array<IInvestment>;
}

export interface IInvestment {
  asset: IAsset;
  ammount: number;
}

export interface IAsset {
  name: string;
  abbreviation?: string;
}
