import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AdornmentInput from 'components/UI/AdornmentInput/AdornmentInput';
import DatePicker from 'components/UI/DatePicker/DatePicker';
import { FormEvent, ChangeEvent, useState, useCallback } from 'react';
import { IInvestment, IInvestmentOperation, InvestmentOperation } from 'common/state.interfaces';
import { useAppDispatch } from 'store/hooks';
import { newInvestmentOperation } from 'store/dashboard/dashboardReducer';

interface IOperationDialogProps {
  investment: IInvestment;
  open: boolean;
  operation?: InvestmentOperation;
  close: () => void;
}

interface ISyncAmount {
  amount: number | '';
  amountBefore: number | '';
  amountAfter: number | '';
}

const syncValues = (amounts: ISyncAmount, operation: InvestmentOperation): ISyncAmount => {
  const values = { ...amounts };
  values.amountBefore = Number.isNaN(values.amountBefore) ? '' : values.amountBefore;
  values.amount = Number.isNaN(values.amount) ? '' : values.amount;
  if (operation === InvestmentOperation.increase) {
    values.amountAfter = Number(values.amountBefore) + Number(values.amount);
  } else if (operation === InvestmentOperation.decrease) {
    values.amountAfter = Number(values.amountBefore) - Number(values.amount);
  }
  return values;
};

const NewOperationDialog = (props: IOperationDialogProps) => {
  const dispacth = useAppDispatch();
  const [amount, setAmount] = useState<number | ''>('');
  const [amountBefore, setAmountBefore] = useState<number | ''>('');
  const [amountAfter, setamountAfter] = useState<number | ''>('');
  const [date, setDate] = useState<Date>(new Date());

  const { investment, operation, open, close } = props;

  if (!operation) {
    return null;
  }

  const closeHandler = useCallback(() => {
    setAmount('');
    setAmountBefore('');
    setamountAfter('');
    setDate(new Date());
    close();
  }, [close]);

  const amountChangeHandler = useCallback(($event: ChangeEvent<HTMLInputElement>) => {
    const values = syncValues({ amount: $event.target.valueAsNumber, amountBefore, amountAfter }, operation);
    setAmount(values.amount);
    setAmountBefore(values.amountBefore);
    setamountAfter(values.amountAfter);
  }, [operation, amountBefore, amountAfter]);

  const ammountBeforeChangeHandler = useCallback(($event: ChangeEvent<HTMLInputElement>) => {
    const values = syncValues({ amountBefore: $event.target.valueAsNumber, amount, amountAfter }, operation);
    setAmount(values.amount);
    setAmountBefore(values.amountBefore);
    setamountAfter(values.amountAfter);
  }, [operation, amount, amountAfter]);

  const dateChangeHandler = useCallback((newDate: Date | null) => {
    if (newDate) {
      setDate(newDate);
    }
  }, []);

  const newOperationHandler = useCallback((event: FormEvent) => {
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
    dispacth(newInvestmentOperation(newOperation));
    closeHandler();
  }, [dispacth, closeHandler]);

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
