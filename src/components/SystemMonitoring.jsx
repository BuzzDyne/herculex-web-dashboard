import { Button, Grid, Paper, Typography } from "@mui/material"
import { useLocation, useNavigate } from 'react-router-dom';
import Title from "./subcomponents/Title"
import { useEffect, useState } from "react"
import useAxiosPrivate from '../hooks/useAxiosPrivate';


function SystemMonitoring() {
  const [shopeeExpiredPeriod, setShopeeExpiredPeriod] = useState()
  const axiosPrivate = useAxiosPrivate()

  const navigate = useNavigate()
  const location = useLocation()



  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getShopeeSync = async () => {
      try {
        const response = await axiosPrivate.get(`/api_sync/shopee/get_token_expiry_period`, {
          signal: controller.signal,
        });
        console.log(response.data);

        if (response.data && response.data.refresh_token_expire_YYYYMMDD) {
          setShopeeExpiredPeriod(response.data.refresh_token_expire_YYYYMMDD);
        }
      } catch (err) {
        if (err?.response?.status === 422 && err?.response?.data?.detail === 'Signature has expired') {
          alert('Token expired! Please relogin!');
          navigate('/login', { state: { from: location }, replace: true });
        }

        console.log(err);
      }
    };

    getShopeeSync();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [axiosPrivate, navigate, location]);
  

  // Handle Refresh Shopee Button
  const handleRefreshShopeeButton = async () => {
    try {
      const response = await axiosPrivate.get('/api_sync/shopee/get_auth_url');
    
      // Get the auth URL from the response
      const authUrl = response.data.auth_url;

      window.open(authUrl, '_blank');

    } catch (err) {
      console.log(err);
      alert(err)
    }
  }

  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Title sx={{ marginBottom: '4px' }}>Sync Status</Title>
        <Typography variant="body1">
          Shopee Token Expiry: {shopeeExpiredPeriod}
        </Typography>

        <Button variant="contained" onClick={handleRefreshShopeeButton}>
          Refresh Token Now
        </Button>
      </Paper>
    </Grid>
  )

}

export default SystemMonitoring
