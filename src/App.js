import RequireAuth from "./components/RequireAuth"
import { Routes, Route } from 'react-router-dom'

import Login from "./components/Login"
import Content from "./components/Content";
import UserManagement from "./components/UserManagement";
import OrderDetail from "./components/OrderDetail";
import DashboardV2 from "./components/DashboardV2";
import OrdersPage from "./components/subcomponents/OrdersPage";
import NotFoundPage from "./components/NotFoundPage";

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

      <Route path="/" element={<DashboardV2 />}>
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="/user_management" element={<UserManagement />} />          
          <Route path="/admin" element={<Content title={'All Orders'} apiAddress={'/api_order/get_all_orders'}/>} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Designer]}/>}>
        <Route path="/designer" element={<Content title={'Designer Tasks'} apiAddress={'/api_order/get_designer_tasks'}/>} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Printer]}/>}>
          <Route path="/printer" element={<Content title={'Printer Tasks'} apiAddress={'/api_order/get_printer_tasks'}/>} />
        </Route>        
        
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Packer]}/>}>
          <Route path="/packer" element={<Content title={'Packer Tasks'} apiAddress={'/api_order/get_packer_tasks'}/>} />
        </Route>

        <Route element={<RequireAuth allowedRoles={Object.values(ROLES)}/>}>
          <Route path="/order/:order_id" element={<OrderDetail />} />
          <Route path="/testpage" element={<OrdersPage />} />
          <Route path="/" element={<Content title={'All Active Tasks'} apiAddress={'/api_order/get_all_active_orders'}/>} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
