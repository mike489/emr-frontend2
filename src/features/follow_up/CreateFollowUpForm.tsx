import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  CircularProgress,
  Container,
  Fade,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, type FieldProps } from 'formik';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast, ToastContainer } from 'react-toastify';
import { FollowUpService } from '../../shared/api/services/followUp.service';
import { PatientService } from '../../shared/api/services/patient.service';

interface FollowUpFormData {
  patient_id: string;
  od_s_correction: string;
  od_c_correction: string;
  od_iop: number | string | null;
  od_cct: string;
  os_s_correction: string;
  os_c_correction: string;
  os_iop: number | string | null;
  os_cct: string;
  examination_findings: string;
  plan: string;
  remark: string;
  diagnosis: string;
}

interface CreateFollowUpFormProps {
  patientId: string;
  visitId?: string;
  consultationId?: string;
}

// Default initial values
const defaultInitialValues: FollowUpFormData = {
  patient_id: '',
  od_s_correction: '',
  od_c_correction: '',
  od_iop: null,
  od_cct: '',
  os_s_correction: '',
  os_c_correction: '',
  os_iop: null,
  os_cct: '',
  examination_findings: '',
  plan: '',
  remark: '',
  diagnosis: '',
};

const CreateFollowUpForm: React.FC<CreateFollowUpFormProps> = ({
  patientId,
  visitId,
  consultationId,
}) => {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<FollowUpFormData>(defaultInitialValues);
  const [loading, setLoading] = useState(true);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ],
    }),
    []
  );

  const quillFormats = ['bold', 'italic', 'underline', 'list', 'bullet', 'link', 'header'];

  // Fetch existing follow-up data
  useEffect(() => {
    const fetchData = async () => {
      if (!consultationId) {
        setInitialValues(prev => ({ ...prev, patient_id: patientId }));
        setLoading(false);
        return;
      }

      try {
        const res = await PatientService.getFollowUpNotesData(consultationId);

        if (res.data.success && res.data.data.data && res.data.data.data.length > 0) {
          const followUpData = res.data.data.data[0];

          // Normalize the data (convert empty strings to null, etc.)
          const normalized = Object.fromEntries(
            Object.entries(followUpData).map(([key, value]) => [
              key,
              value === '' || value === undefined ? null : value,
            ])
          ) as unknown as FollowUpFormData;

          // Merge with defaults and set patient_id
          const updated = {
            ...defaultInitialValues,
            ...normalized,
            patient_id: patientId,
          };

          setInitialValues(updated);
          toast.success('Follow-up data loaded successfully');
        } else {
          // No existing data found, set patient_id
          setInitialValues(prev => ({ ...prev, patient_id: patientId }));
          toast.info('No existing follow-up data found');
        }
      } catch (err: any) {
        console.error('Error fetching follow-up data:', err);
        toast.error('Failed to load follow-up data');
        setInitialValues(prev => ({ ...prev, patient_id: patientId }));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [consultationId, patientId]);

  const handleSubmit = async (values: FollowUpFormData, { setSubmitting }: any) => {
    if (!values.patient_id) {
      toast.error('Patient ID is required');
      setSubmitting(false);
      return;
    }

    if (!values.examination_findings?.trim() || !values.plan?.trim() || !values.diagnosis?.trim()) {
      toast.error('Examination findings, Plan, and Diagnosis are required');
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...values,
        od_iop: values.od_iop ? Number(values.od_iop) : null,
        os_iop: values.os_iop ? Number(values.os_iop) : null,
        visit_id: visitId || null,
      };

      await FollowUpService.create(payload);
      toast.success('Follow-up note created successfully!');
      navigate(-1);
    } catch (err: any) {
      console.error('API Error:', err.response?.data);
      toast.error(err?.response?.data?.message || 'Failed to create follow-up');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading follow-up data...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ values, isSubmitting, setFieldValue }) => (
        <Form>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
                  OD (Right Eye)
                </Typography>

                <Grid container spacing={3}>
                  {[
                    {
                      name: 'od_s_correction',
                      label: 'Spherical Correction (S)',
                      placeholder: '-2.50',
                    },
                    {
                      name: 'od_c_correction',
                      label: 'Cylindrical Correction (C)',
                      placeholder: '1.25',
                    },
                    { name: 'od_iop', label: 'IOP (mmHg)', type: 'number', placeholder: '18' },
                    { name: 'od_cct', label: 'CCT (µm)', placeholder: '550' },
                  ].map(({ name, label, type, placeholder }) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={name}>
                      <Field name={name}>
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            type={type || 'text'}
                            label={label}
                            fullWidth
                            value={field.value ?? ''}
                            placeholder={placeholder}
                            error={meta.touched && !!meta.error}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                      </Field>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 4 }} />

                <Typography variant="h6" color="secondary" gutterBottom>
                  OS (Left Eye)
                </Typography>

                <Grid container spacing={3}>
                  {[
                    {
                      name: 'os_s_correction',
                      label: 'Spherical Correction (S)',
                      placeholder: '-2.00',
                    },
                    {
                      name: 'os_c_correction',
                      label: 'Cylindrical Correction (C)',
                      placeholder: '1.00',
                    },
                    { name: 'os_iop', label: 'IOP (mmHg)', type: 'number', placeholder: '17' },
                    { name: 'os_cct', label: 'CCT (µm)', placeholder: '545' },
                  ].map(({ name, label, type, placeholder }) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={name}>
                      <Field name={name}>
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            {...field}
                            type={type || 'text'}
                            label={label}
                            fullWidth
                            value={field.value ?? ''}
                            placeholder={placeholder}
                            error={meta.touched && !!meta.error}
                            helperText={meta.touched && meta.error}
                          />
                        )}
                      </Field>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 5 }} />

                <Grid container spacing={4}>
                  <Grid size={12}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Examination Findings *
                    </Typography>
                    <Field name="examination_findings">
                      {({ field }: FieldProps) => (
                        <Box sx={{ mb: 6 }}>
                          <ReactQuill
                            theme="snow"
                            value={field.value || ''}
                            onChange={value => setFieldValue('examination_findings', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ height: '180px' }}
                            placeholder="Enter examination findings..."
                          />
                          <ErrorMessage name="examination_findings">
                            {msg => (
                              <Typography color="error" variant="caption">
                                {msg}
                              </Typography>
                            )}
                          </ErrorMessage>
                        </Box>
                      )}
                    </Field>
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Diagnosis *
                    </Typography>
                    <Field name="diagnosis">
                      {({ field }: FieldProps) => (
                        <Box sx={{ mb: 6 }}>
                          <ReactQuill
                            theme="snow"
                            value={field.value || ''}
                            onChange={value => setFieldValue('diagnosis', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ height: '120px' }}
                            placeholder="Enter diagnosis..."
                          />
                          <ErrorMessage name="diagnosis">
                            {msg => (
                              <Typography color="error" variant="caption">
                                {msg}
                              </Typography>
                            )}
                          </ErrorMessage>
                        </Box>
                      )}
                    </Field>
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Plan *
                    </Typography>
                    <Field name="plan">
                      {({ field }: FieldProps) => (
                        <Box sx={{ mb: 6 }}>
                          <ReactQuill
                            theme="snow"
                            value={field.value || ''}
                            onChange={value => setFieldValue('plan', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ height: '140px' }}
                            placeholder="Enter plan..."
                          />
                          <ErrorMessage name="plan">
                            {msg => (
                              <Typography color="error" variant="caption">
                                {msg}
                              </Typography>
                            )}
                          </ErrorMessage>
                        </Box>
                      )}
                    </Field>
                  </Grid>

                  <Grid size={12}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Remark (Optional)
                    </Typography>
                    <Field name="remark">
                      {({ field }: FieldProps) => (
                        <Box sx={{ mb: 6 }}>
                          <ReactQuill
                            theme="snow"
                            value={field.value || ''}
                            onChange={value => setFieldValue('remark', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ height: '100px' }}
                            placeholder="Enter remarks..."
                          />
                        </Box>
                      )}
                    </Field>
                  </Grid>
                </Grid>

                {/* Floating Save Button */}
                <Fade in={true}>
                  <Box
                    sx={{
                      position: 'fixed',
                      bottom: 16,
                      right: 16,
                      zIndex: 1300,
                      display: 'flex',
                      gap: 1,
                      bgcolor: 'background.paper',
                      p: 1.5,
                      borderRadius: 1,
                      boxShadow: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      size="medium"
                      startIcon={<CancelIcon fontSize="small" />}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={
                        isSubmitting ||
                        !values.examination_findings?.trim() ||
                        !values.diagnosis?.trim() ||
                        !values.plan?.trim()
                      }
                      size="medium"
                      startIcon={
                        isSubmitting ? (
                          <CircularProgress size={16} />
                        ) : (
                          <SaveIcon fontSize="small" />
                        )
                      }
                      sx={{ minWidth: 150 }}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Follow Up Note'}
                    </Button>
                  </Box>
                </Fade>
              </Box>
            </Paper>
            <ToastContainer position="top-right" autoClose={3000} />
          </Container>
        </Form>
      )}
    </Formik>
  );
};

export default CreateFollowUpForm;
