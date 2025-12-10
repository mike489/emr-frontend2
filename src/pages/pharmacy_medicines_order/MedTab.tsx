import { Box } from '@mui/material';
import { usePatientDetailsState } from '../../contexts/PatientContext';
import Patients from '../../pages/patients/Patients';
import PharmacyMedicinesOrder from './PharmacyMedicinesOrders';

// import PharmacyMedicinesOrder from './pharmacyMedicinesOrder';

const MedTab = () => {
  const patientDetailsState = usePatientDetailsState();

  if (!patientDetailsState) {
    return <div>Loading patient data...</div>;
  }

  const { patient } = patientDetailsState;

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
            <Box maxWidth="xl">
              {/* <IconButton
                onClick={handleBack}
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ArrowBack />
              </IconButton> */}
              <Box maxWidth="xl">
                <Box sx={{ mb: 3 }}>
                  <Patients patient={patient} />
                </Box>
              </Box>
            </Box>

            <PharmacyMedicinesOrder patientId={patient?.id} />
          </>
        ) : (
          <Box color="error.main">No FollowUp ID found</Box>
        )}
      </Box>
    </Box>
  );
};

export default MedTab;
