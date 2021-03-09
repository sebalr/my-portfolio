import { useContext, useEffect, useState } from 'react';
import DatePicker from 'components/UI/DatePicker/DatePicker';
import { DashboardContext } from 'context/DashboardContext';

interface IFilterState {
  from: Date;
  to: Date;
}

const FillterInvestments = () => {
  const { filterOperations, operationFilters } = useContext(DashboardContext);

  const refreshOperations = () => {
    filterOperations!({ from: operationFilters!.from, to: operationFilters!.to });
  };

  useEffect(() => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);

    filterOperations!({ ...operationFilters!, from, to });
  }, []);

  const toDateChangeHandler = (newDate: Date | null) => {
    if (newDate) {
      filterOperations!({ ...operationFilters!, to: newDate });
    }
  };
  const fromDateChangeHandler = (newDate: Date | null) => {
    if (newDate) {
      filterOperations!({ ...operationFilters!, from: newDate });
    }
  };

  return (
    <div className="form-row">
      <DatePicker
        size="small"
        inputVariant="outlined"
        label="From"
        value={operationFilters!.from}
        change={fromDateChangeHandler}
      />
      <DatePicker
        size="small"
        inputVariant="outlined"
        label="To"
        value={operationFilters!.to}
        change={toDateChangeHandler}
      />
    </div>
  );
};

export default FillterInvestments;
