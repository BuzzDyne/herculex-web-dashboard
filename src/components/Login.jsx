import { Container, TextField, Button, Typography, Alert, AlertTitle } from '@mui/material'
import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../context/AuthProvider'
import axios from '../api/axios'

const LOGIN_URL = '/auth/login'

const Login = () => {
  const { setAuth } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);

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
          withCredentials: true
        }
      )

      console.log(JSON.stringify(response?.data))

      const accessToken = response?.data?.accessToken
      // const roles = response?.data?.roles

      setAuth({accessToken})

      setUsername('')
      setPwd('')
      setSuccess(true)
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response')
      } else if (err.response.status === 400) {
        setErrMsg("Unauthorized")
      } else {
        setErrMsg("Something went wrong...")
      }
    }


  }

  return (
    <Container>
        <Typography variant="h3" align="center" sx={{ margin: '2rem' }}>
          HerculexWeb
        </Typography>
        <form
          onSubmit={handleSubmit} 
          sx={{display: 'flex',flexDirection: 'column',alignItems: 'center',margin: 'auto',width: '50%'}}>
          <TextField
            label="Username"
            value={username}
            autoComplete='off'
            onChange={(event) => setUsername(event.target.value)}
            sx={{ margin: 1, width: '100%' }}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={pwd}
            autoComplete='off'
            onChange={(event) => setPwd(event.target.value)}
            sx={{ margin: 1, width: '100%' }}
            required
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ margin: 2, width: '100%' }}
          >Login
          </Button>
          {/* <p className={errMsg ? "errmsg" : "offscreen"}>{errMsg}</p> */}
        </form>
        {errMsg && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errMsg}
          </Alert>
        )}
    </Container>
  )
}

export default Login