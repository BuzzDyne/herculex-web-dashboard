import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AbcIcon from '@mui/icons-material/Abc';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemIcon>
        <DashboardIcon/>
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/admin">
      <ListItemIcon>
        <AbcIcon />
      </ListItemIcon>
      <ListItemText primary="Admin" />
    </ListItemButton>
    <ListItemButton component={Link} to="/designer">
      <ListItemIcon>
        <AbcIcon />
      </ListItemIcon>
      <ListItemText primary="Design" />
    </ListItemButton>
    <ListItemButton component={Link} to="/printer">
      <ListItemIcon>
        <AbcIcon />
      </ListItemIcon>
      <ListItemText primary="Printer" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    {/* <ListSubheader component="div" inset>
      Admin Tools
    </ListSubheader> */}
    <ListItemButton component={Link} to="/user_management">
      <ListItemIcon>
        <PeopleAltIcon />
      </ListItemIcon>
      <ListItemText primary="User Management" />
    </ListItemButton>
    <ListItemButton component={Link} to="/testpage">
      <ListItemIcon>
        <AbcIcon />
      </ListItemIcon>
      <ListItemText primary="Test Page" />
    </ListItemButton>
  </React.Fragment>
);