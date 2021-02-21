import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AdornmentInput from 'components/UI/AdornmentInput/AdornmentInput';
import DatePicker from 'components/UI/DatePicker/DatePicker';
import LabeledCheckbox from 'components/UI/Checkbox/LabeledCheckbox';
import { ChangeEvent, useState } from 'react';

interface IDialogProps {
  open: boolean;
  close: () => void;
}

interface IAddDialogState {
  amount: number | '';
  date: Date;
  asset: any;
  newAsset: boolean;
  newAssetName: string;
  newAssetAbbreviation: string;
}

const AddInvestmentDialog = (props: IDialogProps) => {
  const [state, setstate] = useState<IAddDialogState>({
    date: new Date(),
    asset: null,
    amount: '',
    newAsset: false,
    newAssetName: '',
    newAssetAbbreviation: '',
  });

  const { open, close } = props;
  const { amount, date, asset, newAsset, newAssetAbbreviation, newAssetName } = state;

  const amountChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, amount: $event.target.valueAsNumber });
  };

  const dateChangeHandler = (newDate: Date | null) => {
    if (newDate) {
      setstate({ ...state, date: newDate });
    }
  };
  const newAssetNameChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, newAssetName: $event.target.value });
  };

  const newAssetAbbreviationChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    setstate({ ...state, newAssetAbbreviation: $event.target.value });
  };

  const newAssetHandler = () => {
    setstate(prevState => {
      const isNewAsset = !prevState.newAsset;
      const updatedAssetName = newAsset ? '' : prevState.newAssetName;
      const updatedAssetAbbreviation = newAsset ? '' : prevState.newAssetAbbreviation;
      return (
        {
          ...prevState,
          newAsset: isNewAsset,
          newAssetName: updatedAssetName,
          newAssetAbbreviation: updatedAssetAbbreviation,
        }
      );
    });
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
        <div className="flex-row form-row">
          <TextField
            disabled={!newAsset}
            value={newAssetName}
            label="Name"
            variant="filled"
            onChange={newAssetNameChangeHandler}
          />
          <TextField
            disabled={!newAsset}
            value={newAssetAbbreviation}
            label="Abbreviation"
            variant="filled"
            onChange={newAssetAbbreviationChangeHandler}
          />
          <LabeledCheckbox
            value={newAsset}
            label="New asset"
            labelPlacement="top"
            noWrap
            change={newAssetHandler}
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
