import { ChangeEvent, ReactNode } from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

export interface IAdornmentInputProps {
  label: string;
  type: string;
  value?: string | number;
  adornment: string | ReactNode
  /* eslint-disable-next-line */
  change: (event: ChangeEvent<HTMLInputElement>) => void
}

const AdornmentInput = (props: IAdornmentInputProps) => {
  const { type, label, value, adornment, change: handleChange } = props;
  return (
    <FormControl>
      <InputLabel htmlFor="asset-amount">{label}</InputLabel>
      <Input
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
