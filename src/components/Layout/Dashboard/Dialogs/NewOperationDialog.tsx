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
import { IAsset, IInvestment, InvestmentOperation } from 'common/state.interfaces';

interface IOperationDialogProps {
  open: boolean;
  close: () => void;
}

interface IOperationDialogState {
  amount: number | '';
  amountBefore: number | '';
  afterOperation: number | '';
  date: Date;
  asset: IAsset | null;
  operation: InvestmentOperation;
}

const AddInvestmentDialog = (props: IOperationDialogProps) => {
  const emptyModal: IOperationDialogState = {
    amount: '',
    amountBefore: '',
    afterOperation: '',
    date: new Date(),
    asset: null,
    operation: InvestmentOperation.update,
  };

  const { addInvestment } = useContext(DashboardContext);

  const [state, setstate] = useState<IOperationDialogState>(emptyModal);

  const { open, close } = props;
  const { amount, date, asset, amountBefore, afterOperation, operation } = state;

  const closeHandler = () => {
    setstate(emptyModal);
    close();
  };

  const amountChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate(prevState => {
      const newState = { ...state, amount: $event.target.valueAsNumber };
      if (prevState.amountBefore >= 0) {
        if (operation === InvestmentOperation.increase) {
          newState.afterOperation = Number(prevState.amountBefore) + newState.amount;
        } else if (operation === InvestmentOperation.decrease) {
          newState.afterOperation = Number(prevState.amountBefore) - newState.amount;
        } else {
          newState.afterOperation = newState.amount;
        }
      }
      return newState;
    });
  };

  const dateChangeHandler = (newDate: Date | null) => {
    if (newDate) {
      setstate({ ...state, date: newDate });
    }
  };

  const ammountBeforeChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate(prevState => {
      const newState = { ...state, amountBefore: $event.target.valueAsNumber };
      if (prevState.amount >= 0) {
        if (operation === InvestmentOperation.increase) {
          newState.afterOperation = Number(prevState.amountBefore) + Number(newState.amount);
        } else if (operation === InvestmentOperation.decrease) {
          newState.afterOperation = Number(prevState.amountBefore) - Number(newState.amount);
        } else {
          newState.afterOperation = newState.amount;
        }
      }
      return newState;
    });
  };

  const saveInvestmentHandler = (event: FormEvent) => {
    event.preventDefault();
    addInvestment!({
      id: 0,
      asset: {
        name: state?.asset?.name || '',
        abbreviation: state?.asset?.abbreviation,
      },
      amount: state.amount as number,
      date: state.date,
    });
    setstate(emptyModal);
    close();
  };

  let operationLabel = 'Deposit';
  if (operation === InvestmentOperation.decrease) {
    operationLabel = 'Whidraw';
  } else if (operation === InvestmentOperation.update) {
    operationLabel = 'Update total';
  }
  return (


    <Dialog open={open} onClose={closeHandler} aria-labelledby="form-dialog-title">
      <form onSubmit={saveInvestmentHandler}>
        <DialogTitle>New operation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {operationLabel}
          </DialogContentText>
          <DatePicker
            fullWidth
            label="Date"
            value={date}
            change={dateChangeHandler}
          />
          <div className="flex-row form-row">
            <AdornmentInput
              type="number"
              fullWidth
              label="Total before operation"
              adornment="$"
              value={amount}
              change={ammountBeforeChangeHandler}
            />
            <AdornmentInput
              type="number"
              fullWidth
              label="Operation amount"
              adornment="$"
              value={amount}
              change={amountChangeHandler}
            />
            <span>
              Total after operation: $
              {afterOperation.toLocaleString()}
            </span>
          </div>

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
