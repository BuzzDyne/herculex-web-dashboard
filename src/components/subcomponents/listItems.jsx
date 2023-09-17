import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
// import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import SettingsIcon from '@mui/icons-material/Settings';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import PrintIcon from '@mui/icons-material/Print';
import AbcIcon from '@mui/icons-material/Abc';
import { Link } from 'react-router-dom';

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemIcon>
        <DashboardIcon/>
      </ListItemIcon>
      <ListItemText primary="Active Tasks" />
    </ListItemButton>
    <ListItemButton component={Link} to="/admin">
      <ListItemIcon>
        <DashboardIcon/>
      </ListItemIcon>
      <ListItemText primary="All Orders" />
    </ListItemButton>
    <ListItemButton component={Link} to="/designer">
      <ListItemIcon>
        <DesignServicesIcon />
      </ListItemIcon>
      <ListItemText primary="Design" />
    </ListItemButton>
    <ListItemButton component={Link} to="/printer">
      <ListItemIcon>
        <PrintIcon />
      </ListItemIcon>
      <ListItemText primary="Printer" />
    </ListItemButton>
    <ListItemButton component={Link} to="/packer">
      <ListItemIcon>
        <UnarchiveIcon />
      </ListItemIcon>
      <ListItemText primary="Packer" />
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
    <ListItemButton component={Link} to="/system_monitor">
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="System Monitoring" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AbcIcon />
      </ListItemIcon>
      <ListItemText primary="User Profile" />
    </ListItemButton>
    <ListItemButton component={Link} to="/testpage">
      <ListItemIcon>
        <AbcIcon />
      </ListItemIcon>
      <ListItemText primary="Test Page" />
    </ListItemButton>
  </React.Fragment>
);