import { Container, TextField, Button, Typography, Alert, AlertTitle } from '@mui/material'
import React, { useState, useEffect } from 'react'
import axios from '../api/axios'
import useAuth from '../hooks/useAuth'
import jwt_decode from 'jwt-decode'
import { useNavigate, useLocation } from 'react-router-dom'



const LOGIN_URL = '/auth/login'

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');

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
          sx={{ width: '100%', marginBottom: 1 }}
          required
        />
        <TextField
          label="Password"
          type="password"
          value={pwd}
          autoComplete='off'
          onChange={(event) => setPwd(event.target.value)}
          sx={{ width: '100%', marginBottom: 1 }}
          required
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ width: '100%', marginBottom: 1 }}
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