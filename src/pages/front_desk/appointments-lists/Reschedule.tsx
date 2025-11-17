import React from 'react';
import { Box, TextField, Button, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppointmentsService } from '../../../shared/api/services/appointments.services';

interface RescheduleAppointmentProps {
  appointmentId: string;
  onSuccess?: () => void; 
  onCancel?: () => void; // Add cancel prop for dialog
}

const RescheduleAppointment: React.FC<RescheduleAppointmentProps> = ({
  appointmentId,
  onSuccess,
  onCancel,
}) => {
  const formik = useFormik({
    initialValues: {
      appointment_date: '',
      start_time: '',
    },
    validationSchema: Yup.object({
      appointment_date: Yup.string().required('Date is required'),
      start_time: Yup.string().required('Start time is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await AppointmentsService.reschedule(appointmentId, values);
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error(err);
        alert('Failed to reschedule appointment');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <TextField
          type="date"
          label="New Appointment Date"
          name="appointment_date"
          value={formik.values.appointment_date}
          onChange={formik.handleChange}
          error={formik.touched.appointment_date && Boolean(formik.errors.appointment_date)}
          helperText={formik.touched.appointment_date && formik.errors.appointment_date}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />

        <TextField
          type="time"
          label="New Start Time"
          name="start_time"
          value={formik.values.start_time}
          onChange={formik.handleChange}
          error={formik.touched.start_time && Boolean(formik.errors.start_time)}
          helperText={formik.touched.start_time && formik.errors.start_time}
          InputLabelProps={{ shrink: true }}
          fullWidth
          required
        />

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={formik.isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {formik.isSubmitting ? 'Rescheduling...' : 'Reschedule'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default RescheduleAppointment;