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
  Autocomplete,
} from '@mui/material';
import { Close } from '@mui/icons-material';

interface PrescriptionModalProps {
  open: boolean;
  onClose: () => void;
  medicineId: string;
  patientName: string;
  operationName: string;
  onSubmit: (data: any) => void;
}

const routes = ['PO', 'IM', 'IV', 'SC', 'Topical', 'Eye', 'Ear', 'Nasal'];
const frequencies = ['QD', 'BID', 'TID', 'QID', 'PRN', 'Every 4 hours', 'Every 6 hours', 'Every 8 hours'];

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  open,
  onClose,
  medicineId,
  patientName,
  operationName,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    medicine_id: medicineId,
    quantity: 1,
    dose: '',
    route: '',
    frequency: '',
    duration: '',
    instructions: '',
    note: '',
    strength: '',
    form: '',
    medicine_name: operationName,
  });

  // Sync medicineId if it changes
  useEffect(() => {
    if (medicineId) {
      setFormData(prev => ({ 
        ...prev, 
        medicine_id: medicineId,
        medicine_name: operationName 
      }));
    }
  }, [medicineId, operationName]);

  const handleSubmit = () => {
    const submissionData = {
      medicine_id: formData.medicine_id,
      quantity: parseInt(formData.quantity.toString()) || 1,
      dose: formData.dose,
      route: formData.route,
      frequency: formData.frequency,
      duration: formData.duration,
      instructions: formData.instructions,
      note: formData.note,
      strength: formData.strength,
      form: formData.form
    };

    onSubmit(submissionData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Add Prescription</Typography>
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
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Medicine Name"
              fullWidth
              size="small"
              variant="outlined"
              value={formData.medicine_name}
              InputProps={{ readOnly: true }}
              disabled
              helperText="Pre-filled from Operation"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Form"
              placeholder="e.g., tablet, eye drops"
              fullWidth
              size="small"
              value={formData.form}
              onChange={(e) => setFormData(prev => ({ ...prev, form: e.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Strength"
              placeholder="e.g., 500mg, 0.3%"
              fullWidth
              size="small"
              value={formData.strength}
              onChange={(e) => setFormData(prev => ({ ...prev, strength: e.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Dose"
              placeholder="e.g., 1 tablet, 1 drop"
              fullWidth
              size="small"
              value={formData.dose}
              onChange={(e) => setFormData(prev => ({ ...prev, dose: e.target.value }))}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              options={routes}
              freeSolo
              value={formData.route}
              onChange={(_, value) => setFormData(prev => ({ ...prev, route: value || '' }))}
              onInputChange={(_, value) => setFormData(prev => ({ ...prev, route: value }))}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Route" 
                  fullWidth 
                  size="small" 
                  required
                  placeholder="e.g., PO, Eye"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Autocomplete
              options={frequencies}
              freeSolo
              value={formData.frequency}
              onChange={(_, value) => setFormData(prev => ({ ...prev, frequency: value || '' }))}
              onInputChange={(_, value) => setFormData(prev => ({ ...prev, frequency: value }))}
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Frequency" 
                  fullWidth 
                  size="small" 
                  required
                  placeholder="e.g., BID, every 6 hours"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Duration"
              placeholder="e.g., 7 days"
              fullWidth
              size="small"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              required
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Instructions"
              placeholder="e.g., food/bedtime/etc"
              fullWidth
              multiline
              rows={2}
              size="small"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
            />
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          variant="contained" 
          onClick={handleSubmit} 
          color="primary"
          disabled={!formData.medicine_id || !formData.dose || !formData.route || !formData.frequency || !formData.duration}
        >
          Save Prescription
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrescriptionModal;
