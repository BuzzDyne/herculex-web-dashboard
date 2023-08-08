import { Box, Button, Dialog, DialogContent, DialogActions, Grid, Paper, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import dayjs from 'dayjs';
import PhoneIcon from '@mui/icons-material/Phone';
import EventIcon from '@mui/icons-material/Event';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import useAuth from '../hooks/useAuth'
import { ORDERDETAIL_ACTION_ROLE_ACCESS_MAPPING } from '../constants';

const steps = [
  'Initial Input', 
  'Design Submitted', 
  'Design Approved', 
  'Printing Done', 
  'Packing Done', 
  'Order Shipped'
]

const OrderDetail = () => {
  const { auth } = useAuth()
  const { order_id } = useParams()
  const [order, setOrder] = useState({})
  const [orderItems, setOrderItems] = useState([{}])
  const [orderTrackings, setOrderTrackings] = useState([{}])
  const [numberSubmitted, setNumberSubmitted] = useState(0)
  const [completed, setCompleted] = useState({
    0: false, // Initial Input
    1: false, // Design Submitted
    2: false, // Design Approved
    3: false, // Printing Done
    4: false, // Packing Done
    5: false, // Order Shipped
  })

  const axiosPrivate = useAxiosPrivate()

  const navigate = useNavigate()
  const location = useLocation()

  // Initial Data Prompt
  const [isInputDialogOpen, setIsInputDialogOpen]     = useState(false)
  const [idpPhone, setIdpPhone] = useState('')
  const [idpDeadline, setidpDeadline] = useState()
  const [idpErrors, setIdpErrors] = useState({})

  const handleIdpSubmit = async (event) => {
    event.preventDefault();

    // Validate form inputs
    const phoneRegex = /^(\+?\d{1,2}\s?)?(\()?\d{3}(\))?[-\s]?\d{3}[-\s]?\d{4}$/;
    const errors = {};
    if (!phoneRegex.test(idpPhone)) {
      errors.phoneNo = "Phone number is invalid";
    }
    
    // Set form errors, if any
    setIdpErrors(errors);

    var d = new Date(idpDeadline)
    var dateString = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`

    // If there are no errors, proceed with API Hit
    if (Object.keys(errors).length === 0) {
      try {
        await axiosPrivate.patch(`/api_order/id/${order.id}`, {
          cust_phone_no: idpPhone,
          user_deadline_prd: dateString,
          user_id: auth.token_user_id,
        });

        // Close the registration dialog
        openCloseDialog('input', false);

        incrementNumberSubmitted()
      } catch (err) {
        console.log(err);
        alert(err)
      }
    }
  };
  
  // Submit Design Prompt
  const [isDesignDialogOpen, setIsDesignDialogOpen]   = useState(false)
  const [sdpFolderUrl, setSdpFolderUrl] = useState("")
  const [sdpFileForThumbUrl, setSdpFileForThumbUrl] = useState("")
  const [sdpErrors, setSdpErrors] = useState({})
  const handleSdpSubmit = async (event) => {
    event.preventDefault();

    const folderUrlRegex = /^https:\/\/drive\.google\.com\/drive\/folders\/.*$/i;
    const urlRegex = /^https:\/\/drive\.google\.com\/file.*$/i;

    console.log(`check State sdpFolderUrl ${sdpFolderUrl}`);
    console.log(`check State sdpFileForThumbUrl ${sdpFileForThumbUrl}`);
 
    // Validate form inputs
    const errors = {};
    if (!folderUrlRegex.test(sdpFolderUrl)) {
      errors.FolderUrl = "URL is Invalid";
    }
    if (!urlRegex.test(sdpFileForThumbUrl)) {
      errors.FileForThumbUrl = "URL is Invalid";
    }
    
    // Set form errors, if any
    setSdpErrors(errors);

    // If there are no errors, proceed with API Hit
    if (Object.keys(errors).length === 0) {
      try {
        await axiosPrivate.patch(`/api_order/id/${order.id}/submit_url`, {
          folder_url      : sdpFolderUrl,
          thumb_file_url  : sdpFileForThumbUrl,
          user_id         : auth.token_user_id,
        });

        // Close the registration dialog
        openCloseDialog('design', false);

        incrementNumberSubmitted()
      } catch (err) {
        console.log(err);
        alert(err)
      }
    }
  };

  // Approve Design Prompt
  const [isApproveDesignDialogOpen, setIsApproveDesignDialogOpen]   = useState(false)
  const handleAddpSubmit = async (event) => {
    event.preventDefault();

    try {
      await axiosPrivate.patch(`/api_order/id/${order.id}/submit_design_acc`, {
        date: null,
        user_id: auth.token_user_id,
      });

      openCloseDialog('design', false);

      incrementNumberSubmitted()
    } catch (err) {
      console.log(err);
      alert(err)
    }
  };
 
  // Printing Done Prompt
  const [isPrintDoneDialogOpen, setIsPrintDoneDialogOpen]   = useState(false)
  const handlePrintDoneDialogSubmit = async (event) => {
    event.preventDefault();

    try {
      await axiosPrivate.patch(`/api_order/id/${order.id}/submit_print_done`, {
        date: null,
        user_id: auth.token_user_id,
      });

      openCloseDialog('print', false);

      incrementNumberSubmitted()
    } catch (err) {
      console.log(err);
      alert(err)
    }
  };

  // Packing Done Prompt
  const [isPackingDoneDialogOpen, setIsPackingDoneDialogOpen]   = useState(false)
  const handlePackingDoneDialogSubmit = async (event) => {
    event.preventDefault();

    try {
      await axiosPrivate.patch(`/api_order/id/${order.id}/submit_packing_done`, {
        date: null,
        user_id: auth.token_user_id,
      });

      openCloseDialog('packing', false);

      incrementNumberSubmitted()
    } catch (err) {
      console.log(err);
      alert(err)
    }
  };


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
        isMounted && setOrderTrackings(response.data.order_trackings)

        const {
          cust_phone_no,
          user_deadline_prd,
          design_sub_dt,
          design_acc_dt,
          print_done_dt,
          packing_done_dt,
          shipped_dt,
        } = response.data.order_data;
  
        setCompleted({
          0: cust_phone_no !== null && user_deadline_prd !== null,
          1: design_sub_dt !== null,
          2: design_acc_dt !== null,
          3: print_done_dt !== null,
          4: packing_done_dt !== null,
          5: shipped_dt !== null,
        })

      } catch (err) {
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

  }, [axiosPrivate, navigate, location, order_id, numberSubmitted]);
  

  const incrementNumberSubmitted = () => {
    setNumberSubmitted(numberSubmitted => numberSubmitted + 1);
  }

  const openCloseDialog = (dialogName, isOpening) => {
    if (dialogName === 'input') {
      setIdpPhone(order.cust_phone_no || '')

      if (!order.user_deadline_prd) {
        setidpDeadline(dayjs().add(2, 'week'))
      } else {
        setidpDeadline(dayjs(order.user_deadline_prd, 'YYYYMMDD'))
      }

      setIsInputDialogOpen(isOpening)
    } else if (dialogName === 'design') {
      setSdpFolderUrl(order.google_folder_url)
      setSdpFileForThumbUrl(order.google_file_url)

      setIsDesignDialogOpen(isOpening)
    }else if (dialogName === 'design_acc') {
      setIsApproveDesignDialogOpen(isOpening)
    } else if (dialogName === 'print') {
      setIsPrintDoneDialogOpen(isOpening)
    } else if (dialogName === 'packing') {
      setIsPackingDoneDialogOpen(isOpening)
    }
  }

  const hasAccess = (buttonLabel) => ORDERDETAIL_ACTION_ROLE_ACCESS_MAPPING[auth.token_role_id]?.includes(buttonLabel);

  const convertToGMTPlus7 = (utcDate) => {
    const utcDateTime = new Date(utcDate);
    const year = utcDateTime.getFullYear();
    const month = String(utcDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(utcDateTime.getDate()).padStart(2, '0');
    const hour = String(utcDateTime.getHours()).padStart(2, '0');
    const minute = String(utcDateTime.getMinutes()).padStart(2, '0');
    const second = String(utcDateTime.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return empty string if the date is not provided
    const date = new Date(dateString);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${ampm}`;
    return formattedDate;
  };

  // OrderDetail Actions Button Visibility
  const isAdmin = auth.token_role_id === 1
  const showInitialInputButton  = !completed[0] && hasAccess('Input Data')                        
  const showDesignSubmitButton  = hasAccess('Submit Design Link') && ((isAdmin && !completed[1]) || (!isAdmin && !completed[1] && completed[0]))
  const showDesignEditButton    = hasAccess('Edit Design Link') && (completed[1] && !completed[2])
  const showDesignApproveButton = hasAccess('Approve Design') && completed[1] && !completed[2] && isAdmin
  const showPrintingDoneButton  = hasAccess('Printing Done') && ((isAdmin && !completed[3]) || (!isAdmin && !completed[3] && completed[2]))
  const showPackingDoneButton   = hasAccess('Packing Done') && ((isAdmin && !completed[4]) || (!isAdmin && !completed[4] && completed[3]))

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
          <img 
            src={order.thumb_url ? order.thumb_url : "https://placehold.co/100"}
            referrerPolicy="no-referrer"
            alt="Not found" />
      </Box>
      </Paper>
    </Grid>
    <Grid item xs={9}> {/* Order Informations */}
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%'}}>
        <h2>Order #{order.id}</h2>
        <p sx={{ display: 'flex', alignItems: 'center' }}>
          <PhoneIcon sx={{ marginRight: '0.5em', verticalAlign: 'middle'  }} />: {order.cust_phone_no ? order.cust_phone_no : '-'}
        </p>
        <p sx={{ display: 'flex', alignItems: 'center' }}>
          <EventIcon sx={{ marginRight: '0.5em', verticalAlign: 'middle'  }} />: {order.user_deadline_prd ? dayjs(order.user_deadline_prd).format('YYYY-MM-DD') : '-'}
        </p>
        <Grid container spacing={0.5} marginTop={'auto'} justifyContent="flex-start">
          <Grid item>
            {isAdmin && <Button 
              variant="contained"
              color="waColor"
              disabled={!order.cust_phone_no}
              onClick={() => {
                if (order.cust_phone_no) {
                  const waNumber = !order.cust_phone_no.startsWith('0') ? order.cust_phone_no  : '62' + order.cust_phone_no.substring(1)
                  const waLink = "https://api.whatsapp.com/send?phone="+ waNumber +"&text=Hello%20this%20is%20Herculex"
                  window.open(waLink);
                }
              }}
              >
                <WhatsAppIcon />
            </Button>}
          </Grid>
          <Grid item>
            <Button 
              variant="contained" 
              disabled={!order.google_folder_url}
              onClick={() => {
                if (order.google_folder_url) {
                  window.open(order.google_folder_url, "_blank");
                }
              }}
              >
                {order.google_folder_url ? <FolderIcon /> : <FolderOffIcon />}
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={0.5} marginTop={'auto'}>
        {showInitialInputButton && (
          <OrderDetailActionButton label="Input Data" onClick={() => openCloseDialog('input', true)} />
        )}
        {showDesignSubmitButton && (
          <OrderDetailActionButton label="Submit Design Link" onClick={() => openCloseDialog('design', true)} />
        )}
        {showDesignEditButton && (
          <OrderDetailActionButton label="Edit Design Link" onClick={() => openCloseDialog('design', true)} />
        )}
        {showDesignApproveButton && (
          <OrderDetailActionButton label="Approve Design" onClick={() => openCloseDialog('design_acc', true)} />
        )}
        {showPrintingDoneButton && (
          <OrderDetailActionButton label="Printing Done" onClick={() => openCloseDialog('print', true)} />
        )}
        {showPackingDoneButton && (
          <OrderDetailActionButton label="Packing Done" onClick={() => openCloseDialog('packing', true)} />
        )}
        </Grid>
      </Paper>
    </Grid>

    <Grid item xs={12}> {/* Stepper */}
        <Stepper activeStep={999} nonLinear alternativeLabel >
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepLabel sx={{ marginBottom: '10px' }}>
                {label}<br/>
                {index === 0 && order.initial_input_dt && formatDate(order.initial_input_dt)}
                {index === 1 && order.design_sub_dt && formatDate(order.design_sub_dt)}
                {index === 2 && order.design_acc_dt && formatDate(order.design_acc_dt)}
                {index === 3 && order.print_done_dt && formatDate(order.print_done_dt)}
                {index === 4 && order.packing_done_dt && formatDate(order.packing_done_dt)}
                {index === 5 && order.shipped_dt && formatDate(order.shipped_dt)}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
    </Grid>

    <Grid item xs={12}> {/* Order Items */}
      <Paper sx={{p:2}}>
      <Typography variant="h5" gutterBottom>Order Items</Typography>
        <Grid container spacing={2}>
          {orderItems.map((row, index) => (
            <React.Fragment key={index}>
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
            </React.Fragment>
          ))}

        </Grid>
      </Paper>
    </Grid>

    <Grid item xs={12}> {/* Order History */}
      <Paper sx={{p:2}}>
        <Typography variant="h5" gutterBottom>Order History</Typography>
        {orderTrackings.map((row, index) => (
          <Paper key={index} sx={{p:1, mb:2}}>
            <Typography variant="body1">{row.activity_msg}</Typography>
            <Typography variant="body2" gutterBottom>
              {row.user_name ? row.user_name : '<Deleted User>'} | {convertToGMTPlus7(row.activity_date)}
            </Typography>
          </Paper>
        ))}     
      </Paper>
    </Grid>

    <Dialog open={isInputDialogOpen} onClose={() => openCloseDialog('input', false)}> {/* Initial Input Dialog */}
      <DialogContent>
        <Typography variant="h6" marginBottom={1}>Input Initial Data</Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField 
            label="Phone Number" 
            sx={{ width: '100%', textAlign: 'left', mb: 2 }} 
            onChange={(e) => setIdpPhone(e.target.value)}
            value={idpPhone}
            error={!!idpErrors.phoneNo}
            helperText={idpErrors.phoneNo}
          />
          <DatePicker
            label="Custom Deadline Date"
            value={idpDeadline}
            onChange={(date) => {
              setidpDeadline(date);
            }}
            format="YYYY-MM-DD"
            sx={{ width: '100%', textAlign: 'right', mb: 2 }}
            onBeforeInput={(e) => {
              e.preventDefault();
            }}
          />
          <Button onClick={handleIdpSubmit} variant="contained" sx={{ width: '100%' }}>
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>

    <Dialog open={isDesignDialogOpen} onClose={()=>{openCloseDialog('design', false)}}> {/* Submit Design Dialog */}
      <DialogContent>
        <Typography variant="h6">Design Links</Typography>
        <Box display="flex" flexDirection="column" alignItems="center">
          <TextField 
            label="Folder URL" 
            sx={{ width: '100%', textAlign: 'left', mb: 2 }} 
            onChange={(e) => setSdpFolderUrl(e.target.value)}
            value={sdpFolderUrl}
            error={!!sdpErrors.FolderUrl}
            helperText={sdpErrors.FolderUrl}
          />
          <TextField 
            label="File URL (Thumbnail)" 
            sx={{ width: '100%', textAlign: 'left', mb: 2 }} 
            onChange={(e) => setSdpFileForThumbUrl(e.target.value)}
            value={sdpFileForThumbUrl}
            error={!!sdpErrors.FileForThumbUrl}
            helperText={sdpErrors.FileForThumbUrl}
          />
          <Button onClick={handleSdpSubmit} variant="contained" sx={{ width: '100%' }}>
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>

    <Dialog open={isApproveDesignDialogOpen} onClose={()=>{openCloseDialog('design_acc', false)}}> {/* Design Approval Dialog */}
      <DialogContent>
        <Typography variant="h6">Approve Design?</Typography>
        <Typography variant="body1">Are you sure to approve Order #{order.id} design?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {openCloseDialog('design_acc', false)}} variant="outlined" color="error">
          Cancel
        </Button>
        <Button 
          onClick={(e) => {
            openCloseDialog('design_acc', false)
            handleAddpSubmit(e)
            }} 
          variant="contained" 
          color="primary">
            Confirm
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={isPrintDoneDialogOpen} onClose={()=>{openCloseDialog('print', false)}}> {/* Print Dialog */}
      <DialogContent>
        <Typography variant="h6">Confirm Printing?</Typography>
        <Typography variant="body1">Are you sure that Order #{order.id} has finished the printing process?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {openCloseDialog('print', false)}} variant="outlined" color="error">
          Cancel
        </Button>
        <Button 
          onClick={(e) => {
            openCloseDialog('print', false)
            handlePrintDoneDialogSubmit(e)
            }} 
          variant="contained" 
          color="primary">
            Confirm
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={isPackingDoneDialogOpen} onClose={()=>{openCloseDialog('packing', false)}}> {/* Packing Dialog */}
    <DialogContent>
        <Typography variant="h6">Confirm Packing?</Typography>
        <Typography variant="body1">Are you sure that Order #{order.id} has finished the packing process?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {openCloseDialog('packing', false)}} variant="outlined" color="error">
          Cancel
        </Button>
        <Button 
          onClick={(e) => {
            openCloseDialog('packing', false)
            handlePackingDoneDialogSubmit(e)
            }} 
          variant="contained" 
          color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
};

const OrderDetailActionButton = ({ label, onClick }) => {
  return (
    <Grid item xs>
      <Button onClick={onClick} variant="contained" sx={{ width: '100%', height: '100%', fontSize: '11px' }}>
        {label}
      </Button>
    </Grid>
  );
};

export default OrderDetail;