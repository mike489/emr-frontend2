import { Box } from '@mui/material';
import ExaminationForm from './ExaminationForm';
import { usePatientDetailsState } from '../../contexts/PatientContext';

const ExaminationTab = () => {
  const patientDetailsState = usePatientDetailsState();

  if (!patientDetailsState) {
    return <div>Loading patient data...</div>;
  }

  const { consultation_id } = patientDetailsState;

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
      <Box sx={{ flex: 1, p: 3, overflowY: 'auto' }}>
        {consultation_id && <ExaminationForm consultationId={consultation_id} />}
      </Box>
    </Box>
  );
};

export default ExaminationTab;
