import { AccountCircle, Notifications } from '@mui/icons-material'
import { AppBar, Avatar, Badge, Box, InputBase, Menu, MenuItem, Toolbar, Typography, styled } from '@mui/material'
import React, { useState } from 'react'

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between"
})

const Search = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "0 10px",
  borderRadius: theme.shape.borderRadius,
  width: "40%"
}))

const ProfileIcon = styled(Box)(({ theme }) => ({
  display: "none",
  gap: "20px",
  alignItems: "center",
  [theme.breakpoints.up("sm")]: {
    display: "flex"
  }
}))

const UserBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  [theme.breakpoints.up("sm")]: {
    display: "none"
  }
}))

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <AppBar position="sticky">
      <StyledToolbar>
        <Typography variant="h6" sx={{display:{xs:"none", sm:"block"}}}>HerculexWeb</Typography>
        <Typography variant="h6" sx={{display:{xs:"block", sm:"none"}}}> HW</Typography>
        <Search>
          <InputBase placeholder='OrderID (#23XXX)'/>
        </Search>
        <ProfileIcon>
          <Badge badgeContent={1} color="error">
            <Notifications />
          </Badge>
          <Badge badgeContent={1} color="error">
            <Notifications />
          </Badge>
          <Badge badgeContent={1} color="error">
            <Avatar 
              sx={{width: 30, height: 30}}
              alt="John Doe" 
              src="/static"
              onClick={e => setOpen(true)}
              />
          </Badge>
        </ProfileIcon>
        <UserBox onClick={e => setOpen(true)}>
          <Avatar 
                sx={{width: 30, height: 30}}
                alt="John Doe" 
                src="/static"
                />
          <Typography variant="span">John Doe</Typography>
        </UserBox>
      </StyledToolbar>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose = {e => setOpen(false)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
    </AppBar>
  )
}

export default Navbar