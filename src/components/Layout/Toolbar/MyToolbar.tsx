import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ToolbarMenu from 'components/Layout/Toolbar/ToolbarMenu/ToolbarMenu';

const MyToolbar = () => (
  <>
    <AppBar position="static">
      <Toolbar>
        <div className="flex-row">
          <h3>My portfolio</h3>
          <ToolbarMenu />
        </div>
      </Toolbar>
    </AppBar>
  </>
);

export default MyToolbar;
