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
  Box,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as yup from 'yup';
import ReactQuill from 'react-quill-new';
import 'react-quill/dist/quill.snow.css';
import { MedicalCertificateService } from '../../shared/api/services/sickLeave.service';

// Types
interface Patient {
  id: string;
  full_name: string;
}

interface MedicalCertificateFormData {
  patient_id: string;
  diagnosis: string;
  injury_description: string;
  recommendations: string;
  remarks: string;
  date_of_examination: string;
  rest_days: number;
  status: 'issued' | 'draft';
}

interface MedicalCertificateFormProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  formData: MedicalCertificateFormData;
  setFormData: (data: MedicalCertificateFormData) => void;
  patients: Patient[];
  refreshList: () => void;
  selectedCertificate?: { id: string };
}

// Validation Schema
const validationSchema = yup.object({
  patient_id: yup.string().required('Patient is required'),
  diagnosis: yup.string().required('Diagnosis is required'),
  injury_description: yup.string(),
  recommendations: yup.string(),
  remarks: yup.string(),
  date_of_examination: yup.string().required('Date of examination is required'),
  rest_days: yup.number().min(0, 'Rest days must be 0 or more').required('Rest days is required'),
  status: yup.string().oneOf(['issued', 'draft']).required('Status is required'),
});

const MedicalCertificateForm: React.FC<MedicalCertificateFormProps> = ({
  open,
  onClose,
  editMode,
  formData,
  setFormData,
  patients,
  refreshList,
  selectedCertificate,
}) => {
  const formik = useFormik({
    initialValues: formData,
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (editMode && selectedCertificate) {
          await MedicalCertificateService.update(selectedCertificate.id, values);
          toast.success('Certificate updated successfully!');
        } else {
          await MedicalCertificateService.create(values);
          toast.success('Certificate added successfully!');
        }
        refreshList();
        onClose();
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Operation failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleFieldChange = (field: keyof MedicalCertificateFormData, value: any) => {
    formik.setFieldValue(field, value);
    setFormData({ ...formData, [field]: value });
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>
        {editMode ? 'Edit Certificate' : 'Add Certificate'}
      </DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{xs:12, sm:6}}>
              <TextField
                select
                label="Patient *"
                name="patient_id"
                value={formik.values.patient_id}
                fullWidth
                onChange={(e) => handleFieldChange('patient_id', e.target.value)}
                error={formik.touched.patient_id && Boolean(formik.errors.patient_id)}
                helperText={formik.touched.patient_id && formik.errors.patient_id}
              >
                {patients.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.full_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{xs:12}}>
              <Box sx={{ mb: 1 }}>
                <label>
                  <strong>Diagnosis *</strong>
                </label>
              </Box>
              <ReactQuill
                theme="snow"
                value={formik.values.diagnosis}
                onChange={(value) => handleFieldChange('diagnosis', value)}
              />
              {formik.touched.diagnosis && formik.errors.diagnosis && (
                <Box sx={{ color: 'error.main', fontSize: '0.75rem', mt: 1 }}>
                  {formik.errors.diagnosis}
                </Box>
              )}
            </Grid>

            <Grid size={{xs:12}}>
              <Box sx={{ mb: 1 }}>
                <label>
                  <strong>Injury Description</strong>
                </label>
              </Box>
              <ReactQuill
                theme="snow"
                value={formik.values.injury_description}
                onChange={(value) => handleFieldChange('injury_description', value)}
              />
            </Grid>

            <Grid size={{xs:12}}>
              <Box sx={{ mb: 1 }}>
                <label>
                  <strong>Recommendations</strong>
                </label>
              </Box>
              <ReactQuill
                theme="snow"
                value={formik.values.recommendations}
                onChange={(value) => handleFieldChange('recommendations', value)}
              />
            </Grid>

            <Grid size={{xs:12}}>
              <Box sx={{ mb: 1 }}>
                <label>
                  <strong>Remarks</strong>
                </label>
              </Box>
              <ReactQuill
                theme="snow"
                value={formik.values.remarks}
                onChange={(value) => handleFieldChange('remarks', value)}
              />
            </Grid>

            <Grid size={{xs:12, sm:6}} >
              <TextField
                label="Date of Examination *"
                name="date_of_examination"
                type="date"
                fullWidth
                value={formik.values.date_of_examination}
                InputLabelProps={{ shrink: true }}
                onChange={formik.handleChange}
                error={formik.touched.date_of_examination && Boolean(formik.errors.date_of_examination)}
                helperText={formik.touched.date_of_examination && formik.errors.date_of_examination}
              />
            </Grid>

            <Grid size={{xs:12}} >
              <TextField
                label="Rest Days *"
                name="rest_days"
                type="number"
                fullWidth
                value={formik.values.rest_days}
                onChange={formik.handleChange}
                error={formik.touched.rest_days && Boolean(formik.errors.rest_days)}
                helperText={formik.touched.rest_days && formik.errors.rest_days}
              />
            </Grid>

            <Grid size={{xs:12, sm:3}} >
              <TextField
                select
                label="Status *"
                name="status"
                fullWidth
                value={formik.values.status}
                onChange={formik.handleChange}
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
          <Button type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Submitting...' : (editMode ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MedicalCertificateForm;