import { Home, ModeNight, Pageview } from '@mui/icons-material'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Sidebar = () => {
  const { auth, setAuth } = useAuth()

  return (
    <Box 
      flex={1} 
      p={2}
      sx={{display: {xs: "none", sm: "block"}}}
      >
        {auth.token_username} | {
          auth.token_role_id === 1
            ? 'Admin'
            : auth.token_role_id === 2
              ? 'Designer'
              : auth.token_role_id === 3
                ? 'Printer'
                  : auth.token_role_id === 4
                    ? 'Packer'
                    : '######'
        }
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/admin">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Admin" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/user_management">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="User Management" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/designer">
              <ListItemIcon>
                <Pageview />
              </ListItemIcon>
              <ListItemText primary="Designer" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/printer">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Printer" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={Link} to="/packer">
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Packer" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ModeNight />
              </ListItemIcon>
              <Switch />
            </ListItemButton>
          </ListItem>
        </List>
    </Box>
  )
}

export default Sidebar