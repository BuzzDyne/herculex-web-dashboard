import { Home, ModeNight, Pageview } from '@mui/icons-material'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { ROLE_MAPPING } from '../constants'

const Sidebar = () => {
  const { auth } = useAuth()

  return (
    <Box 
      flex={1} 
      p={2}
      sx={{display: {xs: "none", sm: "block"}}}
      >
        {auth.token_username} | {ROLE_MAPPING[auth.token_role_id] || '######'}
        
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