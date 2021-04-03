import { useCallback, useEffect } from 'react';
import DatePicker from 'components/UI/DatePicker/DatePicker';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { filterInvestmentOperations, selectDeserializedFilters } from 'components/Layout/Dashboard/dashboardReducer';
import { toSerializableFilters } from 'helpers/dashboard';

const FillterInvestments = () => {
  const operationFilters = useAppSelector(selectDeserializedFilters);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const to = new Date();
    const from = new Date();
    from.setMonth(from.getMonth() - 1);

    dispatch(filterInvestmentOperations(toSerializableFilters({ ...operationFilters, from, to })));
  }, []);

  const toDateChangeHandler = useCallback((newDate: Date | null) => {
    if (newDate && operationFilters) {
      dispatch(filterInvestmentOperations(toSerializableFilters({ ...operationFilters, to: newDate })));
    }
  }, [dispatch, operationFilters]);

  const fromDateChangeHandler = useCallback((newDate: Date | null) => {
    if (newDate && operationFilters) {
      dispatch(filterInvestmentOperations(toSerializableFilters({ ...operationFilters, from: newDate })));
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
