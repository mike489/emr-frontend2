import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Chip,
  Fade,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  MedicalInformation as MedicalIcon,
  Favorite as FavoriteIcon,
  Psychology as PsychologyIcon,
  Visibility as VisibilityIcon,
  Straighten as StraightenIcon,
  Biotech as BiotechIcon,
} from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage, type FieldProps, getIn } from 'formik';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import dayjs from 'dayjs';
import { PatientService } from '../../shared/api/services/patient.service';
import type { ExaminationData } from '../../shared/api/types/examination.types';

interface ExaminationFormProps {
  consultationId: string;
}

// === CONSTANTS ===
const EOM_OPTIONS = ['Normal', 'Restricted', 'Other'] as const;
const DILATED_OPTIONS = ['Yes', 'No'] as const;

// === DEFAULT INITIAL VALUES ===
const defaultInitialValues: ExaminationData = {
  primary_complaint: '',
  complaint_details: '',
  current_oscular_medication: '',
  current_contact_lense_use: false,
  lens_type: '',
  current_systemic_medication: '',
  family_history: [],
  systemic_conditions: [],
  allergies: [],

  distance_od_ucva: '',
  distance_od_scva: '',
  distance_od_bcva: '',
  distance_os_ucva: '',
  distance_os_scva: '',
  distance_os_bcva: '',
  near_od_ucva: '',
  near_od_scva: '',
  near_od_bcva: '',
  near_os_ucva: '',
  near_os_scva: '',
  near_os_bcva: '',

  pupil_reaction_od_ucva: '',
  pupil_reaction_od_scva: '',
  pupil_reaction_od_bcva: '',
  pupil_reaction_os_ucva: '',
  pupil_reaction_os_scva: '',
  pupil_reaction_os_bcva: '',

  eom: null,
  eom_gaze: '',
  eom_eye: '',

  hirschberg_test: '',
  hirschberg_test_eye: '',
  hirschberg_test_deviation: '',
  cover_uncover_test: '',
  cover_uncover_test_phoria: '',
  cover_uncover_test_tropia: '',
  cover_uncover_test_direction: '',
  cover_uncover_test_distance: '',
  cover_uncover_test_near: '',

  stereopsis: '',
  stereopsis_test: '',

  methods: { value: '', other: null },
  left_eye: '',
  right_eye: '',
  time_of_measurement: null,

  lids_od: '',
  lids_os: '',
  lashes_od: '',
  lashes_os: '',
  conjunctiva_od: '',
  conjunctiva_os: '',
  sclera_od: '',
  sclera_os: '',
  lacrimal_system_od: '',
  lacrimal_system_os: '',
  cornea_od: '',
  cornea_os: '',
  anterior_chamber_od: '',
  anterior_chamber_os: '',
  iris_od: '',
  iris_os: '',
  lens_od: '',
  lens_os: '',
  vitreous_od: '',
  vitreous_os: '',

  dilated: null,
  dilation_time: null,
  dilation_drops_used: '',

  optic_disc_od: '',
  optic_disc_os: '',
  macula_od: '',
  macula_os: '',
  vessels_od: '',
  vessels_os: '',
  periphery_od: '',
  periphery_os: '',

  heart_rate: '',
  temperature: '',
  respiratory_rate: '',
  oxygen_saturation: '',
  blood_pressure: '',

  primary_diagnosis: '',
  plan: '',
};

