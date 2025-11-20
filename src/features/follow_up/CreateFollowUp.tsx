// src/components/followup/CreateFollowUp.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { FollowUpService } from '../../shared/api/services/followUp.services';

interface CreateFollowUpProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  patientId?: string;   // Optional: pre-select patient if opened from patient profile
  visitId?: string;
}

interface FollowUpFormData {
  patient_id: string;
  od_s_correction: string;
  od_c_correction: string;
  od_iop: number | string;
  od_cct: string;
  os_s_correction: string;
  os_c_correction: string;
  os_iop: number | string;
  os_cct: string;
  examination_findings: string;
  plan: string;
  remark: string;
  diagnosis: string;
}

const CreateFollowUp: React.FC<CreateFollowUpProps> = ({
  open,
  onClose,
  onSuccess,
  patientId,
  visitId,


}) => {
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState<FollowUpFormData>({
  patient_id: patientId || '',
  od_s_correction: '',
  od_c_correction: '',
  od_iop: '',
  od_cct: '',
  os_s_correction: '',
  os_c_correction: '',
  os_iop: '',
  os_cct: '',
  examination_findings: '',
  plan: '',
  remark: '',
  diagnosis: '',
});


  // React Quill toolbar config
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link'],
      ['clean'],
    ],
  };

  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'link',
  ];

  // Fetch patients when dialog opens

  const handleInputChange = (field: keyof FollowUpFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleRichTextChange = (field: keyof FollowUpFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.patient_id) {
      toast.error('Please select a patient');
      return;
    }
    if (!formData.examination_findings || !formData.plan || !formData.diagnosis) {
      toast.error('Examination findings, Plan, and Diagnosis are required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        od_iop: formData.od_iop ? Number(formData.od_iop) : null,
        os_iop: formData.os_iop ? Number(formData.os_iop) : null,
        visit_id: visitId || null,
      };

      await FollowUpService.create(payload);
      toast.success('Follow-up note created successfully');
      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error('Create follow-up error:', err);
      toast.error(err.response?.data?.message || 'Failed to create follow-up note');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      patient_id: '',
      od_s_correction: '',
      od_c_correction: '',
      od_iop: '',
      od_cct: '',
      os_s_correction: '',
      os_c_correction: '',
      os_iop: '',
      os_cct: '',
      examination_findings: '',
      plan: '',
      remark: '',
      diagnosis: '',
    });
   
    onClose();
  };
  React.useEffect(() => {
  if (open && patientId) {
    setFormData(prev => ({
      ...prev,
      patient_id: patientId,
    }));
  }
}, [open, patientId]);


  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Create Follow-up Note
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ pt: 1 }}>
          {/* OD (Right Eye) */}
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid size={12}>
              <Typography variant="h6" color="primary.main">
                OD (Right Eye)
              </Typography>
            </Grid>

            <Grid size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="S Correction"
                value={formData.od_s_correction}
                onChange={handleInputChange('od_s_correction')}
                placeholder="-2.50"
              />
            </Grid>
            <Grid size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="C Correction"
                value={formData.od_c_correction}
                onChange={handleInputChange('od_c_correction')}
                placeholder="1.25"
              />
            </Grid>
            <Grid size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                type="number"
                label="IOP (mmHg)"
                value={formData.od_iop}
                onChange={handleInputChange('od_iop')}
                placeholder="18"
              />
            </Grid>
            <Grid size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="CCT (µm)"
                value={formData.od_cct}
                onChange={handleInputChange('od_cct')}
                placeholder="550"
              />
            </Grid>
          </Grid>

          {/* OS (Left Eye) */}
          <Grid container spacing={3} sx={{ mt: 3 }}>
            <Grid size={12}>
              <Typography variant="h6" color="primary.main">
                OS (Left Eye)
              </Typography>
            </Grid>

            <Grid size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="S Correction"
                value={formData.os_s_correction}
                onChange={handleInputChange('os_s_correction')}
                placeholder="-2.00"
              />
            </Grid>
            <Grid size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="C Correction"
                value={formData.os_c_correction}
                onChange={handleInputChange('os_c_correction')}
                placeholder="1.00"
              />
            </Grid>
            <Grid size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                type="number"
                label="IOP (mmHg)"
                value={formData.os_iop}
                onChange={handleInputChange('os_iop')}
                placeholder="17"
              />
            </Grid>
            <Grid size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="CCT (µm)"
                value={formData.os_cct}
                onChange={handleInputChange('os_cct')}
                placeholder="545"
              />
            </Grid>
          </Grid>

          {/* Rich Text Sections */}
          <Grid container spacing={3} sx={{ mt: 4, height:'100%' }}>
            <Grid size={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Examination Findings *
              </Typography>
              <ReactQuill
                value={formData.examination_findings}
                onChange={handleRichTextChange('examination_findings')}
                modules={quillModules}
                formats={quillFormats}
                style={{ height: '160px', marginBottom: '50px' }}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Diagnosis *
              </Typography>
              <ReactQuill
                value={formData.diagnosis}
                onChange={handleRichTextChange('diagnosis')}
                modules={quillModules}
                formats={quillFormats}
                style={{ height: '120px', marginBottom: '50px' }}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Plan *
              </Typography>
              <ReactQuill
                value={formData.plan}
                onChange={handleRichTextChange('plan')}
                modules={quillModules}
                formats={quillFormats}
                style={{ height: '120px', marginBottom: '50px' }}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Remark
              </Typography>
              <ReactQuill
                value={formData.remark}
                onChange={handleRichTextChange('remark')}
                modules={quillModules}
                formats={quillFormats}
                style={{ height: '120px', marginBottom: '30px' }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !formData.patient_id}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Creating...' : 'Create Follow-up'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFollowUp;