import { Box } from '@mui/material';
import ExaminationForm from './ExaminationForm';
import ExaminationDataPrint from './ExaminationDataPrint';
import { usePatientDetailsState } from '../../contexts/PatientContext';
import Patients from '../../pages/patients/Patients';
import { useLocation } from 'react-router-dom'; // Import useLocation

const ExaminationTab = () => {
  const patientDetailsState = usePatientDetailsState();
  const location = useLocation(); // Get location to access state

  if (!patientDetailsState) {
    return <div>Loading patient data...</div>;
  }

  // Get visit_type and flags from navigation state first
  const { consultation_id } = patientDetailsState;
  const { visit_type, flags } = location.state || {}; // Get from navigation state

  // If not in location state, try to get from patientDetailsState or visits
  const isLocked = flags?.is_locked;

  console.log('Debug - visit_type from state:', visit_type, 'isLocked:', isLocked);

  // Render the appropriate component
  const renderExaminationComponent = () => {
    if (!consultation_id) {
      return <div>No consultation data available</div>;
    }

    // Check if visit_type is "New" and locked
    if (visit_type === 'New' && isLocked === true) {
      return <ExaminationDataPrint consultationId={consultation_id} />;
    }

    return <ExaminationForm consultationId={consultation_id} />;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.paper',
        p: 4,
        mt: -16,
      }}
    >
      <Box maxWidth="xl">
        <Box sx={{ mb: 1 }}>
          <Patients patient={patientDetailsState.patient} />
        </Box>
      </Box>
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>{renderExaminationComponent()}</Box>
    </Box>
  );
};

export default ExaminationTab;
