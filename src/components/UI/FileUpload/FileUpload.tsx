import Button from '@material-ui/core/Button';
import { ChangeEvent } from 'react';

interface IFileUpload {
  /* eslint-disable-next-line */
  select: (file: Blob) => void;
}

const FileUpload = (props: IFileUpload) => {
  const { select } = props;

  const fileChangeHandler = ($event: ChangeEvent<HTMLInputElement>) => {
    if ($event.target.files?.length! > 0) {
      select($event.target.files![0]);
    }
  };
  return (
    <>
      <input
        id="button-file"
        accept="application/JSON"
        hidden
        type="file"
        onChange={fileChangeHandler}
      />
      {/* eslint-disable-next-line */}
      <label htmlFor="button-file">
        <Button
          color="primary"
          variant="outlined"
          component="span"
        >
          Upload
        </Button>
      </label>
    </>
  );
};

export default FileUpload;
