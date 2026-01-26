import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Container,
  Divider,
} from '@mui/material';
import { Person, Save, CheckCircle } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { PatientService } from '../../../shared/api/services/patient.service';
import { toast, ToastContainer } from 'react-toastify';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genders = ['Male', 'Female', 'Other'];
const titles = ['Mr.', 'Ms.', 'Mrs.', 'Dr.'];
// const cities = ['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Mekelle', 'Jimma'];
// const cityToSubCities: Record<string, string[]> = {
//   'Addis Ababa': ['Kirkos', 'Arada', 'Bole', 'Lideta', 'Yeka', 'Nifas Silk'],
//   'Dire Dawa': ['Dire 01', 'Dire 02', 'Dire 03'],
//   Hawassa: ['Hawassa 01', 'Hawassa 02'],
//   'Bahir Dar': ['Bahir 01', 'Bahir 02'],
//   Mekelle: ['Mekelle 01', 'Mekelle 02'],
//   Jimma: ['Jimma 01', 'Jimma 02'],
// };
// const weredas = ['Wereda 01', 'Wereda 02', 'Wereda 03', 'Wereda 04', 'Wereda 05'];

// Validation Schema
const patientSchema = Yup.object()
  .shape({
    title: Yup.string().required('Title is required'),
    full_name: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name too long'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^251[0-9]{9}$/, 'Must start with 251 and be 12 digits total'),
    date_of_birth: Yup.date()
      .required('Date of birth is required')
      .max(new Date(), 'Cannot be future date')
      .test('min-age', 'Patient must be at least 1 year old', value => {
        if (!value) return false;
        const today = new Date();
        const birth = new Date(value);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age >= 1;
      }),
    gender: Yup.string().required('Gender is required'),
    // address: Yup.object().shape({
    //   wereda: Yup.string().required('Wereda is required'),
    //   kifle_ketema: Yup.string().required('Kifle Ketema is required'),
    //   city: Yup.string().required('City is required'),
    // }),
    blood_type: Yup.string().required('Blood type is required'),
    height: Yup.number()
      .typeError('Height must be a number')
      .positive('Height must be positive')
      .min(50, 'Min 50 cm')
      .max(250, 'Max 250 cm')
      .required('Height is required'),
    weight: Yup.number()
      .typeError('Weight must be a number')
      .positive('Weight must be positive')
      .min(20, 'Min 20 kg')
      .max(300, 'Max 300 kg')
      .required('Weight is required'),
    national_id: Yup.string(),
    passport_number: Yup.string(),
  })
  .test('one-id-required', 'Either National ID or Passport Number is required', values => {
    return !!(values?.national_id?.trim() || values?.passport_number?.trim());
  });

