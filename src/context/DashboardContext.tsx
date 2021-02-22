import { IDashboardContext, IDashboardState, IInvestment } from 'interfaces/state.interfaces';
import { createContext, useState } from 'react';
import InvestmentsDatabase from 'database/database';

export const DashboardContext = createContext<IDashboardContext>({ state: { investments: [] } });

const DashboardProvider = (props: any) => {
  const { children } = props;
  const [state, setState] = useState<IDashboardState>({ investments: [] });

  const addInvestment = async (investment: IInvestment) => {
    const id = await InvestmentsDatabase.investments.add(investment);
    const updatedInvestment = { ...investment, id };
    setState(prevState => ({ ...prevState, investments: [...prevState.investments, updatedInvestment] }));
  };

  const removeInvestment = (id: number) => {
    setState(prevState => {
      const newArray = prevState.investments.filter(item => item.id !== id);
      return ({ ...prevState, investments: newArray });
    });
  };

  const updateInvestments = (investments: IInvestment[]) => {
    setState(prevState => ({ ...prevState, investments }));
  };

  return (
    <DashboardContext.Provider value={{ state, addInvestment, removeInvestment, updateInvestments }}>
      {children}
    </DashboardContext.Provider>
  );
};

export default DashboardProvider;
