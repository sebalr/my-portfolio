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
import { IInvestment, IInvestmentOperation, InvestmentOperation } from 'common/state.interfaces';

interface IOperationDialogProps {
  investment: IInvestment;
  open: boolean;
  operation?: InvestmentOperation;
  close: () => void;
}

interface IOperationDialogState {
  amount: number | '';
  amountBefore: number | '';
  amountAfter: number | '';
  date: Date;
}

const NewOperationDialog = (props: IOperationDialogProps) => {
  const emptyModal: IOperationDialogState = {
    amount: '',
    amountBefore: '',
    amountAfter: '',
    date: new Date(),
  };

  const { newInvestmentOperation } = useContext(DashboardContext);

  const [state, setstate] = useState<IOperationDialogState>(emptyModal);

  const { investment, operation, open, close } = props;
  const { amount, date, amountAfter, amountBefore } = state;

  if (!operation) {
    return null;
  }

  const closeHandler = () => {
    setstate(emptyModal);
    close();
  };

  const syncValues = (newState: IOperationDialogState): IOperationDialogState => {
    const auxState = { ...newState };
    auxState.amountBefore = Number.isNaN(auxState.amountBefore) ? 0 : auxState.amountBefore;
    auxState.amount = Number.isNaN(auxState.amount) ? 0 : auxState.amount;
    if (operation === InvestmentOperation.increase) {
      auxState.amountAfter = Number(auxState.amountBefore) + Number(auxState.amount);
    } else if (operation === InvestmentOperation.decrease) {
      auxState.amountAfter = Number(auxState.amountBefore) - Number(auxState.amount);
    }
    return auxState;
  };

  const amountChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate(prevState => {
      const newState = { ...prevState, amount: $event.target.valueAsNumber };
      return syncValues(newState);
    });
  };

  const ammountBeforeChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate(prevState => {
      const newState = { ...prevState, amountBefore: $event.target.valueAsNumber };
      return syncValues(newState);
    });
  };

  const dateChangeHandler = (newDate: Date | null) => {
    if (newDate) {
      setstate({ ...state, date: newDate });
    }
  };

  const newOperationHandler = (event: FormEvent) => {
    event.preventDefault();
    const newOperation: IInvestmentOperation = {
      investmentId: investment.id!,
      asset: investment.asset,
      date,
      amount: Number(amount),
      amountBefore: Number(amountBefore),
      amountAfter: Number(amountAfter),
      operation: operation!,
    };
    newInvestmentOperation!(newOperation);
    setstate(emptyModal);
    close();
  };

  let operationLabel = 'ERROR!';
  if (operation === InvestmentOperation.increase) {
    operationLabel = 'Deposit';
  } else if (operation === InvestmentOperation.decrease) {
    operationLabel = 'Whitdraw';
  }

  return (
    <Dialog open={open} onClose={closeHandler}>
      <form onSubmit={newOperationHandler}>
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
              value={amountBefore}
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
          </div>
          <span>
            Total after operation: $
            {
              amountAfter.toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )
            }
          </span>

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
export default NewOperationDialog;
