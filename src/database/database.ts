import Dexie from 'dexie';
import { IInvestment, IInvestmentOperation } from 'common/state.interfaces';

class InvestmentsDatabase extends Dexie {

  investments: Dexie.Table<IInvestment, number>;

  operations: Dexie.Table<IInvestmentOperation, number>;

  constructor(databaseName: string) {
    super(databaseName);
    this.version(1).stores(
      {
        investments: '++id,date',
        operations: '++id,date,operation,assetId',
      },
    );
    this.investments = this.table('investments');
    this.operations = this.table('operations');
  }

}

export default new InvestmentsDatabase('investmentsDb');
