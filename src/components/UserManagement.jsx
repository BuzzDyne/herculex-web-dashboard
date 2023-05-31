import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useNavigate, useLocation } from "react-router-dom"
import { DeleteOutline, Edit } from "@mui/icons-material"

function UserManagement() {
  const [users, setUsers] = useState()
  const [isOpenRegisDialog, setIsOpenRegisDialog] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [deleteDialogData, setDeleteDialogData] = useState({
    id: "",
    username: ""
  });
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [editDialogData, setEditDialogData] = useState({
    id: "",
    username: "",
    created_dt: "",
    last_login_dt: "",
    role_name: "",
    edit_password: "",
    edit_confirmPassword: "",
  });
  const [numberSubmitted, setNumberSubmitted] = useState(0);
  const [regisFormErrors, setRegisFormErrors] = useState({});
  const [editFormErrors, setEditFormErrors]   = useState({});

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

  }, [axiosPrivate, navigate, location, numberSubmitted]);

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  const incrementNumberSubmitted = () => {
    setNumberSubmitted(numberSubmitted => numberSubmitted + 1);
  }

  const openRegisDialog = () => {
    setIsOpenRegisDialog(true)
  }
  const closeRegisDialog = () => {
    setIsOpenRegisDialog(false)
  }
  const openDeleteDialog = () => {
    setIsOpenDeleteDialog(true)
  }
  const closeDeleteDialog = () => {
    setIsOpenDeleteDialog(false)
  }
  const openEditDialog = () => {
    setIsOpenEditDialog(true);
  };
  const closeEditDialog = () => {
    setIsOpenEditDialog(false);
  };

  const handleRegisFormInputChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };
  const handleEditFormInputChange = (event) => {
    const { name, value } = event.target;
    setEditDialogData((prevData) => ({ ...prevData,[name]: value }));
  };

  const getEditUserData = async (id) => {
    try {
      const response = await axiosPrivate.get(`/api_user/id/${id}`);
      const userData = response.data;
      // {
      //   'id'            : user.id,
      //   'username'      : user.username,
      //   'created_dt'    : user.created_dt,
      //   'last_login_dt' : user.last_login_dt,
      //   'role_name'     : user.role_name,
      // }
      setEditDialogData(userData);
      setEditDialogData((prevState) => ({
        ...prevState,
        id            : userData.id,
        username      : userData.username,
        created_dt    : userData.created_dt,
        last_login_dt : userData.last_login_dt,
        role_name     : userData.role_name,
      }));
    } catch (err) {
      console.log(err);
      alert(err);
    }
  };
  
  // Handle form submission
  const handleRegisFormSubmit = async (event) => {
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
    setRegisFormErrors(errors);
  
    // If there are no errors, proceed with user registration
    if (Object.keys(errors).length === 0) {
      try {
      const response = await axiosPrivate.post('/auth/signup', {
        username: newUser.username,
        password: newUser.password,
        rolename: newUser.role.toLowerCase()
      });

      // Reset form
      setNewUser({
        username: "",
        password: "",
        confirmPassword: "",
        role: ""
      });

      // Close the registration dialog
      closeRegisDialog();

      incrementNumberSubmitted()
    } catch (err) {
      console.log(err);
      alert(err)
    }
    }
  }
  const handleDeleteConfirmation = async () => {
    try {
      const response = await axiosPrivate.delete(`/api_user/id/${deleteDialogData.id}`);

      console.log(response.data);
      
      // Close the registration dialog
      closeDeleteDialog();

      incrementNumberSubmitted()
    } catch (err) {
      console.log(err);
      alert(err)
    }
  }
  const handleEditConfirmation = async () => {
    // Validate form inputs
    const errors = {};
    if (!editDialogData.edit_password && editDialogData.edit_password.length < 4) {
      errors.password = "Password must be at least 4 characters long.";
    }
    if (!editDialogData.edit_password && editDialogData.edit_password !== editDialogData.edit_confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
  
    // Set form errors, if any
    setEditFormErrors(errors);
  
    // If there are no errors, proceed with user edit
    if (Object.keys(errors).length === 0) {
      try {
        // Make the API request to update the user
        const response = await axiosPrivate.patch(`/api_user/id/${editDialogData.id}`, {
          password: editDialogData.edit_password,
          rolename: editDialogData.role_name.toLowerCase(),
        });
  
        // Reset form
        setEditDialogData({
          edit_password: "",
          edit_confirmPassword: "",
        });

        alert("Changes saved successfully!")
  
        // Close the edit dialog
        closeEditDialog();
  
        incrementNumberSubmitted();
      } catch (err) {
        console.log(err);
        alert(err);
      }
    }
  }

  // Handle form opening
  const handleDeleteButtonClick = (id, username) => {
    // update the state of the Delete Dialog
    const toBeDeletedData = {
      id: id,
      username: username
    }

    setDeleteDialogData(toBeDeletedData);
    openDeleteDialog()

  }
  const handleEditButtonClick = (id) => {
    getEditUserData(id)
    openEditDialog()
  }

  return (
    <>
      <Typography variant="h5">User Management</Typography>
      <Button variant="contained" color="success" onClick={openRegisDialog}>+</Button>
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
                    <IconButton color="info" onClick={() => handleEditButtonClick(user.id)}>
                      <Edit />
                    </IconButton>
                    {user.username !== 'admin' && (
                      <IconButton color="error" onClick={() => handleDeleteButtonClick(user.id, user.username)}>
                        <DeleteOutline  />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isOpenRegisDialog} onClose={closeRegisDialog}>
        <DialogContent>
          <Typography variant="h6">Register New User</Typography>
          <form onSubmit={handleRegisFormSubmit}>
            <TextField
              label="Username"
              name="username"
              value={newUser.username}
              onChange={handleRegisFormInputChange}
              error={!!regisFormErrors.username}
              helperText={regisFormErrors.username}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Password"
              name="password"
              value={newUser.password}
              onChange={handleRegisFormInputChange}
              type="password"
              error={!!regisFormErrors.password}
              helperText={regisFormErrors.password}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Re-enter Password"
              name="confirmPassword"
              value={newUser.confirmPassword}
              onChange={handleRegisFormInputChange}
              type="password"
              error={!!regisFormErrors.confirmPassword}
              helperText={regisFormErrors.confirmPassword}
              fullWidth
              required
              margin="normal"
            />
            <FormControl error={!!regisFormErrors.role} fullWidth required margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleRegisFormInputChange}
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="designer">Designer</MenuItem>
                <MenuItem value="printer">Printer</MenuItem>
                <MenuItem value="packer">Packer</MenuItem>
              </Select>
              {!!regisFormErrors.role && (
                <FormHelperText>{regisFormErrors.role}</FormHelperText>
              )}
            </FormControl>
            <Button type="submit" variant="contained" color="primary">
              Register
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isOpenDeleteDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteDialogData.username}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>No</Button>
          <Button onClick={handleDeleteConfirmation} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isOpenEditDialog} onClose={closeEditDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Typography>Username: {editDialogData.username}</Typography>
          <Typography>Created Date: {formatDate(editDialogData.created_dt)}</Typography>
          <Typography>Last Login Date: {formatDate(editDialogData.last_login_dt)}</Typography>
          <FormControl fullWidth required margin="normal">
            <InputLabel id="edit-role-label">Role</InputLabel>
            <Select
              labelId="edit-role-label"
              id="edit-role"
              name="role_name"
              value={editDialogData.role_name}
              onChange={handleEditFormInputChange}
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="designer">Designer</MenuItem>
              <MenuItem value="printer">Printer</MenuItem>
              <MenuItem value="packer">Packer</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Password"
            name="edit_password"
            value={editDialogData.edit_password}
            onChange={handleEditFormInputChange}
            type="password"
            error={!!editFormErrors.password}
            helperText={editFormErrors.password}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Re-enter Password"
            name="edit_confirmPassword"
            value={editDialogData.edit_confirmPassword}
            onChange={handleEditFormInputChange}
            type="password"
            error={!!editFormErrors.confirmPassword}
            helperText={editFormErrors.confirmPassword}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={closeEditDialog}>Cancel</Button>
          <Button color="primary" onClick={handleEditConfirmation}>Submit</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default UserManagement