import RequireAuth from "./components/RequireAuth"
import { Routes, Route } from 'react-router-dom'

import Login from "./components/Login"
import DashboardLayout from "./components/DashboardLayout";
import Content from "./components/Content";
import UserManagement from "./components/UserManagement";

const ROLES = {
  'Admin'   : 1,
  'Designer': 2,
  'Printer' : 3,
  'Packer'  : 4
}

function App() {

  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route path="/" element={<DashboardLayout />}>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/admin" element={"Admin"} />
          <Route path="/user_management" element={<UserManagement />} />          
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Designer]}/>}>
          <Route path="/designer" element={"designer"} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Printer]}/>}>
          <Route path="/printer" element={"printer"} />
        </Route>        
        
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Packer]}/>}>
          <Route path="/packer" element={"packer"} />
        </Route>

        <Route element={<RequireAuth allowedRoles={Object.values(ROLES)}/>}>
          <Route path="/" element={<Content />} />
        </Route>

      </Route>
    </Routes>
  );
}

export default App;
