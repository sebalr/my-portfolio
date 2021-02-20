import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export interface IDialogProps {
  open: boolean;
  close: () => void
}

const AddInvestmentDialog = (props: IDialogProps) => {
  const { open, close } = props;
  return (
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <DialogTitle>Add asset</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Add new asset
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Email Address"
          type="email"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="primary">
          Cancel
        </Button>
        <Button onClick={close} color="primary">
          Subscribe
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default AddInvestmentDialog;
