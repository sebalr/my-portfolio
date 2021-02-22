import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AdornmentInput from 'components/UI/AdornmentInput/AdornmentInput';
import DatePicker from 'components/UI/DatePicker/DatePicker';
import { FormEvent, ChangeEvent, useState, useContext } from 'react';
import { DashboardContext } from 'context/DashboardContext';

interface IDialogProps {
  open: boolean;
  close: () => void;
}

interface IAddDialogState {
  amount: number | '';
  date: Date;
  asset: any;
  name: string;
  abbreviation: string;
}

const AddInvestmentDialog = (props: IDialogProps) => {
  const emptyModal: IAddDialogState = {
    amount: '',
    date: new Date(),
    asset: null,
    name: '',
    abbreviation: '',
  };

  const { addInvestment } = useContext(DashboardContext);

  const [state, setstate] = useState<IAddDialogState>(emptyModal);

  const { open, close } = props;
  const { amount, date, asset, name, abbreviation } = state;

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
  const newAssetNameChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, name: $event.target.value });
  };

  const newAssetAbbreviationChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, abbreviation: $event.target.value });
  };

  const saveInvestmentHandler = (event: FormEvent) => {
    event.preventDefault();
    addInvestment!({
      asset: {
        name: state.name,
        abbreviation: state.abbreviation,
      },
      ammount: state.amount as number,
      date: state.date,
    });
    setstate(emptyModal);
    close();
  };

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
