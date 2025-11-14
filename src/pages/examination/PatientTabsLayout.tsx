import React from 'react';
import { Box } from '@mui/material';
import ExaminationForm from '../../features/examination/ExaminationForm';
import { useLocation, useNavigate } from 'react-router-dom';
import Examinations from '../triage/Examinations';

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
        p: 4,
        mt: -10,
      }}
    >
      {/* <TabBar tabsData={DOCTOR_TABS} /> */}
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
        {consultation_id ? (
          <ExaminationForm consultationId={consultation_id} />
        ) : (
          <Box>
            <Examinations />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PatientTabsLayout;
