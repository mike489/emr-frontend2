// src/components/followup/UpdateFollowUp.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Grid,
} from '@mui/material';
import { toast } from 'react-toastify';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

import { FollowUpService } from '../../shared/api/services/followUp.service';
import { PatientService } from '../../shared/api/services/patient.service';

interface FollowUpNote {
  id: string;
  patient_id: string;
  od_s_correction: string;
  od_c_correction: string;
  od_iop: string; // Changed to string to match API
  od_cct: string;
  os_s_correction: string;
  os_c_correction: string;
  os_iop: string; // Changed to string to match API
  os_cct: string;
  examination_findings: string;
  plan: string;
  remark: string;
  diagnosis: string;
  created_at?: string;
  updated_at?: string;
}

interface Patient {
  id: string;
  full_name: string;
  patient_id?: string;
  phone?: string;
}

interface UpdateFollowUpProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  followUpId: string;
  followUpData?: FollowUpNote;
  patientId?: string; // Add patientId as optional prop
}

interface FollowUpFormData {
  patient_id: string;
  od_s_correction: string;
  od_c_correction: string;
  od_iop: string; // Changed to string
  od_cct: string;
  os_s_correction: string;
  os_c_correction: string;
  os_iop: string; // Changed to string
  os_cct: string;
  examination_findings: string;
  plan: string;
  remark: string;
  diagnosis: string;
}

const UpdateFollowUp: React.FC<UpdateFollowUpProps> = ({
  open,
  onClose,
  onSuccess,
  followUpId,
  followUpData,
  patientId, // Receive patientId as prop
}) => {
  const [loading, setLoading] = useState(false);
  const [patientLoading, setPatientLoading] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  const [formData, setFormData] = useState<FollowUpFormData>({
    patient_id: patientId || '', // Use patientId prop as default
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

  // Quill config
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
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link'
  ];

  // Load follow-up data + fetch patient name
  useEffect(() => {
    if (open) {
      if (followUpData) {
        // Populate form from followUpData
        setFormData({
          patient_id: followUpData.patient_id,
          od_s_correction: followUpData.od_s_correction || '',
          od_c_correction: followUpData.od_c_correction || '',
          od_iop: followUpData.od_iop || '',
          od_cct: followUpData.od_cct || '',
          os_s_correction: followUpData.os_s_correction || '',
          os_c_correction: followUpData.os_c_correction || '',
          os_iop: followUpData.os_iop || '',
          os_cct: followUpData.os_cct || '',
          examination_findings: followUpData.examination_findings || '',
          plan: followUpData.plan || '',
          remark: followUpData.remark || '',
          diagnosis: followUpData.diagnosis || '',
        });
        fetchPatient(followUpData.patient_id);
      } else if (patientId) {
        // Use patientId prop if no followUpData
        setFormData(prev => ({ ...prev, patient_id: patientId }));
        fetchPatient(patientId);
      }
    }
  }, [open, followUpData, patientId]);

  const fetchPatient = async (patientIdToFetch: string) => {
    setPatientLoading(true);
    try {
      const res = await PatientService.getById(patientIdToFetch);
      if (res.data?.data) {
        setCurrentPatient(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load patient info:', err);
      // Fallback: try to get patient from list
      try {
        const listRes = await PatientService.getList();
        const patient = listRes.data?.data?.data?.find((p: Patient) => p.id === patientIdToFetch);
        if (patient) {
          setCurrentPatient(patient);
        }
      } catch (listErr) {
        console.error('Failed to load patient from list:', listErr);
        toast.warn('Could not load patient name');
      }
    } finally {
      setPatientLoading(false);
    }
  };

  const handleInputChange = (field: keyof FollowUpFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

  const handleRichTextChange = (field: keyof FollowUpFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.examination_findings || !formData.plan || !formData.diagnosis) {
      toast.error('Examination findings, Plan, and Diagnosis are required');
      return;
    }

    if (!formData.patient_id) {
      toast.error('Patient ID is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        // Keep as strings since API expects strings
        od_iop: formData.od_iop || null,
        os_iop: formData.os_iop || null,
      };

      await FollowUpService.update(followUpId, payload);
      toast.success('Follow-up note updated successfully');
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update follow-up note');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      patient_id: patientId || '', // Reset with patientId prop
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
    setCurrentPatient(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          Update Follow-up Note
        </Typography>

        {/* Patient Info Header */}
        {patientLoading ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            <CircularProgress size={14} sx={{ mr: 1 }} /> 
            Loading patient information...
          </Typography>
        ) : currentPatient ? (
          <Typography variant="subtitle1" color="primary" sx={{ mt: 1, fontWeight: 500 }}>
            Patient: {currentPatient.full_name}
            {currentPatient.phone && ` • ${currentPatient.phone}`}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Patient ID: {formData.patient_id}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* OD Section */}
            <Grid size={12}>
              <Typography variant="h6" color="primary.main">
                OD (Right Eye)
              </Typography>
            </Grid>

            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField fullWidth label="S Correction" value={formData.od_s_correction} onChange={handleInputChange('od_s_correction')} />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField fullWidth label="C Correction" value={formData.od_c_correction} onChange={handleInputChange('od_c_correction')} />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField fullWidth type="number" label="IOP (mmHg)" value={formData.od_iop} onChange={handleInputChange('od_iop')} />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField fullWidth label="CCT (µm)" value={formData.od_cct} onChange={handleInputChange('od_cct')} />
            </Grid>

            {/* OS Section */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Typography variant="h6" color="primary.main">
                OS (Left Eye)
              </Typography>
            </Grid>

            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField fullWidth label="S Correction" value={formData.os_s_correction} onChange={handleInputChange('os_s_correction')} />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField fullWidth label="C Correction" value={formData.os_c_correction} onChange={handleInputChange('os_c_correction')} />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField fullWidth type="number" label="IOP (mmHg)" value={formData.os_iop} onChange={handleInputChange('os_iop')} />
            </Grid>
            <Grid  size={{xs:12, sm:6, md:3}}>
              <TextField fullWidth label="CCT (µm)" value={formData.os_cct} onChange={handleInputChange('os_cct')} />
            </Grid>

            {/* Rich Text Fields */}
            <Grid size={12} sx={{ mt: 4 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Examination Findings *
              </Typography>
              <ReactQuill
                value={formData.examination_findings}
                onChange={handleRichTextChange('examination_findings')}
                modules={quillModules}
                formats={quillFormats}
                style={{ height: '160px', marginBottom: '60px' }}
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
                style={{ height: '120px', marginBottom: '60px' }}
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
                style={{ height: '120px', marginBottom: '60px' }}
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
                style={{ height: '120px', marginBottom: '40px' }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading ? 'Updating...' : 'Update Follow-up'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateFollowUp;