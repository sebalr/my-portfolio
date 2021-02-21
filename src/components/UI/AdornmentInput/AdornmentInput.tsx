import { ChangeEvent, ReactNode } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';

interface IAdornmentInputProps {
  label: string;
  type: string;
  value: string | number | undefined;
  adornment: string | ReactNode;
  fullWidth: boolean | undefined;
  /* eslint-disable-next-line */
  change: (event: ChangeEvent<HTMLInputElement>) => void
}

const AdornmentInput = (props: IAdornmentInputProps) => {
  const { type, label, value, adornment, change: handleChange, fullWidth } = props;
  return (
    <FormControl
      margin="normal"
      variant="filled"
      fullWidth={fullWidth}
    >
      <InputLabel htmlFor="asset-amount">{label}</InputLabel>
      <FilledInput
        type={type}
        id="asset-amount"
        value={value}
        onChange={handleChange}
        startAdornment={<InputAdornment position="start">{adornment}</InputAdornment>}
      />
    </FormControl>
  );
};

export default AdornmentInput;
