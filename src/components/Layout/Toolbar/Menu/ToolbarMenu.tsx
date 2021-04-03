import { useState, MouseEvent, useCallback } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useAppDispatch } from 'store/hooks';
import { showLoadDb } from 'components/Dialogs/modalReducer';
import { exportDb, removeDb } from 'components/Layout/Dashboard/dashboardReducer';

const ToolbarMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();

  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }, [setAnchorEl]);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const downloadDbHandler = useCallback(() => {
    dispatch(exportDb());
    handleClose();
  }, [dispatch, handleClose]);

  const loadDbHandler = useCallback(() => {
    dispatch(showLoadDb());
    handleClose();
  }, [dispatch, handleClose]);

  const clearDbHandler = useCallback(() => {
    dispatch(removeDb());
    handleClose();
  }, [dispatch, handleClose]);

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
