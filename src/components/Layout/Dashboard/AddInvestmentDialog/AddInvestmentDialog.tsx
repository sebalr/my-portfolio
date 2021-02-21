import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AdornmentInput from 'components/UI/AdornmentInput/AdornmentInput';
import DatePicker from 'components/UI/DatePicker/DatePicker';
import { ChangeEvent, useState } from 'react';

interface IDialogProps {
  open: boolean;
  close: () => void;
}

interface IAddDialogState {
  amount: number | '',
  date: Date,
  asset: any,
}

const AddInvestmentDialog = (props: IDialogProps) => {
  const [state, setstate] = useState<IAddDialogState>({
    date: new Date(),
    asset: null,
    amount: '',
  });

  const { open, close } = props;
  const { amount, date, asset } = state;

  const amountChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, amount: $event.target.valueAsNumber });
  };

  const dateChangeHandler = (newDate: Date | null) => {
    if (newDate) {
      setstate({ ...state, date: newDate });
    }
  };

  const saveHandler = () => {
    console.log(state);
    close();
  };

  return (
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <DialogTitle>Add asset</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add new asset
        </DialogContentText>
        <div>
          <DatePicker
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
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
        <Button onClick={saveHandler} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddInvestmentDialog;
