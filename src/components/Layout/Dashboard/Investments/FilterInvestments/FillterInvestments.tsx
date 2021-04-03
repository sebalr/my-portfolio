import { useCallback, useEffect } from 'react';
import DatePicker from 'components/UI/DatePicker/DatePicker';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { filterInvestmentOperations } from 'components/Layout/Dashboard/dashboardReducer';

const FillterInvestments = () => {
  const operationFilters = useAppSelector(state => state.dashboard.operationFilters);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);

    dispatch(filterInvestmentOperations({ ...operationFilters, from, to }));
  }, []);

  const toDateChangeHandler = useCallback((newDate: Date | null) => {
    if (newDate && operationFilters) {
      dispatch(filterInvestmentOperations({ ...operationFilters, to: newDate }));
    }
  }, [dispatch, operationFilters]);

  const fromDateChangeHandler = useCallback((newDate: Date | null) => {
    if (newDate && operationFilters) {
      dispatch(filterInvestmentOperations({ ...operationFilters, from: newDate }));
    }
  }, [dispatch, operationFilters]);

  if (!operationFilters) {
    return null;
  }

  return (
    <div className="form-row">
      <DatePicker
        size="small"
        inputVariant="outlined"
        label="From"
        value={operationFilters.from}
        change={fromDateChangeHandler}
      />
      <DatePicker
        size="small"
        inputVariant="outlined"
        label="To"
        value={operationFilters.to}
        change={toDateChangeHandler}
      />
    </div>
  );
};

export default FillterInvestments;
