import { TextField, Button, Typography, Alert, AlertTitle, ThemeProvider, Grid, CssBaseline, Avatar, createTheme, FormControlLabel, Checkbox, Paper, Box } from '@mui/material'
import React, { useState, useEffect } from 'react'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import jwt_decode from 'jwt-decode'
import { useNavigate, useLocation } from 'react-router-dom'
import Copyright from './subcomponents/Copyright';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const LOGIN_URL = '/auth/login'

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const defaultTheme = createTheme();

  useEffect(() => {
    setErrMsg('')
  }, [username, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(LOGIN_URL, 
        JSON.stringify({username, password: pwd}),
        {
          headers: {'Content-Type': 'application/json'},
          // withCredentials: true
        }
      )

      console.log(response)

      const accessToken = response?.data?.access_token
      const refreshToken = response?.data?.refresh_token

      const decodedData = jwt_decode(accessToken)

      const token_username    = decodedData.sub 
      const token_role_id     = decodedData.role_id

      setAuth({token_username, token_role_id, accessToken, refreshToken})

      setUsername('')
      setPwd('')
      navigate(from, { replace: true })
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
        console.log(err)
      } else if (err.response.status === 400) {
        setErrMsg(err.response.data.detail)
      } else {
        setErrMsg("Something went wrong...")
        console.log(err)
      }
    }


  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={pwd}
                label="Password"
                type="password"
                id="password"
                onChange={(event) => setPwd(event.target.value)}
                autoComplete="off"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              {errMsg && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {errMsg}
                </Alert>
              )}
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>

        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default Login