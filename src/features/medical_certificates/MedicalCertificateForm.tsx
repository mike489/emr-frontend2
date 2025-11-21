import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { MedicalCertificateService } from '../../shared/api/services/sickLeave.service';

// Form Data Type (patient_id is now optional in form state — we set it from props)
interface MedicalCertificateFormData {
  diagnosis: string;
  injury_description: string;
  recommendations: string;
  remarks: string;
  date_of_examination: string;
  rest_days: number;
  status: 'issued' | 'draft';
}

// Updated Props — patientId comes from parent!
interface MedicalCertificateFormProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  formData: MedicalCertificateFormData;
  patientId: string;           // ← NEW: from patient.id
  patientName: string;         // ← Optional: for display
  refreshList: () => void;
  selectedCertificate?: { id: string };
}

// Validation (no patient_id required here anymore)
const validationSchema = yup.object({
  diagnosis: yup
    .string()
    .test('not-empty', 'Diagnosis is required', (value) => {
      const stripped = value?.replace(/<[^>]*>/g, '').trim();
      return !!stripped;
    })
    .required(),
  date_of_examination: yup.string().required('Date of examination is required'),
  rest_days: yup.number().min(0).required('Rest days is required'),
  status: yup.string().oneOf(['issued', 'draft']).required(),
});

const MedicalCertificateForm: React.FC<MedicalCertificateFormProps> = ({
  open,
  onClose,
  editMode,
  formData,
  patientId,

  refreshList,
  selectedCertificate,
}) => {
  const formik = useFormik({
    initialValues: formData,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const payload = { ...values, patient_id: patientId }; // ← inject patient_id

        if (editMode && selectedCertificate?.id) {
          await MedicalCertificateService.update(selectedCertificate.id, payload);
          toast.success('Certificate updated successfully!');
        } else {
          await MedicalCertificateService.create(payload);
          toast.success('Certificate created successfully!');
        }

        refreshList();
        onClose();
        resetForm();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Operation failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        {editMode ? 'Edit Medical Certificate' : 'Issue Medical Certificate'}
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          {/* Patient Info Banner */}
          {/* <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle2">Patient</Typography>
            <Typography fontWeight={600}>{patientName}</Typography>
            <Typography variant="caption">ID: {patientId}</Typography>
          </Alert> */}

          <Grid container spacing={3}>
            {/* Diagnosis */}
            <Grid size={12}>
              <Typography variant="subtitle2" gutterBottom>
                Diagnosis <span style={{ color: 'red' }}>*</span>
              </Typography>
              <ReactQuill
                theme="snow"
                value={formik.values.diagnosis}
                onChange={(value) => formik.setFieldValue('diagnosis', value)}
                placeholder="Enter diagnosis..."
              />
              {formik.touched.diagnosis && formik.errors.diagnosis && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {formik.errors.diagnosis}
                </Typography>
              )}
            </Grid>

            {/* Other Rich Text Fields */}
            {['injury_description', 'recommendations', 'remarks'].map((field) => (
              <Grid size={12} key={field}>
                <Typography variant="subtitle2" gutterBottom>
                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Typography>
                <ReactQuill
                  theme="snow"
                  value={formik.values[field as keyof MedicalCertificateFormData] as string}
                  onChange={(value) => formik.setFieldValue(field, value)}
                />
              </Grid>
            ))}

            {/* Date & Rest Days */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Date of Examination *"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...formik.getFieldProps('date_of_examination')}
                error={formik.touched.date_of_examination && Boolean(formik.errors.date_of_examination)}
                helperText={formik.touched.date_of_examination && formik.errors.date_of_examination}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Rest Days *"
                type="number"
                fullWidth
                {...formik.getFieldProps('rest_days')}
                error={formik.touched.rest_days && Boolean(formik.errors.rest_days)}
                helperText={formik.touched.rest_days && formik.errors.rest_days}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Status *"
                fullWidth
                {...formik.getFieldProps('status')}
                error={formik.touched.status && Boolean(formik.errors.status)}
                helperText={formik.touched.status && formik.errors.status}
              >
                <MenuItem value="issued">Issued</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
            {formik.isSubmitting
              ? 'Saving...'
              : editMode
              ? 'Update Certificate'
              : 'Issue Certificate'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MedicalCertificateForm;