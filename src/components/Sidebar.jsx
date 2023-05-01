import { Home, ModeNight, Pageview } from '@mui/icons-material'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material'
import React from 'react'

const Sidebar = () => {
  return (
    <Box 
      flex={1} 
      p={2}
      sx={{display: {xs: "none", sm: "block"}}}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href='/home'>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href='/home'>
              <ListItemIcon>
                <Pageview />
              </ListItemIcon>
              <ListItemText primary="Page One" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href='/home'>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Page Two" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component="a" href='/home'>
              <ListItemIcon>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Page Three" />
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