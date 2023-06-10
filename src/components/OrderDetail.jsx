import { Box, Button, Divider, Grid, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const steps = [
  'Initial Input', 
  'Design Finished', 
  'Printing Done', 
  'Packing Done', 
  'Order Shipped'
]


const OrderDetail = () => {
  const { order_id } = useParams()
  const [order, setOrder] = useState({})
  const [orderItems, setOrderItems] = useState([{}])
  // const [numberSubmitted, setNumberSubmitted] = useState(0)
  const [completed, setCompleted] = useState({
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
  })

  const axiosPrivate = useAxiosPrivate()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const getOrderDetail = async () => {
      try {
        const response = await axiosPrivate.get(`/api_order/id/${order_id}`, {
          signal: controller.signal
        })
        console.log(response.data)
        isMounted && setOrder(response.data.order_data)
        isMounted && setOrderItems(response.data.order_items_data)

        const {
          cust_phone_no,
          user_deadline_dt,
          design_acc_dt,
          print_done_dt,
          packing_done_dt,
          shipped_dt,
        } = response.data.order_data;
  
        setCompleted({
          0: cust_phone_no !== null && user_deadline_dt !== null,
          1: design_acc_dt !== null,
          2: print_done_dt !== null,
          3: packing_done_dt !== null,
          4: shipped_dt !== null,
        })

      } catch (err) {
        // console.log(err?.response?.status)
        if(err?.response?.status === 404 && err?.response?.data?.detail === 'ID not found') {
          navigate('/404')
        } else if(err?.response?.status === 422 && err?.response?.data?.detail === 'Signature has expired') {
          alert('Token expired! Please relogin!')       
          navigate('/login', {state: {from: location}, replace: true})   
        }
      }
    }

    getOrderDetail();

    return () => {
      isMounted = false
      controller.abort()
    }

  }, [axiosPrivate, navigate, location, order_id ]);
  

  return (
    <>    
    <Grid item xs={3} sx={{ height: '100%'}}> {/* Image */}
      <Paper sx={{ display: 'flex', flexDirection: 'column'}}>
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
          <img src="https://placehold.co/100" alt=""/>
      </Box>
      </Paper>
    </Grid>
    <Grid item xs={9}> {/* Order Informations */}
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
        <h2>Order #{order.id}</h2>
        <p>Customer Phone No: {order.cust_phone_no ? order.cust_phone_no : '-'}</p>
        <p>User Deadline: {order.user_deadline_dt ? order.user_deadline_dt : '-'}</p>
        <Grid container spacing={0.5} >
          <Grid item xs><Button variant="contained" sx={{width:'100%', height:'100%'}}>Input Data</Button></Grid>
          <Grid item xs><Button variant="contained" sx={{width:'100%', height:'100%'}}>Submit Design</Button></Grid>
          <Grid item xs><Button variant="contained" sx={{width:'100%', height:'100%'}}>Printing Done</Button></Grid>
          <Grid item xs><Button variant="contained" sx={{width:'100%', height:'100%'}}>Packing Done</Button></Grid>
        </Grid>
      </Paper>
    </Grid>


    <Grid item xs={12} sx={{height:'100%', maxHeight:'100px'}}> {/* Stepper */}
        <Stepper activeStep={999} nonLinear alternativeLabel >
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepLabel>
                {label}<br/>
                {index === 0 && order.initial_input_dt && new Date(order.initial_input_dt).toLocaleString()}
                {index === 1 && order.design_acc_dt && new Date(order.design_acc_dt).toLocaleString()}
                {index === 2 && order.print_done_dt && new Date(order.print_done_dt).toLocaleString()}
                {index === 3 && order.packing_done_dt && new Date(order.packing_done_dt).toLocaleString()}
                {index === 4 && order.shipped_dt && new Date(order.shipped_dt).toLocaleString()}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
    </Grid>

    <Grid item xs={12}> {/* Order Items */}
      <Paper sx={{p:2}}>
      <Typography variant="h5" gutterBottom>Order Items</Typography>
        <Grid container spacing={2}>
          {orderItems.map((row) => (
            <>
              <Grid item xs={2} sm={2} md={1} lg={1}> {/* Item Image */}
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
                    <img src="https://placehold.co/100" alt=""/>
                </Box>
              </Grid>
              <Grid item xs={10} sm={10} md={11} lg={11}> {/* Item Details */}
                <Typography variant='subtitle1'>{row.product_name}</Typography>
                <Typography variant='body1'>{row.quantity} x Rp{row.product_price?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Typography>
              </Grid>
            </>
          ))}

        </Grid>
      </Paper>
    </Grid>

    <Grid item xs={12}> {/* Order History */}
      <Paper sx={{p:2}}>
        <Typography variant="h5" gutterBottom>Order History</Typography>

        <Paper sx={{p:1, mb:2}}>
          <Typography variant="body1">Customer Phone Number was set to 021-xxxxxxx and Deadline was set to 2023-Jan-31.</Typography>
          <Typography variant="body2" gutterBottom>Admin | 2023-01-31 23:59:59</Typography>
        </Paper>

        <Paper sx={{p:1, mb:2}}>
          <Typography variant="body1">Customer Phone Number was set to 021-xxxxxxx and Deadline was set to 2023-Jan-31.</Typography>
          <Typography variant="body2" gutterBottom>Admin | 2023-01-31 23:59:59</Typography>
        </Paper>

        <Paper sx={{p:1, mb:2}}>
          <Typography variant="body1">Customer Phone Number was set to 021-xxxxxxx and Deadline was set to 2023-Jan-31.</Typography>
          <Typography variant="body2" gutterBottom>Admin | 2023-01-31 23:59:59</Typography>
        </Paper>

        <Paper sx={{p:1, mb:2}}>
          <Typography variant="body1">Customer Phone Number was set to 021-xxxxxxx and Deadline was set to 2023-Jan-31.</Typography>
          <Typography variant="body2" gutterBottom>Admin | 2023-01-31 23:59:59</Typography>
        </Paper>

        <Paper sx={{p:1}}>
          <Typography variant="body1">Customer Phone Number was set to 021-xxxxxxx and Deadline was set to 2023-Jan-31.</Typography>
          <Typography variant="body2" gutterBottom>Admin | 2023-01-31 23:59:59</Typography>
        </Paper>
      </Paper>
    </Grid>
    </>
  );
};

export default OrderDetail;