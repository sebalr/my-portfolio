import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

export interface ISelectorProps {
  items: [{ item: any, text: string }];
  className?: string;
  label: string,
  selectedValue?: any,
  handleChange: () => void,
}

const Selector = (props: ISelectorProps) => {
  const { items, className, label, selectedValue, handleChange } = props;
  const menuItems = items.map(item => <MenuItem value={item.item}>{item.text}</MenuItem>);

  return (
    <FormControl variant="filled" className={className}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={selectedValue}
        onChange={handleChange}
      >
        {menuItems}
      </Select>
    </FormControl>
  );
};

export default Selector;
