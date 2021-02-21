import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import classes from './LabeledCheckbox.module.css';

interface ICheckboxProps {
  label: string;
  labelPlacement: 'top' | 'end' | 'start' | 'bottom' | undefined;
  value: boolean;
  change: () => void;
  noWrap: boolean;
}

const LabeledCheckbox = (props: ICheckboxProps) => {
  const { labelPlacement, label, value, change, noWrap } = props;
  const checkBox = (
    <Checkbox
      checked={value}
      color="primary"
      onChange={change}
    />

  );

  return (
    <FormControlLabel
      className={noWrap ? classes.noWrap : ''}
      value="top"
      control={checkBox}
      label={label}
      labelPlacement={labelPlacement}
    />
  );
};

export default LabeledCheckbox;
