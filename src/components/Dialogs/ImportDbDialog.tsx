import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormEvent, useCallback, useState } from 'react';
import FileUpload from 'components/UI/FileUpload/FileUpload';
import { useAppDispatch } from 'store/hooks';
import { importDb } from 'components/Layout/Dashboard/dashboardReducer';

interface ILoadDbDialogProps {
  open: boolean;
  close: () => void;
}

const ImportDbDialog = (props: ILoadDbDialogProps) => {
  const dispatch = useAppDispatch();

  const [file, setfile] = useState<Blob | null>(null);

  const { open, close } = props;

  const fileChangeHandler = useCallback((selectedFile: Blob) => {
    setfile(selectedFile);
  }, [setfile]);

  const loadDbHandler = useCallback((event: FormEvent) => {
    event.preventDefault();
    if (file) {
      dispatch(importDb(file));
      close();
    }
  }, [close, dispatch, file]);

  return (
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <form onSubmit={loadDbHandler}>
        <DialogTitle>
          Import Databases
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
