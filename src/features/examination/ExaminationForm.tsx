import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Formik, Form, Field, ErrorMessage, type FieldProps, getIn } from 'formik';
import { toast } from 'react-toastify';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { validationSchema } from './validationSchema';
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
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
        ['clean'],
      ],
    }),
    []
  );

  const quillFormats = ['header', 'bold', 'italic', 'underline', 'list', 'bullet', 'link'];

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

        // Normalize data: convert empty strings to null
        const normalized = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
        ) as any as ExaminationData;

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

      // Flatten vitals
      heart_rate: values.heart_rate || null,
      temperature: values.temperature || null,
      respiratory_rate: values.respiratory_rate || null,
      oxygen_saturation: values.oxygen_saturation || null,
      blood_pressure: values.blood_pressure || null,

      // Format times
      time_of_measurement: formatTime(values.time_of_measurement),
      dilation_time: values.dilated === 'Yes' ? formatTime(values.dilation_time) : null,

      // IOP method
      methods: values.methods?.value
        ? { value: values.methods.value, other: values.methods.other || null }
        : null,
    };

    const payload = {
      consultation_id: consultationId,
      examination_data,
    };

    try {
      await PatientService.createExamination(payload);
      toast.success('Examination saved successfully!');
    } catch (err: any) {
      console.error('API Error:', err.response?.data);
      toast.error(err?.response?.data?.message || 'Failed to save examination');
    } finally {
      setSubmitting(false);
    }
  };

  // === LOADING STATE ===
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={1000} p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting, touched, errors }) => (
        <Form>
          <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            <Typography variant="h5" gutterBottom color="primary">
              {initialValues.primary_complaint ? 'Edit Examination' : 'New Examination Record'}
            </Typography>
            {/* === SUBMIT === */}
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Examination'}
              </Button>
            </Box>
            {/* === VITAL SIGNS === */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Vital Signs
            </Typography>
            <Grid container spacing={2}>
              {[
                { name: 'heart_rate', label: 'Heart Rate (bpm)' },
                { name: 'temperature', label: 'Temperature (°C)' },
                { name: 'respiratory_rate', label: 'Respiratory Rate (breaths/min)' },
                { name: 'oxygen_saturation', label: 'O2 Saturation (%)' },
                { name: 'blood_pressure', label: 'Blood Pressure (e.g. 120/80)' },
              ].map(({ name, label }) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={name}>
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

            {/* === TIME OF MEASUREMENT === */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Field name="time_of_measurement">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Time of Measurement"
                      placeholder="14:30"
                      size="small"
                      fullWidth
                      value={field.value ?? ''}
                      error={
                        getIn(touched, 'time_of_measurement') &&
                        !!getIn(errors, 'time_of_measurement')
                      }
                      helperText={<ErrorMessage name="time_of_measurement" />}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>

            {/* === PATIENT HISTORY === */}
            <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
              Patient History
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field name="primary_complaint">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Primary Complaint"
                      fullWidth
                      size="small"
                      margin="dense"
                      error={
                        getIn(touched, 'primary_complaint') && !!getIn(errors, 'primary_complaint')
                      }
                      helperText={<ErrorMessage name="primary_complaint" />}
                    />
                  )}
                </Field>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Field name="current_oscular_medication">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Current Ocular Medication"
                      fullWidth
                      size="small"
                      margin="dense"
                    />
                  )}
                </Field>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Field name="current_contact_lense_use">
                  {({ field }: FieldProps) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Current Contact Lens Use"
                    />
                  )}
                </Field>
              </Grid>

              {values.current_contact_lense_use && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Field name="lens_type">
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label="Lens Type"
                        fullWidth
                        size="small"
                        margin="dense"
                        error={getIn(touched, 'lens_type') && !!getIn(errors, 'lens_type')}
                        helperText={<ErrorMessage name="lens_type" />}
                      />
                    )}
                  </Field>
                </Grid>
              )}

              <Grid size={{ xs: 12, md: 6 }}>
                <Field name="current_systemic_medication">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Current Systemic Medication"
                      fullWidth
                      size="small"
                      margin="dense"
                    />
                  )}
                </Field>
              </Grid>
            </Grid>

            {/* === ARRAY FIELDS === */}
            {(['family_history', 'systemic_conditions', 'allergies'] as const).map(field => (
              <FormControl key={field} fullWidth sx={{ mt: 2 }}>
                <InputLabel>{field.replace(/_/g, ' ').toUpperCase()}</InputLabel>
                <Field name={field}>
                  {({ field: formikField }: FieldProps) => (
                    <Select
                      {...formikField}
                      multiple
                      value={formikField.value || []}
                      renderValue={(selected: any) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((v: string) => (
                            <Chip key={v} label={v} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {field === 'family_history' &&
                        ['Glaucoma', 'Cataract', 'Macular Degeneration', 'Retinal Detachment'].map(
                          o => (
                            <MenuItem key={o} value={o}>
                              {o}
                            </MenuItem>
                          )
                        )}
                      {field === 'systemic_conditions' &&
                        ['Hypertension', 'Diabetes', 'Thyroid', 'Arthritis'].map(o => (
                          <MenuItem key={o} value={o}>
                            {o}
                          </MenuItem>
                        ))}
                      {field === 'allergies' &&
                        ['Penicillin', 'Sulfa', 'Latex', 'Dust', 'Pollen'].map(o => (
                          <MenuItem key={o} value={o}>
                            {o}
                          </MenuItem>
                        ))}
                    </Select>
                  )}
                </Field>
              </FormControl>
            ))}

            {/* === VISUAL ACUITY === */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Visual Acuity
            </Typography>
            <Grid container spacing={1}>
              {['distance', 'near'].map(dist => (
                <Grid size={{ xs: 12 }} key={dist}>
                  <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
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
                                  helperText={<ErrorMessage name={name} />}
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

            {/* === PUPIL & MOTILITY === */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Pupil & Ocular Motility
            </Typography>
            <Grid container spacing={2}>
              {['od', 'os'].map(eye =>
                ['ucva', 'scva', 'bcva'].map(type => {
                  const name = `pupil_reaction_${eye}_${type}`;
                  return (
                    <Grid size={{ xs: 12, sm: 4 }} key={name}>
                      <Field name={name}>
                        {({ field }: FieldProps) => (
                          <TextField
                            {...field}
                            label={`Pupil ${eye.toUpperCase()} ${type.toUpperCase()}`}
                            size="small"
                            fullWidth
                            value={field.value ?? ''}
                            error={getIn(touched, name) && !!getIn(errors, name)}
                            helperText={<ErrorMessage name={name} />}
                          />
                        )}
                      </Field>
                    </Grid>
                  );
                })
              )}
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
                        label={name.replace(/_/g, ' ').toUpperCase()}
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

            {/* === ALIGNMENT TESTS === */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Alignment Tests
            </Typography>
            <Grid container spacing={2}>
              {[
                'hirschberg_test',
                'hirschberg_test_eye',
                'hirschberg_test_deviation',
                'cover_uncover_test',
                'cover_uncover_test_phoria',
                'cover_uncover_test_tropia',
                'cover_uncover_test_direction',
                'cover_uncover_test_distance',
                'cover_uncover_test_near',
              ].map(name => (
                <Grid size={{ xs: 12, sm: 4 }} key={name}>
                  <Field name={name}>
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label={name.replace(/_/g, ' ').toUpperCase()}
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

            {/* === STEREOPSIS === */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Stereopsis
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field name="stereopsis">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Stereopsis"
                      size="small"
                      fullWidth
                      value={field.value ?? ''}
                      error={getIn(touched, 'stereopsis') && !!getIn(errors, 'stereopsis')}
                      helperText={<ErrorMessage name="stereopsis" />}
                    />
                  )}
                </Field>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Field name="stereopsis_test">
                  {({ field }: FieldProps) => (
                    <TextField
                      {...field}
                      label="Test Used"
                      size="small"
                      fullWidth
                      value={field.value ?? ''}
                      error={
                        getIn(touched, 'stereopsis_test') && !!getIn(errors, 'stereopsis_test')
                      }
                      helperText={<ErrorMessage name="stereopsis_test" />}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>

            {/* === IOP === */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Intraocular Pressure
            </Typography>
            <Grid container spacing={2} alignItems="center">
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
                        error={getIn(touched, 'methods.other') && !!getIn(errors, 'methods.other')}
                        helperText={<ErrorMessage name="methods.other" />}
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
                        label={name === 'left_eye' ? 'Left Eye (mmHg)' : 'Right Eye (mmHg)'}
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

            {/* === ANTERIOR SEGMENT === */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Anterior Segment
            </Typography>
            {[
              'lids',
              'lashes',
              'conjunctiva',
              'sclera',
              'lacrimal_system',
              'cornea',
              'anterior_chamber',
              'iris',
              'lens',
              'vitreous',
            ].map(part => (
              <Grid container spacing={2} key={part} sx={{ mt: 1 }}>
                <Grid size={{ xs: 6 }}>
                  <Field name={`${part}_od`}>
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label={`${part.replace(/_/g, ' ')} OD`.toUpperCase()}
                        size="small"
                        fullWidth
                        value={field.value ?? ''}
                        error={getIn(touched, `${part}_od`) && !!getIn(errors, `${part}_od`)}
                        helperText={<ErrorMessage name={`${part}_od`} />}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Field name={`${part}_os`}>
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label={`${part.replace(/_/g, ' ')} OS`.toUpperCase()}
                        size="small"
                        fullWidth
                        value={field.value ?? ''}
                        error={getIn(touched, `${part}_os`) && !!getIn(errors, `${part}_os`)}
                        helperText={<ErrorMessage name={`${part}_os`} />}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
            ))}

            {/* === DILATION === */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Dilation
            </Typography>
            <Grid container spacing={2}>
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
                        label="Dilation Time"
                        placeholder="15:00"
                        size="small"
                        fullWidth
                        value={field.value ?? ''}
                        error={getIn(touched, 'dilation_time') && !!getIn(errors, 'dilation_time')}
                        helperText={<ErrorMessage name="dilation_time" />}
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
                      error={
                        getIn(touched, 'dilation_drops_used') &&
                        !!getIn(errors, 'dilation_drops_used')
                      }
                      helperText={<ErrorMessage name="dilation_drops_used" />}
                    />
                  )}
                </Field>
              </Grid>
            </Grid>

            {/* === POSTERIOR SEGMENT === */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Posterior Segment
            </Typography>
            {['optic_disc', 'macula', 'vessels', 'periphery'].map(part => (
              <Grid container spacing={2} key={part} sx={{ mt: 1 }}>
                <Grid size={{ xs: 6 }}>
                  <Field name={`${part}_od`}>
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label={`${part.replace(/_/g, ' ')} OD`.toUpperCase()}
                        size="small"
                        fullWidth
                        value={field.value ?? ''}
                        error={getIn(touched, `${part}_od`) && !!getIn(errors, `${part}_od`)}
                        helperText={<ErrorMessage name={`${part}_od`} />}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Field name={`${part}_os`}>
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label={`${part.replace(/_/g, ' ')} OS`.toUpperCase()}
                        size="small"
                        fullWidth
                        value={field.value ?? ''}
                        error={getIn(touched, `${part}_os`) && !!getIn(errors, `${part}_os`)}
                        helperText={<ErrorMessage name={`${part}_os`} />}
                      />
                    )}
                  </Field>
                </Grid>
              </Grid>
            ))}

            {/* === DIAGNOSIS & PLAN === */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Diagnosis & Management
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Primary Diagnosis
                </Typography>
                <Field name="primary_diagnosis">
                  {({ field }: FieldProps) => (
                    <div>
                      <ReactQuill
                        theme="snow"
                        value={field.value || ''}
                        onChange={v => setFieldValue('primary_diagnosis', v)}
                        modules={quillModules}
                        formats={quillFormats}
                        style={{ height: 180, marginBottom: 50 }}
                        placeholder="Enter primary diagnosis..."
                      />
                      {getIn(touched, 'primary_diagnosis') &&
                        getIn(errors, 'primary_diagnosis') && (
                          <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                            {getIn(errors, 'primary_diagnosis')}
                          </Typography>
                        )}
                    </div>
                  )}
                </Field>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Management Plan
                </Typography>
                <Field name="plan">
                  {({ field }: FieldProps) => (
                    <div>
                      <ReactQuill
                        theme="snow"
                        value={field.value || ''}
                        onChange={v => setFieldValue('plan', v)}
                        modules={quillModules}
                        formats={quillFormats}
                        style={{ height: 180, marginBottom: 50 }}
                        placeholder="Enter detailed management plan..."
                      />
                      {getIn(touched, 'plan') && getIn(errors, 'plan') && (
                        <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                          {getIn(errors, 'plan')}
                        </Typography>
                      )}
                    </div>
                  )}
                </Field>
              </Grid>
            </Grid>

            {/* === SUBMIT === */}
            <Box sx={{ mt: 6, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => window.history.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Box sx={{position:'relative'}}>
              <Button type="submit" variant="contained" color="primary"  disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Examination'}
              </Button>
              </Box>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ExaminationForm;
