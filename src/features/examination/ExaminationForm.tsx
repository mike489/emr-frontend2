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
  Card,
  CardContent,
  Paper,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
} from '@mui/material';
import { 
  Add as AddIcon, 
  ExpandMore as ExpandMoreIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  MedicalInformation as MedicalIcon,
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  Psychology as PsychologyIcon,
  Straighten as StraightenIcon,
  Biotech as BiotechIcon,
} from '@mui/icons-material';
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
  // complaint_details: '',
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
  const [expandedSection, setExpandedSection] = useState<string | false>('vital-signs');

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

        const normalized = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
        ) as unknown  as ExaminationData;

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
      toast.error(err?.response?.data?.message || 'Failed to save examination');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSectionChange = (section: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedSection(isExpanded ? section : false);
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
      {({ values, isSubmitting, touched, errors }) => (
        <Form>
          <Box sx={{ 
            p: { xs: 2, md: 4 }, 
            maxWidth: 1400, 
            mx: 'auto', 
            // pb: 15,
            backgroundColor: 'grey.50',
            minHeight: '100vh'
          }}>
            
            {/* Header Section */}
            <Card sx={{ mb: 4, backgroundColor: 'primary.main', color: 'white' }}>
              <CardContent sx={{ py: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MedicalIcon />
                  <Box>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                      {initialValues.primary_complaint ? 'Edit Examination' : 'New Examination Record'}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Comprehensive Ophthalmic Assessment
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* === VITAL SIGNS === */}
            <Accordion 
              expanded={expandedSection === 'vital-signs'} 
              onChange={handleSectionChange('vital-signs')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FavoriteIcon color="error" />
                  <Typography variant="h6">Vital Signs</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {[
                    { name: 'heart_rate', label: 'Heart Rate (bpm)' },
                    { name: 'temperature', label: 'Temperature (°C)' },
                    { name: 'respiratory_rate', label: 'Respiratory Rate (breaths/min)' },
                    { name: 'oxygen_saturation', label: 'O2 Saturation (%)' },
                    { name: 'blood_pressure', label: 'Blood Pressure (e.g. 120/80)' },
                    { name: 'time_of_measurement', label: 'Time of Measurement' },

                  ].map(({ name, label }) => (
                    <Grid size={{ xs: 12, sm: 6,  }} key={name}>
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
              </AccordionDetails>
            </Accordion>

            {/* === PATIENT HISTORY === */}
            <Accordion 
              expanded={expandedSection === 'patient-history'} 
              onChange={handleSectionChange('patient-history')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PsychologyIcon color="primary" />
                  <Typography variant="h6">Patient History</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={3}>
                  {/* <Grid size={{ xs: 12, md: 6 }}>
                    <Field name="primary_complaint">
                      {({ field }: FieldProps) => (
                        <TextField
                          {...field}
                          label="Primary Complaint"
                          fullWidth
                          size="small"
                          margin="dense"
                          error={getIn(touched, 'primary_complaint') && !!getIn(errors, 'primary_complaint')}
                          helperText={<ErrorMessage name="primary_complaint" />}
                        />
                      )}
                    </Field>
                  </Grid> */}

                  {/* Complaint Details - Rich Text Editor */}
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
                      Complaint 
                    </Typography>
                    <Field name="complaint_details">
                      {({ field, form }: FieldProps) => (
                        <Paper elevation={1} sx={{ borderRadius: 1, overflow: 'hidden' }}>
                          <ReactQuill
                            theme="snow"
                            value={field.value || ''}
                            onChange={(value) => form.setFieldValue('complaint_details', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ 
                              height: 200, 
                              border: 'none'
                            }}
                            placeholder="Provide detailed information about the complaint, including duration, severity, associated symptoms, and any relevant history..."
                          />
                          {getIn(form.touched, 'complaint_details') && getIn(form.errors, 'complaint_details') && (
                            <Typography color="error" variant="caption" sx={{ ml: 2, mt: 0.5, display: 'block' }}>
                              {getIn(form.errors, 'complaint_details')}
                            </Typography>
                          )}
                        </Paper>
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

                {/* Dynamic Multi-input Fields */}
             <Grid container spacing={3}>
  {(['systemic_conditions', 'allergies', 'family_history'] as const).map((field) => {
    const label = field
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return (
      <Grid size={{ xs: 12, md: 4 }} key={field}>
        <Typography variant="subtitle1" gutterBottom fontWeight="bold">
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
              <Grid container spacing={1}>
                {/* Input + Add Button */}
                <Grid size={{ xs: 9, md: 10 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder={`Add ${label.toLowerCase()}...`}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    inputProps={{ maxLength: 100 }}
                  />
                </Grid>

                <Grid size={{ xs: 3, md: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    onClick={handleAdd}
                    disabled={!inputValue.trim()}
                    sx={{ height: '40px' }}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                </Grid>

                {/* Chips */}
                <Grid size={{ xs: 12 }}>
                  {items.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No {label.toLowerCase()} added.
                    </Typography>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {items.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          onDelete={() => handleRemove(index)}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </Grid>

                {/* Error */}
                <Grid size={{ xs: 12 }}>
                  {getIn(form.touched, field) && getIn(form.errors, field) && (
                    <Typography color="error" variant="caption">
                      {getIn(form.errors, field)}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            );
          }}
        </Field>
      </Grid>
    );
  })}
</Grid>

              </AccordionDetails>
            </Accordion>

            {/* === VISUAL ACUITY === */}
            <Accordion 
              expanded={expandedSection === 'visual-acuity'} 
              onChange={handleSectionChange('visual-acuity')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <VisibilityIcon color="primary" />
                  <Typography variant="h6">Visual Acuity</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  {['distance', 'near'].map((dist) => (
                    <Grid size={{ xs: 12 }} key={dist}>
                      <Typography variant="subtitle2" sx={{ textTransform: 'capitalize', mb: 2 }}>
                        {dist} Vision
                      </Typography>
                      <Grid container spacing={1}>
                        {['od', 'os'].map((eye) =>
                          ['ucva', 'scva', 'bcva'].map((type) => {
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
              </AccordionDetails>
            </Accordion>

            {/* === PUPIL & MOTILITY === */}
            <Accordion 
              expanded={expandedSection === 'pupil-motility'} 
              onChange={handleSectionChange('pupil-motility')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <StraightenIcon color="primary" />
                  <Typography variant="h6">Pupil & Ocular Motility</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {['od', 'os'].map((eye) =>
                    ['ucva', 'scva', 'bcva'].map((type) => {
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
                            {EOM_OPTIONS.map((opt) => (
                              <MenuItem key={opt} value={opt}>
                                {opt}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                  </Grid>
                  {['eom_gaze', 'eom_eye'].map((name) => (
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
              </AccordionDetails>
            </Accordion>

            {/* === ALIGNMENT TESTS === */}
            <Accordion 
              expanded={expandedSection === 'alignment-tests'} 
              onChange={handleSectionChange('alignment-tests')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BiotechIcon color="primary" />
                  <Typography variant="h6">Alignment Tests</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
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
                  ].map((name) => (
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
              </AccordionDetails>
            </Accordion>

            {/* === STEREOPSIS === */}
            <Accordion 
              expanded={expandedSection === 'stereopsis'} 
              onChange={handleSectionChange('stereopsis')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <VisibilityIcon color="primary" />
                  <Typography variant="h6">Stereopsis</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
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
                          error={getIn(touched, 'stereopsis_test') && !!getIn(errors, 'stereopsis_test')}
                          helperText={<ErrorMessage name="stereopsis_test" />}
                        />
                      )}
                    </Field>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* === IOP === */}
            <Accordion 
              expanded={expandedSection === 'iop'} 
              onChange={handleSectionChange('iop')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BiotechIcon color="primary" />
                  <Typography variant="h6">Intraocular Pressure</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
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

                  {['left_eye', 'right_eye'].map((name) => (
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
              </AccordionDetails>
            </Accordion>

            {/* === ANTERIOR SEGMENT === */}
            <Accordion 
              expanded={expandedSection === 'anterior-segment'} 
              onChange={handleSectionChange('anterior-segment')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <VisibilityIcon color="primary" />
                  <Typography variant="h6">Anterior Segment</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
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
                ].map((part) => (
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
              </AccordionDetails>
            </Accordion>

            {/* === DILATION === */}
            <Accordion 
              expanded={expandedSection === 'dilation'} 
              onChange={handleSectionChange('dilation')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MedicalIcon color="primary" />
                  <Typography variant="h6">Dilation</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Field name="dilated">
                      {({ field }: FieldProps) => (
                        <FormControl fullWidth size="small">
                          <InputLabel>Dilated</InputLabel>
                          <Select {...field} label="Dilated" value={field.value ?? ''}>
                            {DILATED_OPTIONS.map((opt) => (
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
                          error={getIn(touched, 'dilation_drops_used') && !!getIn(errors, 'dilation_drops_used')}
                          helperText={<ErrorMessage name="dilation_drops_used" />}
                        />
                      )}
                    </Field>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* === POSTERIOR SEGMENT === */}
            <Accordion 
              expanded={expandedSection === 'posterior-segment'} 
              onChange={handleSectionChange('posterior-segment')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <VisibilityIcon color="primary" />
                  <Typography variant="h6">Posterior Segment</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                {['optic_disc', 'macula', 'vessels', 'periphery'].map((part) => (
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
              </AccordionDetails>
            </Accordion>

            {/* === DIAGNOSIS & PLAN === */}
            <Accordion 
              expanded={expandedSection === 'diagnosis-plan'} 
              onChange={handleSectionChange('diagnosis-plan')}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <MedicalIcon color="primary" />
                  <Typography variant="h6">Diagnosis & Management</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Primary Diagnosis
                    </Typography>
                    <Field name="primary_diagnosis">
                      {({ field, form }: FieldProps) => (
                        <div>
                          <ReactQuill
                            theme="snow"
                            value={field.value || ''}
                            onChange={(value) => form.setFieldValue('primary_diagnosis', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ height: 180, marginBottom: 50 }}
                            placeholder="Enter primary diagnosis..."
                          />
                          {getIn(form.touched, 'primary_diagnosis') && getIn(form.errors, 'primary_diagnosis') && (
                            <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                              {getIn(form.errors, 'primary_diagnosis')}
                            </Typography>
                          )}
                        </div>
                      )}
                    </Field>
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      Management Plan
                    </Typography>
                    <Field name="plan">
                      {({ field, form }: FieldProps) => (
                        <div>
                          <ReactQuill
                            theme="snow"
                            value={field.value || ''}
                            onChange={(value) => form.setFieldValue('plan', value)}
                            modules={quillModules}
                            formats={quillFormats}
                            style={{ height: 180, marginBottom: 50 }}
                            placeholder="Enter detailed management plan..."
                          />
                          {getIn(form.touched, 'plan') && getIn(form.errors, 'plan') && (
                            <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                              {getIn(form.errors, 'plan')}
                            </Typography>
                          )}
                        </div>
                      )}
                    </Field>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* === FLOATING SAVE BUTTON === */}
            <Fade in={true}>
              <Box
                sx={{
                  position: 'fixed',
                  bottom: 24,
                  right: 24,
                  zIndex: 1300,
                  display: 'flex',
                  gap: 2,
                  bgcolor: 'background.paper',
                  p: 2,
                  borderRadius: 2,
                  boxShadow: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => window.history.back()}
                  disabled={isSubmitting}
                  size="large"
                  startIcon={<CancelIcon />}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  size="large"
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{ minWidth: 200 }}
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