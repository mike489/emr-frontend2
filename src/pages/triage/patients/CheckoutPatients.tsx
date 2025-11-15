import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';


const CheckoutPatients: React.FC = () => {
  
  return (
 
      <Box sx={{ px: 3, backgroundColor: '#f5f5f5', mt:-10  }}>
      <Typography variant="h5" sx={{ my: 2 }}>List Checkout Patients</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          This is where the checkout patients list will go.
        </Typography>
      </Paper>
      </Box>
   
  );
};

export default CheckoutPatients;
