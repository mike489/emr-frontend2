import { Box, Container } from '@mui/material';
import ExaminationForm from './ExaminationForm';
import ExaminationDataPrint from './ExaminationDataPrint';
import { usePatientDetailsState } from '../../contexts/PatientContext';
import Patients from '../../pages/patients/Patients';
import { useLocation } from 'react-router-dom';

const ExaminationTab = () => {
  const patientDetailsState = usePatientDetailsState();
  const location = useLocation();

  if (!patientDetailsState) {
    return <div>Loading patient data...</div>;
  }

  const { consultation_id } = patientDetailsState;
  const { visit_type, flags } = location.state || {};

  const isLocked = flags?.is_locked;

  console.log('Debug - visit_type from state:', visit_type, 'isLocked:', isLocked);

  const renderExaminationComponent = () => {
    if (!consultation_id) {
      return <div>No consultation data available</div>;
    }

    if (visit_type === 'New' && isLocked === true) {
      return <ExaminationDataPrint consultationId={consultation_id} />;
    }

    if (visit_type === 'New' && isLocked === false) {
      return <ExaminationForm consultationId={consultation_id} />;
    }

    // Fallback
    return <div>Invalid visit type or status</div>;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.paper',
        mt: -16,
      }}
    >
      {/* Centered Patients section */}
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ my: 2 }}>
          <Patients patient={patientDetailsState.patient} />
        </Box>
      </Container>

      {/* Main content with container */}
      <Container
        maxWidth={false}
        sx={{ flex: 1, px: { xs: 2, sm: 3, md: 4 }, py: 3, overflowY: 'auto' }}
      >
        {renderExaminationComponent()}
      </Container>
    </Box>
  );
};

export default ExaminationTab;
