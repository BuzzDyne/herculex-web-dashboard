import { React, useState} from 'react'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './subcomponents/listItems';
// import Chart from './subcomponents/Chart';
// import Deposits from './subcomponents/Deposits';
import Copyright from './subcomponents/Copyright';
import { Outlet, useNavigate } from 'react-router-dom';
import { Avatar, InputBase, Menu, MenuItem, alpha } from '@mui/material';
import useAuth from '../hooks/useAuth';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = useState(false)
  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()

  const handleSearchBarChange = (event) => {
    const inputText = event.target.value;

    // Remove non-numeric characters
    let numericOnlyText = inputText.replace(/[^0-9]/g, '');
    
    // Remove leading zeros if present
    if (numericOnlyText.length > 1 && numericOnlyText[0] === '0') {
      numericOnlyText = numericOnlyText.slice(1);
    }

    // Prevent single zero input
    if (numericOnlyText === '0') {
      numericOnlyText = '';
    }
  
    setSearchText(numericOnlyText);
  }

  const handleKeyUp = (event) => {
    if (event.key === 'Enter' && searchText) {
      navigate(`/order/${searchText}`)   
    }
  }
  
  const toggleDrawer = () => {
    setOpen(!open);
  }

  const handleLogout = async () => {
    setAuth({})
    alert('Successfuly logged out!')
    navigate('/login', { replace: true})   
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
        <Toolbar
          sx={{
            pr: '24px', // keep right padding when drawer closed
          }}
        >
          <IconButton // Drawer Menu Icon
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: '36px',
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography // HerculexWeb
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{flexGrow: 1,display: { xs: 'none', sm: 'flex'}}}
          >
            HerculexWeb
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search OrderID…"
              value={searchText}
              onChange={handleSearchBarChange}
              onKeyUp={handleKeyUp}
            />
          </Search>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Avatar 
            sx={{width: 30, height: 30, ml: 1}}
            alt={auth.token_username?.toUpperCase()}
            src="/static"
            onClick={e => setMenuIsOpen(true)}
          />
        </Toolbar>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            open={menuIsOpen}
            onClose = {e => setMenuIsOpen(false)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem>My Profile</MenuItem>
            <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
          </Menu>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <Avatar 
              sx={{
                width: open ? 80 : 40, 
                height: open ? 80 : 40, 
                margin: '32px auto 8px auto'}}
              alt={auth.token_username?.toUpperCase()}
              src="/static"
              />
            {open && <>
              <Typography
                component="h6"
                variant="subtitle2"
                color="inherit"
                noWrap
                align="center"
              >
                {auth.token_username}
              </Typography>
              <Typography
                component="p"
                variant="subtitle2"
                color="inherit"
                noWrap
                align="center"
              >
                {(() => {
                  switch (auth.token_role_id) {
                    case 1:
                      return 'Admin';
                    case 2:
                      return 'Designer';
                    case 3:
                      return 'Printer';
                    case 4:
                      return 'Packer';
                    default:
                      return '';
                  }
                })()}
              </Typography>
            </>}
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {auth.token_role_id === 1 && secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Outlet />
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}