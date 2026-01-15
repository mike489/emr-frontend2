import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Box,
  IconButton,
  MenuItem,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface OperationNoteModalProps {
  open: boolean;
  onClose: () => void;
  operationName: string;
  patientName: string;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const anesthesiaTypes = ['GA', 'SA', 'Spinal', 'LA', 'Regional', 'Sedation'];

const OperationNoteModal: React.FC<OperationNoteModalProps> = ({
  open,
  onClose,
  operationName,
  patientName,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    pre_op_diagnosis: '',
    post_op_diagnosis: '',
    procedure: '',
    anesthesia_type: '',
    findings: '',
    post_op_plan: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        pre_op_diagnosis: initialData.pre_op_diagnosis || '',
        post_op_diagnosis: initialData.post_op_diagnosis || '',
        procedure: initialData.procedure || '',
        anesthesia_type: initialData.anesthesia_type || '',
        findings: initialData.findings || '',
        post_op_plan: initialData.post_op_plan || '',
      });
    } else {
      setFormData({
        pre_op_diagnosis: '',
        post_op_diagnosis: '',
        procedure: '',
        anesthesia_type: '',
        findings: '',
        post_op_plan: '',
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnesthesiaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, anesthesia_type: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const isFormValid =
    formData.pre_op_diagnosis.trim() !== '' &&
    formData.post_op_diagnosis.trim() !== '' &&
    formData.procedure.trim() !== '' &&
    formData.anesthesia_type !== '';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Operation Note</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Box sx={{ mt: 0.5 }}>
          <Typography variant="subtitle2" color="textSecondary" component="div">
            Patient: <strong>{patientName}</strong>
          </Typography>
          <Typography variant="subtitle2" color="textSecondary" component="div">
            Operation: <strong>{operationName}</strong>
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pre_op_diagnosis"
              label="Pre-op Diagnosis"
              required
              fullWidth
              multiline
              rows={3}
              value={formData.pre_op_diagnosis}
              onChange={handleChange}
              inputProps={{ maxLength: 2000 }}
              helperText={`${formData.pre_op_diagnosis.length}/2000`}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="post_op_diagnosis"
              label="Post-op Diagnosis"
              required
              fullWidth
              multiline
              rows={3}
              value={formData.post_op_diagnosis}
              onChange={handleChange}
              inputProps={{ maxLength: 2000 }}
              helperText={`${formData.post_op_diagnosis.length}/2000`}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField
              name="procedure"
              label="Procedure"
              required
              fullWidth
              multiline
              rows={3}
              value={formData.procedure}
              onChange={handleChange}
              inputProps={{ maxLength: 2000 }}
              helperText={`${formData.procedure.length}/2000`}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="anesthesia_type"
              label="Anesthesia Type"
              select
              required
              fullWidth
              value={formData.anesthesia_type}
              onChange={handleAnesthesiaChange}
            >
              {anesthesiaTypes.map(type => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="findings"
              label="Findings"
              fullWidth
              multiline
              rows={4}
              value={formData.findings}
              onChange={handleChange}
              inputProps={{ maxLength: 5000 }}
              helperText={`${formData.findings.length}/5000`}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="post_op_plan"
              label="Post-op Plan"
              fullWidth
              multiline
              rows={4}
              value={formData.post_op_plan}
              onChange={handleChange}
              inputProps={{ maxLength: 5000 }}
              helperText={`${formData.post_op_plan.length}/5000`}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          color="primary"
          disabled={!isFormValid}
        >
          Save Note
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OperationNoteModal;
