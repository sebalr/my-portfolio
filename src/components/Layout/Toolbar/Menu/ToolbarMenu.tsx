import { useState, MouseEvent, useContext } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { DashboardContext } from 'context/DashboardContext';
import { ModalContext } from 'context/ModalContext';

const ToolbarMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { exportDb } = useContext(DashboardContext);
  const { openLoadDbDialog } = useContext(ModalContext);

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

  const loadDbHandler = () => {
    openLoadDbDialog!();
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
        <MenuItem onClick={loadDbHandler}>Import database</MenuItem>
        <MenuItem onClick={handleClose}>Cleaer database</MenuItem>
      </Menu>
    </div>
  );
};

export default ToolbarMenu;
