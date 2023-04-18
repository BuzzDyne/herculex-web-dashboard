import Navbar from "./components/Navbar"
import Content from "./components/Content"
import Sidebar from "./components/Sidebar"
import { Box, Stack } from "@mui/material";


function App() {

  return (
    <Box sx={{backgroundColor:"yellow "}}>
      <Navbar />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar />
        <Content />
      </Stack>
    </Box>
  );
}

export default App;
