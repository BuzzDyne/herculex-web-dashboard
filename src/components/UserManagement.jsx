import { Button, Dialog, DialogContent, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useNavigate, useLocation } from "react-router-dom"
import { DeleteOutline, Edit } from "@mui/icons-material"

function UserManagement() {
  const [users, setUsers] = useState()
  const [openDialog, setOpenDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [formErrors, setFormErrors] = useState({});
  

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

  }, [axiosPrivate, navigate, location]);

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  const openRegisDialog = () => {
    setOpenDialog(true)
  }

  const closeRegisDialog = () => {
    setOpenDialog(false)
  }

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  
  // Handle form submission
  const handleFormSubmit = (event) => {
    event.preventDefault();
  
    // Validate form inputs
    const errors = {};
    if (!newUser.username || newUser.username.length < 4) {
      errors.username = "Username must be at least 4 characters long.";
    }
    if (!newUser.password || newUser.password.length < 4) {
      errors.password = "Password must be at least 4 characters long.";
    }
    if (newUser.password !== newUser.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (!newUser.role) {
      errors.role = "Please select a role.";
    }
  
    // Set form errors, if any
    setFormErrors(errors);
  
    // If there are no errors, proceed with user registration
    if (Object.keys(errors).length === 0) {
      // Perform user registration logic here
      console.log("Registering user:", newUser);
      

      // Reset form
      setNewUser({
        username: "",
        password: "",
        confirmPassword: "",
        role: "",
      });
      // Close the registration dialog
      closeRegisDialog();
    }
  }


  return (
    <>
      <Typography variant="h5">User Management</Typography>
      <Button variant="contained" color="success" onClick={openRegisDialog}>New User</Button>
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
            {users?.map((user) => (
                  <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role_name}</TableCell>
                  <TableCell>{formatDate(user.created_dt)}</TableCell>
                  <TableCell>
                    <IconButton color="info">
                      <Edit/>
                    </IconButton>
                    <IconButton color="error">
                      <DeleteOutline/>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={closeRegisDialog}>
        <DialogContent>
          <Typography variant="h6">Register New User</Typography>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Username"
              name="username"
              value={newUser.username}
              onChange={handleFormInputChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              value={newUser.password}
              onChange={handleFormInputChange}
              type="password"
              error={!!formErrors.password}
              helperText={formErrors.password}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Re-enter Password"
              name="confirmPassword"
              value={newUser.confirmPassword}
              onChange={handleFormInputChange}
              type="password"
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              fullWidth
              required
              margin="normal"
            />
            <FormControl error={!!formErrors.role} fullWidth required margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleFormInputChange}
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="designer">Designer</MenuItem>
                <MenuItem value="printer">Printer</MenuItem>
                <MenuItem value="packer">Packer</MenuItem>
              </Select>
              {!!formErrors.role && (
                <FormHelperText>{formErrors.role}</FormHelperText>
              )}
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </>
  )
}

export default UserManagement