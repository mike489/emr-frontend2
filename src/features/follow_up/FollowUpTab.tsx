import { Box } from '@mui/material';
import { usePatientDetailsState } from '../../contexts/PatientContext';
import CreateFollowUpForm from './CreateFollowUpForm';
import FollowUpPrint from './FollowUpPrint'; // You'll need to create this component
import Patients from '../../pages/patients/Patients';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const FollowUpTab = () => {
  const patientDetailsState = usePatientDetailsState();
  const location = useLocation();

  if (!patientDetailsState) {
    return <div>Loading patient data...</div>;
  }

  const { patient, consultation_id } = patientDetailsState;
  const { visit_type, flags } = location.state || {};

  const isLocked = flags?.is_locked;

  console.log('Debug FollowUpTab - visit_type:', visit_type, 'isLocked:', isLocked);

  const renderFollowUpComponent = () => {
    if (!patient?.id || !consultation_id) {
      return <Box color="error.main">No patient or consultation ID found</Box>;
    }

    if (visit_type === 'Follow Up' && isLocked === true) {
      return <FollowUpPrint consultationId={consultation_id} patientId={patient.id} />;
    }

    if (visit_type === 'Follow Up' && isLocked === false) {
      return <CreateFollowUpForm patientId={patient.id} visitId={consultation_id} />;
    }

    return <Box color="error.main">This page is only for Follow Up visits</Box>;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        justifyItems: 'center',
        bgcolor: 'background.paper',
        mt: -16,
      }}
    >
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
        {patient?.id ? (
          <>
            <Box maxWidth="xl">
              <Box sx={{ mb: 3 }}>
                <Patients patient={patient} />
              </Box>
            </Box>

            {renderFollowUpComponent()}
          </>
        ) : (
          <Box color="error.main">No patient data found</Box>
        )}
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default FollowUpTab;
