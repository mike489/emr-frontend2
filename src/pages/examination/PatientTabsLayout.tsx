import React from 'react';
import { Box, Typography } from '@mui/material';
import ExaminationForm from '../../features/examination/ExaminationForm';
import { useLocation, useNavigate } from 'react-router-dom';
import TabBar from '../../layouts/TabBar';
import { DOCTOR_TABS } from '../../data/data';

const PatientTabsLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { consultation_id } = (location.state as { consultation_id?: string }) || {};

  React.useEffect(() => {
    if (!consultation_id) {
      console.warn('No consultation_id found in navigation state.');
  
    } else {
      console.log('Loaded consultation ID:', consultation_id);
    }
  }, [consultation_id, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.paper',
        p:4,
      }}
    >
      
              <TabBar tabsData={DOCTOR_TABS} />
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
        {consultation_id ? (
          <ExaminationForm consultationId={consultation_id} />
        ) : (
          <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
            No consultation ID provided. Please go back and select a patient.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default PatientTabsLayout;