const ExaminationForm: React.FC<ExaminationFormProps> = ({ consultationId }) => {
  const [initialValues, setInitialValues] = useState<ExaminationData>(defaultInitialValues);
  const [loading, setLoading] = useState(true);

  const quillModules = useMemo(
    () => ({
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ],
    }),
    []
  );

  const quillFormats = ['bold', 'italic', 'underline', 'list', 'bullet', 'link'];

  // === FETCH EXISTING DATA ===
  useEffect(() => {
    const fetchData = async () => {
      if (!consultationId) {
        setLoading(false);
        return;
      }

      try {
        const res = await PatientService.getExaminationData(consultationId);
        const data = res.data.data.examination_data;

        const normalized = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
        ) as unknown as ExaminationData;

        setInitialValues({ ...defaultInitialValues, ...normalized });
      } catch (err) {
        console.log('No existing data or error:', err);
        setInitialValues(defaultInitialValues);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [consultationId]);

  // === TIME FORMATTER ===
  const formatTime = (time: string | null): string | null => {
    if (!time) return null;
    const parsed = dayjs(time, ['h:mm A', 'H:mm', 'HH:mm'], true);
    return parsed.isValid() ? parsed.format('HH:mm') : null;
  };

  // === SUBMIT HANDLER ===
  const handleSubmit = async (values: ExaminationData, { setSubmitting }: any) => {
    if (!consultationId) {
      toast.error('Visit ID is missing');
      setSubmitting(false);
      return;
    }

    const examination_data = {
      ...values,
      heart_rate: values.heart_rate || null,
      temperature: values.temperature || null,
      respiratory_rate: values.respiratory_rate || null,
      oxygen_saturation: values.oxygen_saturation || null,
      blood_pressure: values.blood_pressure || null,
      time_of_measurement: formatTime(values.time_of_measurement),
      dilation_time: values.dilated === 'Yes' ? formatTime(values.dilation_time) : null,
      methods: values.methods?.value
        ? { value: values.methods.value, other: values.methods.other || null }
        : null,
    };

    const payload = { consultation_id: consultationId, examination_data };

    try {
      await PatientService.createExamination(payload);
      toast.success('Examination saved successfully!');
    } catch (err: any) {
      console.error('API Error:', err.response?.data);
      toast.error(err?.response?.data?.data.message || 'Failed to save examination');
    } finally {
      setSubmitting(false);
    }
  };

  // === LOADING STATE ===
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400} p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ values, isSubmitting, touched, errors }) => (
        <Form>
          <Box
            sx={{
              p: { xs: 1, md: 2 },
              maxWidth: 1400,
              mx: 'auto',
              backgroundColor: 'grey.50',
              minHeight: '100vh',
            }}
          >
            {/* === VITAL SIGNS === */}
            <Paper sx={{ mb: 2, p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FavoriteIcon color="error" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Vital Signs
                </Typography>
              </Box>
              <Grid container spacing={1}>
                {[
                  { name: 'heart_rate', label: 'HR (bpm)' },
                  { name: 'temperature', label: 'Temp (°C)' },
                  { name: 'respiratory_rate', label: 'RR (breaths/min)' },
                  { name: 'oxygen_saturation', label: 'O2 Sat (%)' },
                  { name: 'blood_pressure', label: 'BP (e.g. 120/80)' },
                  { name: 'time_of_measurement', label: 'Time' },
                ].map(({ name, label }) => (
                  <Grid size={{ xs: 6, sm: 4, md: 2 }} key={name}>
                    <Field name={name}>
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          label={label}
                          size="small"
                          fullWidth
                          value={field.value ?? ''}
                          error={getIn(touched, name) && !!getIn(errors, name)}
                          helperText={<ErrorMessage name={name} />}
                        />
                      )}
                    </Field>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            <Divider sx={{ my: 2 }} />

            {/* === PATIENT HISTORY === */}
            <Paper sx={{ mb: 2, p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <PsychologyIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Patient History
                </Typography>
              </Box>

              <Grid container spacing={1}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Complaint Details
                  </Typography>
                  <Field name="complaint_details">
                    {({ field, form }: FieldProps) => (
                      <Box sx={{ mb: 5 }}>
                        <ReactQuill
                          theme="snow"
                          value={field.value || ''}
                          onChange={value => form.setFieldValue('complaint_details', value)}
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ height: 120 }}
                          placeholder="Complaint details..."
                        />
                      </Box>
                    )}
                  </Field>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Field name="current_oscular_medication">
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label="Ocular Meds"
                        size="small"
                        fullWidth
                        margin="dense"
                      />
                    )}
                  </Field>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Field name="current_contact_lense_use">
                      {({ field }: FieldProps) => (
                        <FormControlLabel
                          control={<Switch {...field} checked={field.value} size="small" />}
                          label="Contact Lens"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Field>
                    {values.current_contact_lense_use && (
                      <Box sx={{ ml: 2, flexGrow: 1 }}>
                        <Field name="lens_type">
                          {({ field }: FieldProps) => (
                            <TextField
                              {...field}
                              label="Type"
                              size="small"
                              fullWidth
                              margin="dense"
                            />
                          )}
                        </Field>
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Field name="current_systemic_medication">
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label="Systemic Meds"
                        size="small"
                        fullWidth
                        margin="dense"
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>

              {/* Dynamic Multi-input Fields */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {(['systemic_conditions', 'allergies', 'family_history'] as const).map(field => {
                  const label = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                  return (
                    <Grid size={{ xs: 12, md: 4 }} key={field}>
                      <Typography variant="body2" gutterBottom fontWeight="medium">
                        {label}
                      </Typography>

                      <Field name={field}>
                        {({ field: formikField, form }: FieldProps<string[]>) => {
                          const items = formikField.value || [];
                          const [inputValue, setInputValue] = useState('');

                          const handleAdd = () => {
                            const trimmed = inputValue.trim();
                            if (trimmed && !items.includes(trimmed)) {
                              form.setFieldValue(field, [...items, trimmed]);
                              setInputValue('');
                            }
                          };

                          const handleRemove = (index: number) => {
                            form.setFieldValue(
                              field,
                              items.filter((_, i) => i !== index)
                            );
                          };

                          const handleKeyDown = (e: React.KeyboardEvent) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAdd();
                            }
                          };

                          return (
                            <Box>
                              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <TextField
                                  size="small"
                                  fullWidth
                                  placeholder={`Add ${label.toLowerCase()}...`}
                                  value={inputValue}
                                  onChange={e => setInputValue(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  inputProps={{ maxLength: 100 }}
                                />
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={handleAdd}
                                  disabled={!inputValue.trim()}
                                  sx={{ minWidth: 60 }}
                                >
                                  Add
                                </Button>
                              </Box>

                              {items.length > 0 && (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                                  {items.map((item, index) => (
                                    <Chip
                                      key={index}
                                      label={item}
                                      onDelete={() => handleRemove(index)}
                                      color="primary"
                                      variant="outlined"
                                      size="small"
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          );
                        }}
                      </Field>
                    </Grid>
                  );
                })}
              </Grid>
            </Paper>

            <Divider sx={{ my: 2 }} />

            {/* === VISUAL ACUITY === */}
            <Paper sx={{ mb: 2, p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <VisibilityIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Visual Acuity
                </Typography>
              </Box>
              <Grid container spacing={1}>
                {['distance', 'near'].map(dist => (
                  <Grid size={{ xs: 12 }} key={dist}>
                    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                      {dist} Vision
                    </Typography>
                    <Grid container spacing={1}>
                      {['od', 'os'].map(eye =>
                        ['ucva', 'scva', 'bcva'].map(type => {
                          const name = `${dist}_${eye}_${type}`;
                          return (
                            <Grid size={{ xs: 4, sm: 2 }} key={name}>
                              <Field name={name}>
                                {({ field }: FieldProps) => (
                                  <TextField
                                    {...field}
                                    label={`${eye.toUpperCase()} ${type.toUpperCase()}`}
                                    size="small"
                                    fullWidth
                                    value={field.value ?? ''}
                                    error={getIn(touched, name) && !!getIn(errors, name)}
                                  />
                                )}
                              </Field>
                            </Grid>
                          );
                        })
                      )}
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* === PUPIL & MOTILITY === */}
            <Paper sx={{ mb: 2, p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <StraightenIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Pupil & Motility
                </Typography>
              </Box>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Field name="eom">
                    {({ field }: FieldProps) => (
                      <FormControl fullWidth size="small">
                        <InputLabel>EOM</InputLabel>
                        <Select {...field} label="EOM" value={field.value ?? ''}>
                          {EOM_OPTIONS.map(opt => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                </Grid>
                {['eom_gaze', 'eom_eye'].map(name => (
                  <Grid size={{ xs: 12, sm: 4 }} key={name}>
                    <Field name={name}>
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          label={name.replace(/_/g, ' ')}
                          size="small"
                          fullWidth
                          value={field.value ?? ''}
                        />
                      )}
                    </Field>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* === ALIGNMENT TESTS === */}
            <Paper sx={{ mb: 2, p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BiotechIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Alignment Tests
                </Typography>
              </Box>
              <Grid container spacing={1}>
                {[
                  { name: 'hirschberg_test', label: 'Hirschberg' },
                  { name: 'cover_uncover_test', label: 'Cover Test' },
                  { name: 'stereopsis', label: 'Stereopsis' },
                ].map(({ name, label }) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={name}>
                    <Field name={name}>
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          label={label}
                          size="small"
                          fullWidth
                          value={field.value ?? ''}
                        />
                      )}
                    </Field>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* === IOP === */}
            <Paper sx={{ mb: 2, p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BiotechIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  IOP
                </Typography>
              </Box>
              <Grid container spacing={1} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Field name="methods.value">
                    {({ field }: FieldProps) => (
                      <FormControl fullWidth size="small">
                        <InputLabel>Method</InputLabel>
                        <Select {...field} label="Method" value={field.value ?? ''}>
                          <MenuItem value="Applanation">Applanation</MenuItem>
                          <MenuItem value="Tonopen">Tonopen</MenuItem>
                          <MenuItem value="Schiotz">Schiotz</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                </Grid>

                {values.methods?.value === 'Other' && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Field name="methods.other">
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Other Method"
                          size="small"
                          fullWidth
                          value={field.value ?? ''}
                        />
                      )}
                    </Field>
                  </Grid>
                )}

                {['left_eye', 'right_eye'].map(name => (
                  <Grid size={{ xs: 12, sm: 4 }} key={name}>
                    <Field name={name}>
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          label={name === 'left_eye' ? 'Left (mmHg)' : 'Right (mmHg)'}
                          size="small"
                          fullWidth
                          value={field.value ?? ''}
                        />
                      )}
                    </Field>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* === ANTERIOR SEGMENT === */}
            <Paper sx={{ mb: 2, p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <VisibilityIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Anterior Segment
                </Typography>
              </Box>
              <Grid container spacing={1}>
                {[
                  { od: 'lids_od', os: 'lids_os', label: 'Lids' },
                  { od: 'lashes_od', os: 'lashes_os', label: 'Lashes' },
                  { od: 'conjunctiva_od', os: 'conjunctiva_os', label: 'Conjunctiva' },
                  { od: 'sclera_od', os: 'sclera_os', label: 'Sclera' },
                  { od: 'cornea_od', os: 'cornea_os', label: 'Cornea' },
                  { od: 'anterior_chamber_od', os: 'anterior_chamber_os', label: 'Ant Chamber' },
                  { od: 'iris_od', os: 'iris_os', label: 'Iris' },
                  { od: 'lens_od', os: 'lens_os', label: 'Lens' },
                ].map(({ od, os, label }) => (
                  <Grid size={{ xs: 12 }} key={od}>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                      {label}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 6 }}>
                        <Field name={od}>
                          {({ field }: FieldProps) => (
                            <TextField
                              {...field}
                              label="OD"
                              size="small"
                              fullWidth
                              value={field.value ?? ''}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Field name={os}>
                          {({ field }: FieldProps) => (
                            <TextField
                              {...field}
                              label="OS"
                              size="small"
                              fullWidth
                              value={field.value ?? ''}
                            />
                          )}
                        </Field>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* === DILATION === */}
            <Paper sx={{ mb: 2, p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <MedicalIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Dilation
                </Typography>
              </Box>
              <Grid container spacing={1}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Field name="dilated">
                    {({ field }: FieldProps) => (
                      <FormControl fullWidth size="small">
                        <InputLabel>Dilated</InputLabel>
                        <Select {...field} label="Dilated" value={field.value ?? ''}>
                          {DILATED_OPTIONS.map(opt => (
                            <MenuItem key={opt} value={opt}>
                              {opt}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                </Grid>

                {values.dilated === 'Yes' && (
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Field name="dilation_time">
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Time"
                          placeholder="15:00"
                          size="small"
                          fullWidth
                          value={field.value ?? ''}
                        />
                      )}
                    </Field>
                  </Grid>
                )}

                <Grid size={{ xs: 12, sm: 4 }}>
                  <Field name="dilation_drops_used">
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label="Drops Used"
                        size="small"
                        fullWidth
                        value={field.value ?? ''}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
            </Paper>

            {/* === POSTERIOR SEGMENT === */}
            <Paper sx={{ mb: 2, p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <VisibilityIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Posterior Segment
                </Typography>
              </Box>
              <Grid container spacing={1}>
                {[
                  { od: 'optic_disc_od', os: 'optic_disc_os', label: 'Optic Disc' },
                  { od: 'macula_od', os: 'macula_os', label: 'Macula' },
                  { od: 'vessels_od', os: 'vessels_os', label: 'Vessels' },
                  { od: 'periphery_od', os: 'periphery_os', label: 'Periphery' },
                ].map(({ od, os, label }) => (
                  <Grid size={{ xs: 12 }} key={od}>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 'medium' }}>
                      {label}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid size={{ xs: 6 }}>
                        <Field name={od}>
                          {({ field }: FieldProps) => (
                            <TextField
                              {...field}
                              label="OD"
                              size="small"
                              fullWidth
                              value={field.value ?? ''}
                            />
                          )}
                        </Field>
                      </Grid>
                      <Grid size={{ xs: 6 }}>
                        <Field name={os}>
                          {({ field }: FieldProps) => (
                            <TextField
                              {...field}
                              label="OS"
                              size="small"
                              fullWidth
                              value={field.value ?? ''}
                            />
                          )}
                        </Field>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Paper>

            {/* === DIAGNOSIS & PLAN === */}
            <Paper sx={{ mb: 8, p: 2, borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <MedicalIcon color="primary" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Diagnosis & Plan
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Primary Diagnosis
                  </Typography>
                  <Field name="primary_diagnosis">
                    {({ field, form }: FieldProps) => (
                      <Box sx={{ mb: 2 }}>
                        <ReactQuill
                          theme="snow"
                          value={field.value || ''}
                          onChange={value => form.setFieldValue('primary_diagnosis', value)}
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ height: 120 }}
                          placeholder="Primary diagnosis..."
                        />
                      </Box>
                    )}
                  </Field>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Management Plan
                  </Typography>
                  <Field name="plan">
                    {({ field, form }: FieldProps) => (
                      <Box sx={{ mb: 2 }}>
                        <ReactQuill
                          theme="snow"
                          value={field.value || ''}
                          onChange={value => form.setFieldValue('plan', value)}
                          modules={quillModules}
                          formats={quillFormats}
                          style={{ height: 120 }}
                          placeholder="Management plan..."
                        />
                      </Box>
                    )}
                  </Field>
                </Grid>
              </Grid>
            </Paper>

            {/* === FLOATING SAVE BUTTON === */}
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
                  onClick={() => window.history.back()}
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
                  disabled={isSubmitting}
                  size="medium"
                  startIcon={
                    isSubmitting ? <CircularProgress size={16} /> : <SaveIcon fontSize="small" />
                  }
                  sx={{ minWidth: 150 }}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </Box>
            </Fade>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ExaminationForm;
