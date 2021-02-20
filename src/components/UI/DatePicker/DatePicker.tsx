import { KeyboardDatePicker } from '@material-ui/pickers';

interface IDatePickerProps {
  label: string;
  value: Date | null;
  /* eslint-disable-next-line */
  change: (date: Date | null, changeValue?: string | null | undefined) => void;
}

const DatePicker = (props: IDatePickerProps) => {
  const { label, value, change } = props;
  return (
    <div>
      <KeyboardDatePicker
        disableToolbar
        variant="inline"
        format="dd/MM/yyyy"
        margin="normal"
        label={label}
        value={value}
        onChange={change}
        KeyboardButtonProps={{ 'aria-label': 'change date' }}
      />
    </div>
  );
};

export default DatePicker;
