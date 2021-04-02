import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AdornmentInput from 'components/UI/AdornmentInput/AdornmentInput';
import DatePicker from 'components/UI/DatePicker/DatePicker';
import { FormEvent, ChangeEvent, useState, useCallback } from 'react';
import { useAppDispatch } from 'store/hooks';
import { addInvestment } from 'store/dashboard/dashboardReducer';

interface IDialogProps {
  open: boolean;
  close: () => void;
}

const AddInvestmentDialog = (props: IDialogProps) => {
  const dispatch = useAppDispatch();

  const [amount, setAmount] = useState<number | ''>('');
  const [name, setName] = useState<string>('');
  const [abbreviation, setAbbreviation] = useState<string>('');
  const [date, setDate] = useState<Date>(new Date());

  const { open, close } = props;

  const closeHandler = useCallback(() => {
    setAmount('');
    setName('');
    setAbbreviation('');
    setDate(new Date());
    close();
  }, [close]);

  const amountChangeHandler = useCallback(($event: ChangeEvent<HTMLInputElement>) => {
    setAmount($event.target.valueAsNumber);
  }, []);

  const newAssetNameChangeHandler = useCallback(($event: ChangeEvent<HTMLInputElement>) => {
    setName($event.target.value);
  }, []);

  const newAssetAbbreviationChangeHandler = useCallback(($event: ChangeEvent<HTMLInputElement>) => {
    setAbbreviation($event.target.value);
  }, []);

  const dateChangeHandler = useCallback((newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
    }
  }, []);

  const saveInvestmentHandler = useCallback((event: FormEvent) => {
    event.preventDefault();
    const newInvestment = {
      asset: {
        name,
        abbreviation,
      },
      amount: amount as number,
      date,
    };
    dispatch(addInvestment(newInvestment));

    closeHandler();
  }, [closeHandler, dispatch]);

  return (
    <Dialog open={open} onClose={closeHandler} aria-labelledby="form-dialog-title">
      <form onSubmit={saveInvestmentHandler}>
        <DialogTitle>Add asset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add new asset
          </DialogContentText>
          <div className="flex-row form-row">
            <TextField
              className="flex-grow"
              value={name}
              label="Name"
              variant="filled"
              onChange={newAssetNameChangeHandler}
            />
            <TextField
              className="flex-grow"
              value={abbreviation}
              label="Abbreviation"
              variant="filled"
              onChange={newAssetAbbreviationChangeHandler}
            />
          </div>
          <DatePicker
            fullWidth
            label="Date"
            value={date}
            change={dateChangeHandler}
          />
          <AdornmentInput
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
export default AddInvestmentDialog;
