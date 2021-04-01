import { useState, MouseEvent, useContext, useCallback } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { DashboardContext } from 'context/DashboardContext';
import { useAppDispatch } from 'store/hooks';
import { showLoadDb } from 'store/modal/modalReducer';

const ToolbarMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { exportDb, removeDb } = useContext(DashboardContext);
  const dispatch = useAppDispatch();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const downloadDbHandler = useCallback(() => {
    exportDb!();
    handleClose();
  }, []);

  const loadDbHandler = useCallback(() => {
    dispatch(showLoadDb());
    handleClose();
  }, []);

  const clearDbHandler = useCallback(() => {
    removeDb!();
    handleClose();
  }, []);

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
        <MenuItem onClick={clearDbHandler}>Clear database</MenuItem>
      </Menu>
    </div>
  );
};

export default ToolbarMenu;
