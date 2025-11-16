import React from 'react';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';


const InPatients: React.FC = () => {
  
  return (
 
      <Box sx={{ px: 3, backgroundColor: '#f5f5f5', mt:-10  }}>
      <Typography variant="h5" sx={{ my: 2 }}>List In Patients </Typography>
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          This is where the In Patients list will go.
        </Typography>
      </Paper>
      </Box>
   
  );
};

export default InPatients
;
