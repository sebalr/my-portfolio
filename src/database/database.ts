import Dexie from 'dexie';
import { IInvestment } from 'interfaces/state.interfaces';

class InvestmentsDatabase extends Dexie {

  investments: Dexie.Table<IInvestment, number>;

  constructor(databaseName: string) {
    super(databaseName);
    this.version(1).stores({
      investments: '++id,date',
    });
    this.investments = this.table('investments');
  }

}

export default new InvestmentsDatabase('investmentsDb');
