import { Box, Grid, Paper, Step, StepLabel, Stepper } from '@mui/material';
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
  // const [activeStep, setActiveStep] = useState(99)
  // const [numberSubmitted, setNumberSubmitted] = useState(0);
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
        isMounted && setOrder(response.data)

        const {
          cust_phone_no,
          user_deadline_dt,
          design_acc_dt,
          print_done_dt,
          packing_done_dt,
          shipped_dt,
        } = response.data;
  
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
    <Grid item xs={9}> {/* Order Informations */}
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
        <h2>Order #{order_id}</h2>
        <p>Customer Phone No</p>
        <p>User Deadline</p>
        <p>Design Acc Date</p>
        <p>Print Done Date</p>
      </Paper>
    </Grid>

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
    <Grid item xs = {12} sx={{height:'100%', maxHeight:'100px'}}> {/* Stepper */}
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

    <Grid item xs={12} > {/* Order Informations */}
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <h2>Order #{order_id}</h2>
        <p>{order.invoice_ref}</p>
      </Paper>
    </Grid>
    </>
  );
};

export default OrderDetail;