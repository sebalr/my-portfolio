import { KeyboardDatePicker } from '@material-ui/pickers';

interface IDatePickerProps {
  inputVariant?: 'filled' | 'standard' | 'outlined';
  size?: 'small' | 'medium';
  label: string;
  fullWidth?: boolean;
  value: Date | null;
  /* eslint-disable-next-line */
  change: (date: Date | null, changeValue?: string | null | undefined) => void;
}

const DatePicker = (props: IDatePickerProps) => {
  const { fullWidth, label, value, change, inputVariant = 'filled', size } = props;
  return (
    <KeyboardDatePicker
      size={size}
      fullWidth={fullWidth}
      autoOk
      disableToolbar
      inputVariant={inputVariant}
      variant="inline"
      format="dd/MM/yyyy"
      margin="normal"
      label={label}
      value={value}
      onChange={change}
      KeyboardButtonProps={{ 'aria-label': 'change date' }}
    />
  );
};

export default DatePicker;
