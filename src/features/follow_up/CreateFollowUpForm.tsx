
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

interface CreateFollowUpFormProps {
  patientId: string;
  visitId?: string;
}

const CreateFollowUpForm: React.FC<CreateFollowUpFormProps> = ({ patientId, visitId }) => {
  const navigate = useNavigate();

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
    if (patientId) {
      setFormData(prev => ({ ...prev, patient_id: patientId }));
    }
  }, [patientId]);

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
      ['clean'],
    ],
  };

  const handleInputChange = (field: keyof FollowUpFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
      navigate(-1);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create follow-up');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 2 }}>
            OD (Right Eye)
          </Typography>

          <Grid container spacing={3}>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="Spherical Correction (S)"
                value={formData.od_s_correction}
                onChange={handleInputChange('od_s_correction')}
                placeholder="-2.50"
              />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="Cylindrical Correction (C)"
                value={formData.od_c_correction}
                onChange={handleInputChange('od_c_correction')}
                placeholder="1.25"
              />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                type="number"
                label="IOP (mmHg)"
                value={formData.od_iop}
                onChange={handleInputChange('od_iop')}
                placeholder="18"
              />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="CCT (µm)"
                value={formData.od_cct}
                onChange={handleInputChange('od_cct')}
                placeholder="550"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography variant="h6" color="secondary" gutterBottom>
            OS (Left Eye)
          </Typography>

          <Grid container spacing={3}>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="Spherical Correction (S)"
                value={formData.os_s_correction}
                onChange={handleInputChange('os_s_correction')}
                placeholder="-2.00"
              />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="Cylindrical Correction (C)"
                value={formData.os_c_correction}
                onChange={handleInputChange('os_c_correction')}
                placeholder="1.00"
              />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                type="number"
                label="IOP (mmHg)"
                value={formData.os_iop}
                onChange={handleInputChange('os_iop')}
                placeholder="17"
              />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField
                fullWidth
                label="CCT (µm)"
                value={formData.os_cct}
                onChange={handleInputChange('os_cct')}
                placeholder="545"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 5 }} />

          <Grid container spacing={4}>
            <Grid size={12}>
              <Typography variant="subtitle1" fontWeight="bold">
                Examination Findings *
              </Typography>
              <ReactQuill
                value={formData.examination_findings}
                onChange={handleRichTextChange('examination_findings')}
                modules={quillModules}
                style={{ height: '180px', marginBottom: '60px' }}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" fontWeight="bold">
                Diagnosis *
              </Typography>
              <ReactQuill
                value={formData.diagnosis}
                onChange={handleRichTextChange('diagnosis')}
                modules={quillModules}
                style={{ height: '120px', marginBottom: '50px' }}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" fontWeight="bold">
                Plan *
              </Typography>
              <ReactQuill
                value={formData.plan}
                onChange={handleRichTextChange('plan')}
                modules={quillModules}
                style={{ height: '140px', marginBottom: '50px' }}
              />
            </Grid>

            <Grid size={12}>
              <Typography variant="subtitle1" fontWeight="bold">
                Remark (Optional)
              </Typography>
              <ReactQuill
                value={formData.remark}
                onChange={handleRichTextChange('remark')}
                modules={quillModules}
                style={{ height: '100px', marginBottom: '40px' }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4 }}>
            <Button size="large" onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>

            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={handleSubmit}
              disabled={
                loading ||
                !formData.examination_findings?.trim() ||
                !formData.diagnosis?.trim() ||
                !formData.plan?.trim()
              }
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Saving...' : 'Save Follow Up Note'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateFollowUpForm;
