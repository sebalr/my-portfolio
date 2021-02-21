import { KeyboardDatePicker } from '@material-ui/pickers';

interface IDatePickerProps {
  label: string;
  fullWidth: boolean | undefined;
  value: Date | null;
  /* eslint-disable-next-line */
  change: (date: Date | null, changeValue?: string | null | undefined) => void;
}

const DatePicker = (props: IDatePickerProps) => {
  const { fullWidth, label, value, change } = props;
  return (
    <KeyboardDatePicker
      fullWidth={fullWidth}
      autoOk
      disableToolbar
      inputVariant="filled"
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
