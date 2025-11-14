import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';


const CreateAppointment: React.FC = () => {
  
  return (
 
      <Box sx={{ px: 3, backgroundColor: '#f5f5f5', mt:-10  }}>
      
      <Typography variant="h5" sx={{ my: 2 }}>Create Appointment</Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          This is where the appointment creation form will go.
        </Typography>
      </Paper>
      </Box>
   
  );
};

export default CreateAppointment;
