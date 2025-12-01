import { Box, Typography } from '@mui/material';
import { usePatientDetailsState } from '../../contexts/PatientContext';
import CreateFollowUpForm from './CreateFollowUpForm';
// import { usePatientDetailsState } from './PatientDetailsWrapper';

const FollowUpTab = () => {
  const patientDetailsState = usePatientDetailsState();

  if (!patientDetailsState) {
    return <div>Loading patient data...</div>;
  }

  const { patient, consultation_id } = patientDetailsState;

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
        {patient?.id ? (
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

            <CreateFollowUpForm patientId={patient?.id} visitId={consultation_id} />
          </>
        ) : (
          <Box color="error.main">No FollowUp ID found</Box>
        )}
      </Box>
    </Box>
  );
};

export default FollowUpTab;
