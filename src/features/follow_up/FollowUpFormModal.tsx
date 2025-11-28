import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Divider,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { toast } from 'react-toastify';
import { FollowUpService } from '../../shared/api/services/followUp.service';

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

interface CreateFollowUpModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  visitId?: string;
  patientName?: string;
  onSuccess?: () => void;
}

const CreateFollowUpModal: React.FC<CreateFollowUpModalProps> = ({
  open,
  onClose,
  patientId,
  visitId,
  patientName,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FollowUpFormData>({
    patient_id: patientId,
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

  useEffect(() => {
    if (patientId && open) {
      setFormData(prev => ({ ...prev, patient_id: patientId }));
    }
  }, [patientId, open]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setFormData({
        patient_id: patientId,
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
    }
  }, [open, patientId]);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const handleInputChange =
    (field: keyof FollowUpFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleRichTextChange = (field: keyof FollowUpFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.patient_id) {
      toast.error('Patient ID is required');
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
      toast.success('Follow-up note created successfully!');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error('Error creating follow-up:', err);
      toast.error(err.response?.data?.message || 'Failed to create follow-up');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    formData.examination_findings?.trim() && formData.diagnosis?.trim() && formData.plan?.trim();

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          height: '95vh',
          maxHeight: '1200px',
        },
      }}
    >
      {/* Header */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Create Follow-up Note
              </Typography>
              {patientName && (
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Patient: {patientName}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton edge="end" color="inherit" onClick={onClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: { xs: 2, md: 4 }, maxHeight: 'calc(95vh - 140px)', overflow: 'auto' }}>
          <Paper elevation={0} sx={{ borderRadius: 2 }}>
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {/* OD Section */}
              <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 1 }}>
                OD (Right Eye)
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Spherical Correction (S)"
                    value={formData.od_s_correction}
                    onChange={handleInputChange('od_s_correction')}
                    placeholder="-2.50"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Cylindrical Correction (C)"
                    value={formData.od_c_correction}
                    onChange={handleInputChange('od_c_correction')}
                    placeholder="1.25"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="IOP (mmHg)"
                    value={formData.od_iop}
                    onChange={handleInputChange('od_iop')}
                    placeholder="18"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="CCT (µm)"
                    value={formData.od_cct}
                    onChange={handleInputChange('od_cct')}
                    placeholder="550"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* OS Section */}
              <Typography variant="h6" color="secondary" gutterBottom>
                OS (Left Eye)
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Spherical Correction (S)"
                    value={formData.os_s_correction}
                    onChange={handleInputChange('os_s_correction')}
                    placeholder="-2.00"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Cylindrical Correction (C)"
                    value={formData.os_c_correction}
                    onChange={handleInputChange('os_c_correction')}
                    placeholder="1.00"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="IOP (mmHg)"
                    value={formData.os_iop}
                    onChange={handleInputChange('os_iop')}
                    placeholder="17"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="CCT (µm)"
                    value={formData.os_cct}
                    onChange={handleInputChange('os_cct')}
                    placeholder="545"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* Rich Text Sections */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Examination Findings *
                  </Typography>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <ReactQuill
                      value={formData.examination_findings}
                      onChange={handleRichTextChange('examination_findings')}
                      modules={quillModules}
                      style={{ height: '150px', border: 'none' }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }} mt={5}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Diagnosis *
                  </Typography>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <ReactQuill
                      value={formData.diagnosis}
                      onChange={handleRichTextChange('diagnosis')}
                      modules={quillModules}
                      style={{ height: '120px', border: 'none' }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }} mt={5}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Plan *
                  </Typography>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <ReactQuill
                      value={formData.plan}
                      onChange={handleRichTextChange('plan')}
                      modules={quillModules}
                      style={{ height: '120px', border: 'none' }}
                    />
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }} mt={5}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Remark (Optional)
                  </Typography>
                  <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <ReactQuill
                      value={formData.remark}
                      onChange={handleRichTextChange('remark')}
                      modules={quillModules}
                      style={{ height: '100px', border: 'none' }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Box>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} disabled={loading} startIcon={<CloseIcon />}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !isFormValid}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          {loading ? 'Saving...' : 'Save Follow-up Note'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFollowUpModal;
