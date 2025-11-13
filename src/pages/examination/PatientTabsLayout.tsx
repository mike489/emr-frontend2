import React from 'react';
import { Box } from '@mui/material';
import ExaminationForm from '../../features/examination/ExaminationForm';

// import { useLocation } from 'react-router-dom';

const PatientTabsLayout: React.FC = () => {
  // const { state } = useLocation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.paper',
      }}
    >
      {/* Full Form */}
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
        <ExaminationForm consultationId="019a7c3a-ef69-723a-acaf-146d198ccfdf" />
      </Box>
    </Box>
  );
};

export default PatientTabsLayout;
