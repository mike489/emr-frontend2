import React from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import RescheduleAppointment from './Reschedule';
import AppointmentsLists from './AppointmentsLists';

const RescheduleLayout: React.FC = () => {
//   const { appointmentId } = useParams<{ appointmentId?: string }>();
 const location = useLocation();
  const appointmentId = location.state?.appointment.id;
  return (
    <Box sx={{ px: 3, pt: 3, backgroundColor: '#f5f5f5' }}>
      {appointmentId ? (
        <RescheduleAppointment appointmentId={appointmentId} />
      ) : (
        <AppointmentsLists />
      )}
    </Box>
  );
};

export default RescheduleLayout;
