import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AdornmentInput from 'components/UI/AdornmentInput/AdornmentInput';
import DatePicker from 'components/UI/DatePicker/DatePicker';
import { FormEvent, ChangeEvent, useState, useContext } from 'react';
import { DashboardContext } from 'context/DashboardContext';
import { IInvestment } from 'common/state.interfaces';

interface IUpdateDialogProps {
  investment: IInvestment;
  open: boolean;
  close: () => void;
}

interface IUpdateDialogState {
  amount: number | '';
  date: Date;
}

const UpdateInvestmentDialog = (props: IUpdateDialogProps) => {
  const emptyModal: IUpdateDialogState = {
    amount: '',
    date: new Date(),
  };

  const { updateInvestment } = useContext(DashboardContext);

  const [state, setstate] = useState<IUpdateDialogState>(emptyModal);

  const { open, close, investment } = props;
  const { amount, date } = state;

  const closeHandler = () => {
    setstate(emptyModal);
    close();
  };

  const amountChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, amount: $event.target.valueAsNumber });
  };

  const dateChangeHandler = (newDate: Date | null) => {
    if (newDate) {
      setstate({ ...state, date: newDate });
    }
  };

  const updateInvestmentHandler = (event: FormEvent) => {
    event.preventDefault();
    updateInvestment!(investment, state.amount as number, state.date);
    setstate(emptyModal);
    close();
  };

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
            Current ammount:
            {investment.amount}
          </DialogContentText>
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
export default UpdateInvestmentDialog;
