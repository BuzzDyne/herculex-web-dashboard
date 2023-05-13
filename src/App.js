import { Box, Stack } from "@mui/material"
import RequireAuth from "./components/RequireAuth"
import { BrowserRouter as Router, Switch, Routes, Route, Redirect } from 'react-router-dom'

import Login from "./components/Login"
import DashboardLayout from "./components/DashboardLayout";
import Content from "./components/Content";

function App() {

  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route element={<RequireAuth />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route path="/admin" element={"Admin"} />
          <Route path="/designer" element={"designer"} />
          <Route path="/printer" element={"printer"} />
          <Route path="/packer" element={"packer"} />
          <Route path="/" element={<Content />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
