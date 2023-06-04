import { Box, Grid, Paper } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetail = () => {
  const { order_id } = useParams();

  // Fetch order details based on the order_id parameter

  return (
    <>
    <Grid item xs={9}> {/* Order Informations */}
      <Grid container spacing={2}>
        <Grid item xs ={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <h2>Order #{order_id}</h2>
            <p>Customer Phone No</p>
            <p>User Deadline</p>
            <p>Design Acc Date</p>
            <p>Print Done Date</p>
          </Paper>
        </Grid>
        <Grid item xs = {12} sx={{height:'100%'}}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <p>Stepper here</p>
          </Paper>
        </Grid>
      </Grid>
    </Grid>

    <Grid item xs={3}> {/* Order Informations */}
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
      <Box
          sx={{
            maxWidth: '100%',
            width: '100%',
            paddingTop: '100%',
            position: 'relative',
            '& > img': {
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            },
          }}
        >
          <img src="https://placehold.co/200" alt=""/>
        </Box>
      </Paper>
    </Grid>
    </>
  );
};

export default OrderDetail;