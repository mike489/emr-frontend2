import { Box } from '@mui/material';
import FollowUpListTable from '../../features/follow_up/FollowUpListTable';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FollowUpPatients from '../../features/follow_up/FollowUpPatients';

export default function FollowUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId , consultantId} = (location.state as { patientId?: string, consultantId:string }) || {};
  console.log("Patient Id", patientId, "consultId:", consultantId)

  React.useEffect(() => {
    if (!patientId) {
      console.warn('No patientId found in navigation state.');
    } else {
      console.log('Loaded Patient ID:', patientId);
    }
  }, [patientId, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.paper',
        mt: -16,
      }}
    >
      {/* <TabBar tabsData={DOCTOR_TABS} /> */}
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
        {patientId ? (
          <FollowUpListTable patientId={patientId} consultantId={consultantId} />
        ) : (
          <Box >
            <FollowUpPatients />
          </Box>
        )}
      </Box>
    </Box>
  );
}
