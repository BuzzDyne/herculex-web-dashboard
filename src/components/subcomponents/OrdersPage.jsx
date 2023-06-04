import { Grid, Paper } from '@mui/material'
import React from 'react'
import Orders from './Orders'

const OrdersPage = () => {
  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Orders />
      </Paper>
    </Grid>
  )
}

export default OrdersPage