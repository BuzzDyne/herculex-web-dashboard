import { Box, Stack } from "@mui/material"
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import Navbar from "./components/Navbar"
import Content from "./components/Content"
import Sidebar from "./components/Sidebar"


function App() {

  return (
    <Box sx={{backgroundColor:"none "}}>
      <Navbar />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar />
        <Content />
      </Stack>
    </Box>
  );
}

export default App;
