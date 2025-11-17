import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AppointmentsService } from '../../../shared/api/services/appointments.services';
import { doctorsService } from '../../../shared/api/services/Doctor.service';
import { toast } from 'react-toastify';


interface Doctor {
  id: string;
  name: string;
}

const sourceOptions = ['Website', 'Call Center', 'In Person'];

const CreateAppointment: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  /* ---------------- Fetch Doctors ---------------- */
 useEffect(() => {
  const loadDoctors = async () => {
    try {
      const res = await doctorsService.getAll();
      setDoctors(res.data.data || []);
    } catch (err: any) {
      console.error('Failed to fetch doctors', err);
      toast.error(err.response?.data?.data.message || 'Failed to fetch doctors');
    } finally {
      setLoadingDoctors(false);
    }
  };

  loadDoctors();
}, []);

  /* ---------------- Formik & Yup ---------------- */
  const formik = useFormik({
    initialValues: {
      doctor_id: '',
      patient_name: '',
      appointment_date: '',
      start_time: '',
      phone_number: '',
      email: '',
      age: '',
      gender: '',
      source: '',
    },
    validationSchema: Yup.object({
      doctor_id: Yup.string().required('Doctor is required'),
      patient_name: Yup.string().required('Patient name is required'),
      appointment_date: Yup.string().required('Appointment date is required'),
      start_time: Yup.string().required('Start time is required'),
      phone_number: Yup.string().required('Phone number is required'),
      email: Yup.string().email('Invalid email'),
      age: Yup.number().positive('Age must be positive').integer('Age must be a number'),
      gender: Yup.string().required('Gender is required'),
      source: Yup.string().required('Source is required'),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        await AppointmentsService.create(values);
        toast.success('Appointment created successfully!');
        resetForm();
      } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.data.message || 'Failed to create appointment');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box sx={{ px: 4, py: 3, backgroundColor: '#f0f2f5', mt: -16 }}>
     
      <Paper sx={{ p: 4, maxWidth: 800, margin: '0 auto' }}>
         <Typography variant="h5" sx={{ mb: 3 }}>
        Create Appointment
      </Typography>
        <Stack spacing={3}>
          {/* Doctor */}
          <TextField
            select
            label="Doctor"
            name="doctor_id"
            value={formik.values.doctor_id}
            onChange={formik.handleChange}
            error={formik.touched.doctor_id && Boolean(formik.errors.doctor_id)}
            helperText={formik.touched.doctor_id && formik.errors.doctor_id}
            fullWidth
            required
          >
            {loadingDoctors ? (
              <MenuItem value="">
                <CircularProgress size={20} />
              </MenuItem>
            ) : (
              doctors.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                  {doc.name}
                </MenuItem>
              ))
            )}
          </TextField>

          {/* Patient Name */}
          <TextField
            label="Patient Name"
            name="patient_name"
            value={formik.values.patient_name}
            onChange={formik.handleChange}
            error={formik.touched.patient_name && Boolean(formik.errors.patient_name)}
            helperText={formik.touched.patient_name && formik.errors.patient_name}
            fullWidth
            required
          />

          {/* Appointment Date & Time */}
          <Stack direction="row" spacing={2}>
            <TextField
              type="date"
              label="Appointment Date"
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
              label="Start Time"
              name="start_time"
              value={formik.values.start_time}
              onChange={formik.handleChange}
              error={formik.touched.start_time && Boolean(formik.errors.start_time)}
              helperText={formik.touched.start_time && formik.errors.start_time}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Stack>

          {/* Contact Info */}
          <TextField
            label="Phone Number"
            name="phone_number"
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
            helperText={formik.touched.phone_number && formik.errors.phone_number}
            fullWidth
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
          />

          {/* Age & Gender */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formik.values.age}
              onChange={formik.handleChange}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors.age}
              fullWidth
            />
            <TextField
              select
              label="Gender"
              name="gender"
              value={formik.values.gender}
              onChange={formik.handleChange}
              error={formik.touched.gender && Boolean(formik.errors.gender)}
              helperText={formik.touched.gender && formik.errors.gender}
              fullWidth
              required
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Stack>

          {/* Source */}
          <TextField
            select
            label="Source"
            name="source"
            value={formik.values.source}
            onChange={formik.handleChange}
            error={formik.touched.source && Boolean(formik.errors.source)}
            helperText={formik.touched.source && formik.errors.source}
            fullWidth
            required
          >
            {sourceOptions.map((src) => (
              <MenuItem key={src} value={src}>
                {src}
              </MenuItem>
            ))}
          </TextField>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            
            sx={{ width: 'fit-content', display: 'flex', justifyContent:'flex-end', alignSelf: 'flex-end', mt: 2 }}
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Creating...' : 'Create'}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CreateAppointment;
