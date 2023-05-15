import { Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useNavigate, useLocation } from "react-router-dom"
import { DeleteOutline, Edit } from "@mui/icons-material"

function UserManagement() {
  const [users, setUsers] = useState()
  const axiosPrivate = useAxiosPrivate()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('/api_user/get_list', {
          signal: controller.signal
        })
  
        console.log(response.data)
  
        isMounted && setUsers(response.data)
      } catch (err) {
        console.log(err)
        if(err?.response?.status === 422 && err?.response?.data?.detail === 'Signature has expired') {
          alert('Token expired! Please relogin!')       
          navigate('/login', {state: {from: location}, replace: true})   
        }
      }
    }

    getUsers();

    return () => {
      isMounted = false
      controller.abort()
    }

  }, []);

  return (
    <>
      <Typography variant="h5">User Management</Typography>
      <Button variant="contained" color="success">New User</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => {
              const date = new Date(user.created_dt)
              const formattedTS = date.toLocaleString()

              return (
                  <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role_name}</TableCell>
                  <TableCell>{formattedTS}</TableCell>
                  <TableCell>
                    <IconButton color="info">
                      <Edit/>
                    </IconButton>
                    <IconButton color="error">
                      <DeleteOutline/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
            }

            )}
            
          </TableBody>
        </Table>
      </TableContainer>

    </>
  )
}

export default UserManagement