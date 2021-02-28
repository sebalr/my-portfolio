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
import FileUpload from 'components/UI/FileUpload/FileUpload';

interface ILoadDbDialogProps {
  open: boolean;
  close: () => void;
}

const ImportDbDialog = (props: ILoadDbDialogProps) => {
  const { importDb } = useContext(DashboardContext);
  const [file, setfile] = useState<Blob | null>(null);

  const { open, close } = props;

  const fileChangeHandler = (selectedFile: Blob) => {
    setfile(selectedFile);
  };

  const loadDbHandler = (event: FormEvent) => {
    event.preventDefault();
    if (file) {
      importDb!(file);
      close();
    }
  };

  return (
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <form onSubmit={loadDbHandler}>
        <DialogTitle>
          Import Database
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This operation will replace curent database
          </DialogContentText>
          <FileUpload select={fileChangeHandler} />
        </DialogContent>
        <DialogActions>
          <Button onClick={close} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Load
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default ImportDbDialog;
