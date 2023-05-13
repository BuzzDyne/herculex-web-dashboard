import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Stack } from "@mui/material"

import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

function DashboardLayout() {
  return (
		<>
			<Navbar />
      <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar />
    		<Box bgcolor="skyblue" flex={6} p={2}>
        	<Outlet />
				</Box>
      </Stack>
		</>
  )
}

export default DashboardLayout