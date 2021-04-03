import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AdornmentInput from 'components/UI/AdornmentInput/AdornmentInput';
import DatePicker from 'components/UI/DatePicker/DatePicker';
import { FormEvent, ChangeEvent, useCallback, useState } from 'react';
import { IInvestment } from 'common/state.interfaces';
import { useAppDispatch } from 'store/hooks';
import { updateInvestment } from 'components/Layout/Dashboard/dashboardReducer';
import { toSerializableInvestment } from 'helpers/dashboard';

interface IUpdateDialogProps {
  investment: IInvestment;
  open: boolean;
  close: () => void;
}

const UpdateInvestmentDialog = (props: IUpdateDialogProps) => {
  const { open, close, investment } = props;

  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState<Date>(new Date());

  const dispatch = useAppDispatch();

  const closeHandler = useCallback(() => {
    setAmount('');
    setDate(new Date());
    close();
  }, [setAmount, setDate, close]);

  const amountChangeHandler = useCallback(($event: ChangeEvent<HTMLInputElement>) => {
    setAmount($event.target.valueAsNumber);
  }, [setAmount]);

  const dateChangeHandler = useCallback((newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
    }
  }, [setDate]);

  const updateInvestmentHandler = useCallback((event: FormEvent) => {
    event.preventDefault();
    dispatch(updateInvestment({ investment: toSerializableInvestment(investment), amount: amount as number, date: date.toISOString() }));
    closeHandler();
  }, [dispatch, closeHandler, investment, amount, date]);

  const assetName = investment?.asset.abbreviation
    ? `${investment?.asset.name} (${investment?.asset.abbreviation})`
    : investment?.asset.name;

  return (
    <Dialog open={open} onClose={closeHandler} aria-labelledby="form-dialog-title">
      <form onSubmit={updateInvestmentHandler}>
        <DialogTitle>
          Update
          {assetName}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Current ammount:&nbsp;
            {investment.amount}
          </DialogContentText>
          <DatePicker
            fullWidth
            label="Date"
            value={date}
            change={dateChangeHandler}
          />
          <AdornmentInput
            inputId="total-amount"
            type="number"
            fullWidth
            label="Amount"
            adornment="$"
            value={amount}
            change={amountChangeHandler}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default UpdateInvestmentDialog;
