/* eslint-disable no-unused-vars */

export enum InvestmentOperation {
  new = 1,
  increase,
  decrease,
  update
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

export interface IFilterOperations {
  from: Date;
  to: Date;
}
