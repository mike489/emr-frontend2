import { Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import FollowUpPatients from '../../features/follow_up/FollowUpPatients';

import type { Patient } from '../../shared/api/types/patient.types';
import CreateFollowUpForm from '../../features/follow_up/CreateFollowUpForm';

export default function FollowUp() {
  const location = useLocation();
  const { patient } = (location.state as { patient: Patient }) || {};

  const patientId = patient?.id;
  const consultantId = patient?.constultation_id;

  console.log('Patient Id:', patientId, 'Consultation ID:', consultantId);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        // height: '100vh',
        justifyContent: 'center',
        justifyItems: 'center',
        bgcolor: 'background.paper',
        mt: -16,
      }}
    >
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
        {patientId ? (
          <>
            <Box
              maxWidth="lg"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: '100%',
                p: 3,
                justifyItems: 'center',
                justifySelf: 'center',
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                New Follow Up Note
              </Typography>
              <Typography variant="body1">Patient: {patient?.full_name}</Typography>
            </Box>

            {/* PASS patientId & visitId HERE */}
            <CreateFollowUpForm patientId={patientId} visitId={consultantId} />
          </>
        ) : (
          <Box>
            <FollowUpPatients />
          </Box>
        )}
      </Box>
    </Box>
  );
}