const EmergencyPatientForm: React.FC = () => {
  const navigate = useNavigate();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [createdPatient, setCreatedPatient] = useState<any>(null);
  // const [subCities, setSubCities] = useState<string[]>([]);

  const initialValues = {
    title: 'Mr.',
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'Male',
    address: { wereda: '', kifle_ketema: '', city: '' },
    blood_type: 'A+',
    height: '',
    weight: '',
    national_id: '',
    passport_number: '',
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4, mt: { xs: 2, md: -12 } }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Emergency Patient Registration
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Capture emergency patient details quickly. Fields mirror the standard registration.
          </Typography>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={patientSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              const payload = {
                ...values,
                height: Number(values.height),
                weight: Number(values.weight),
                national_id: values.national_id || null,
                passport_number: values.passport_number || null,
                visit_type: 'Emergency',
              };

              const response = await PatientService.createEmergency(payload);
              const patient = response.data?.data || response.data;

              toast.success(
                <>
                  <strong>{patient.full_name}</strong> registered successfully!
                  <br />
                  <Typography component="span" variant="body2">
                    EMR Number: <strong>{patient.emr_number}</strong>
                  </Typography>
                </>
              );

              setCreatedPatient(patient);
              setOpenSuccess(true);
              resetForm();
            } catch (error: any) {
              const msg =
                error.response?.data?.data.message ||
                error.response?.data?.error ||
                'Failed to create patient. Please try again.';
              toast.error(msg);
            }
          }}
        >
          {({ isSubmitting, touched, errors /*values, /* setFieldValue */ }) => (
            <Card elevation={6}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Form>
                  <Grid container spacing={3}>
                    {/* Left Column */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Personal Information
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <Field
                                as={TextField}
                                name="title"
                                label="Title *"
                                select
                                fullWidth
                                size="small"
                                error={touched.title && !!errors.title}
                                helperText={<ErrorMessage name="title" />}
                              >
                                {titles.map(t => (
                                  <MenuItem key={t} value={t}>
                                    {t}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 8 }}>
                              <Field
                                as={TextField}
                                name="full_name"
                                label="Full Name *"
                                fullWidth
                                size="small"
                                placeholder="Enter full name"
                                error={touched.full_name && !!errors.full_name}
                                helperText={<ErrorMessage name="full_name" />}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Person color="action" />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Field
                                as={TextField}
                                name="gender"
                                label="Gender *"
                                select
                                fullWidth
                                size="small"
                                error={touched.gender && !!errors.gender}
                                helperText={<ErrorMessage name="gender" />}
                              >
                                {genders.map(g => (
                                  <MenuItem key={g} value={g}>
                                    {g}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Field
                                as={TextField}
                                name="date_of_birth"
                                label="Date of Birth *"
                                type="date"
                                fullWidth
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                error={touched.date_of_birth && !!errors.date_of_birth}
                                helperText={<ErrorMessage name="date_of_birth" />}
                              />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                              <Typography
                                variant="subtitle1"
                                sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}
                              >
                                Contact Information
                              </Typography>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                              <Field
                                as={TextField}
                                name="email"
                                label="Email Address *"
                                type="email"
                                fullWidth
                                size="small"
                                error={touched.email && !!errors.email}
                                helperText={<ErrorMessage name="email" />}
                              />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                              <Field
                                as={TextField}
                                name="phone"
                                label="Phone Number *"
                                fullWidth
                                size="small"
                                placeholder="2519xxxxxxxx"
                                error={touched.phone && !!errors.phone}
                                helperText={<ErrorMessage name="phone" />}
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">+</InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Right Column */}
                    <Grid size={{ xs: 12, md: 6 }}>
                      {/*
                      <Card variant="outlined" sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Address & Identification
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12 }}>
                              <Field
                                as={TextField}
                                name="address.city"
                                label="City *"
                                select
                                fullWidth
                                size="small"
                                value={values.address.city}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                  const city = e.target.value;
                                  setFieldValue('address.city', city);
                                  setFieldValue('address.kifle_ketema', '');
                                  setSubCities(cityToSubCities[city] || []);
                                }}
                                error={touched.address?.city && !!errors.address?.city}
                                helperText={<ErrorMessage name="address.city" />}
                              >
                                {cities.map(city => (
                                  <MenuItem key={city} value={city}>
                                    {city}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Field
                                as={TextField}
                                name="address.kifle_ketema"
                                label="Sub-City *"
                                select
                                fullWidth
                                size="small"
                                disabled={subCities.length === 0}
                                value={values.address.kifle_ketema}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setFieldValue('address.kifle_ketema', e.target.value)
                                }
                                error={
                                  touched.address?.kifle_ketema && !!errors.address?.kifle_ketema
                                }
                                helperText={<ErrorMessage name="address.kifle_ketema" />}
                              >
                                {subCities.map(sub => (
                                  <MenuItem key={sub} value={sub}>
                                    {sub}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Field
                                as={TextField}
                                name="address.wereda"
                                label="Wereda *"
                                select
                                fullWidth
                                size="small"
                                value={values.address.wereda}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                  setFieldValue('address.wereda', e.target.value)
                                }
                                error={touched.address?.wereda && !!errors.address?.wereda}
                                helperText={<ErrorMessage name="address.wereda" />}
                              >
                                {weredas.map(w => (
                                  <MenuItem key={w} value={w}>
                                    {w}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Field
                                as={TextField}
                                name="national_id"
                                label="National ID"
                                fullWidth
                                size="small"
                                placeholder="Optional if passport provided"
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Field
                                as={TextField}
                                name="passport_number"
                                label="Passport Number"
                                fullWidth
                                size="small"
                                placeholder="Optional if National ID provided"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      */}

                      <Card variant="outlined">
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Medical Information
                          </Typography>

                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <Field
                                as={TextField}
                                name="blood_type"
                                label="Blood Type *"
                                select
                                fullWidth
                                size="small"
                                error={touched.blood_type && !!errors.blood_type}
                                helperText={<ErrorMessage name="blood_type" />}
                              >
                                {bloodTypes.map(bt => (
                                  <MenuItem key={bt} value={bt}>
                                    {bt}
                                  </MenuItem>
                                ))}
                              </Field>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                              <Field
                                as={TextField}
                                name="height"
                                label="Height (cm) *"
                                type="number"
                                fullWidth
                                size="small"
                                error={touched.height && !!errors.height}
                                helperText={<ErrorMessage name="height" />}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">cm</InputAdornment>,
                                }}
                              />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                              <Field
                                as={TextField}
                                name="weight"
                                label="Weight (kg) *"
                                type="number"
                                fullWidth
                                size="small"
                                error={touched.weight && !!errors.weight}
                                helperText={<ErrorMessage name="weight" />}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />

                  <ErrorMessage name="one-id-required">
                    {msg => (
                      <Typography color="error" sx={{ mt: 1, fontSize: '0.875rem' }}>
                        {msg}
                      </Typography>
                    )}
                  </ErrorMessage>

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      startIcon={isSubmitting ? <CircularProgress size={20} /> : <Save />}
                      sx={{ minWidth: 220 }}
                    >
                      {isSubmitting ? 'Creating Patient...' : 'Create Emergency Patient'}
                    </Button>
                  </Box>
                </Form>
              </CardContent>
            </Card>
          )}
        </Formik>
      </Container>

      {/* Success Dialog */}
      <Dialog open={openSuccess} onClose={() => setOpenSuccess(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>
          <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
          Patient Created Successfully!
        </DialogTitle>
        <DialogContent sx={{ pt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Patient: <strong>{createdPatient?.full_name}</strong>
          </Typography>
          <Typography variant="body1" color="text.secondary">
            EMR Number: <strong>{createdPatient?.emr_number}</strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuccess(false)}>Create Another</Button>
          <Button variant="contained" onClick={() => navigate('/front-desk')}>
            Back to Dashboard
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Container (you can also move this to App.tsx) */}
      <ToastContainer />
    </Box>
  );
};

export default EmergencyPatientForm;
