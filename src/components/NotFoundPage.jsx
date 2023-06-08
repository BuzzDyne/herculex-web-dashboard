import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Typography, Grid } from '@mui/material';

const NotFoundPage = () => {
  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Grid item>
        <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
          Page is not found
        </Typography>
        <Grid container justifyContent="center">
          <Button component={Link} to="/" variant="contained" color="primary">
            Go Back to Home
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NotFoundPage;
