import { Box, Button, Dialog, DialogContent, Grid, Paper, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
  const [isInputDialogOpen, setIsInputDialogOpen]     = useState(false)
  const [isDesignDialogOpen, setIsDesignDialogOpen]   = useState(false)
  const [isPrintDialogOpen, setIsPrintDialogOpen]     = useState(false)
  const [isPackingDialogOpen, setIsPackingDialogOpen] = useState(false)

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
  
  const openCloseDialog = (dialogName, isOpening) => {
    if (dialogName === 'input') {
      setIsInputDialogOpen(isOpening)
    } else if (dialogName === 'design') {
      setIsDesignDialogOpen(isOpening)
    } else if (dialogName === 'print') {
      setIsPrintDialogOpen(isOpening)
    } else if (dialogName === 'packing') {
      setIsPackingDialogOpen(isOpening)
    }
  }

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
          { !completed[0] && <Grid item xs><Button onClick={() => openCloseDialog('input', true)}variant="contained" sx={{width:'100%', height:'100%'}}>Input Data</Button></Grid>}
          { !completed[1] && <Grid item xs><Button onClick={() => openCloseDialog('design', true)}variant="contained" sx={{width:'100%', height:'100%'}}>Submit Design</Button></Grid>}
          { !completed[2] && <Grid item xs><Button onClick={() => openCloseDialog('print', true)}variant="contained" sx={{width:'100%', height:'100%'}}>Printing Done</Button></Grid>}
          { !completed[3] && <Grid item xs><Button onClick={() => openCloseDialog('packing', true)}variant="contained" sx={{width:'100%', height:'100%'}}>Packing Done</Button></Grid>}
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

    <Dialog open={isInputDialogOpen} onClose={()=>{openCloseDialog('input', false)}}> {/* Input Dialog */}
      <DialogContent>
        <Typography variant="h6">Input Initial Data</Typography>
        <TextField label="Phone Number" />
        <DatePicker label="Custom Deadline Date" />
      </DialogContent>
    </Dialog>

    <Dialog open={isDesignDialogOpen} onClose={()=>{openCloseDialog('design', false)}}> {/* Design Dialog */}
      <DialogContent>
        <Typography variant="h6">Submit Design</Typography>
      </DialogContent>
    </Dialog>

    <Dialog open={isPrintDialogOpen} onClose={()=>{openCloseDialog('print', false)}}> {/* Design Dialog */}
      <DialogContent>
        <Typography variant="h6">Confirm Printing</Typography>
      </DialogContent>
    </Dialog>

    <Dialog open={isPackingDialogOpen} onClose={()=>{openCloseDialog('packing', false)}}> {/* Design Dialog */}
      <DialogContent>
        <Typography variant="h6">Confirm Packing</Typography>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default OrderDetail;