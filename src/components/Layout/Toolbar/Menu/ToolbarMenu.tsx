import { useState, MouseEvent, useContext } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { DashboardContext } from 'context/DashboardContext';

const ToolbarMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { exportDb } = useContext(DashboardContext);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const downloadDbHandler = () => {
    exportDb!();
    handleClose();
  };

  return (
    <div>
      <IconButton
        color="inherit"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={downloadDbHandler}>Save databse</MenuItem>
        <MenuItem onClick={handleClose}>Import database</MenuItem>
        <MenuItem onClick={handleClose}>Cleaer database</MenuItem>
      </Menu>
    </div>
  );
};

export default ToolbarMenu;
