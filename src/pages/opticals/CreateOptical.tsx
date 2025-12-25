import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  // IconButton,
  // Collapse,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';

interface CreateOpticalProps {
  patientId: string;
}

interface EyeData {
  sphere?: string;
  cylinder?: string;
  axis?: string;
  add?: string;
  pd?: string;
}

interface PrescriptionData {
  rightEye?: EyeData;
  leftEye?: EyeData;
  type?: string;
  lensType?: string;
  frame?: string;
  tint?: string;
  coating?: string;
  notes?: string;
  prescriptionDate?: string;
  expiryDate?: string;
  price?: number;
  prism?: string;
  distancePD?: string;
  nearPD?: string;
}

const initialFormData: PrescriptionData = {
  rightEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
  leftEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
  prescriptionDate: new Date().toISOString().split('T')[0],
  price: 0,
};

const CreateOptical = ({ patientId }: CreateOpticalProps) => {
  const [formData, setFormData] = useState<PrescriptionData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [showDetails, setShowDetails] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };

  const handleEyeInputChange = (
    eye: 'rightEye' | 'leftEye',
    field: keyof EyeData,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [eye]: { ...prev[eye], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    if (!patientId) return setError('Patient ID is required');

    setLoading(true);
    setError(null);

    try {
      await LaboratoryService.createGlassPrescriptions(patientId, formData);
      setSuccess(true);
      setTimeout(() => setFormData(initialFormData), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSuccess(false);
    setError(null);
  };

  const eyeFields = [
    { label: 'Sphere', key: 'sphere', placeholder: '0.00' },
    { label: 'Cylinder', key: 'cylinder', placeholder: '0.00' },
    { label: 'Axis', key: 'axis', placeholder: '0' },
    { label: 'Add', key: 'add', placeholder: '+0.00' },
  ];

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h1">
          Optical Prescription
        </Typography>
        <Button
          size="small"
          // onClick={() => setShowDetails(!showDetails)}
          // endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {/* {showDetails ? 'Hide Details' : 'Show Details'} */}
        </Button>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Prescription saved!
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold' }}
          >
            Eye Measurements
          </Typography>

          <Grid container spacing={1}>
            <Grid size={{ xs: 4 }}></Grid>
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="caption"
                align="center"
                color="primary"
                sx={{ fontSize: '0.8rem' }}
              >
                Right (OD)
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="caption"
                align="center"
                color="primary"
                sx={{ fontSize: '0.8rem' }}
              >
                Left (OS)
              </Typography>
            </Grid>

            {eyeFields.map(({ label, key, placeholder }) => (
              <React.Fragment key={key}>
                <Grid size={{ xs: 4 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      height: '100%',
                      fontSize: '0.75rem',
                    }}
                  >
                    {label}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={formData.rightEye?.[key as keyof EyeData] || ''}
                    onChange={e =>
                      handleEyeInputChange('rightEye', key as keyof EyeData, e.target.value)
                    }
                    placeholder={placeholder}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem', py: 0.5 } }}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    value={formData.leftEye?.[key as keyof EyeData] || ''}
                    onChange={e =>
                      handleEyeInputChange('leftEye', key as keyof EyeData, e.target.value)
                    }
                    placeholder={placeholder}
                    sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem', py: 0.5 } }}
                  />
                </Grid>
              </React.Fragment>
            ))}

            <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
              <Divider sx={{ my: 1 }} />
            </Grid>

            <Grid size={{ xs: 12 }} container spacing={1}>
              <Grid size={{ xs: 6 }}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ fontSize: '0.875rem' }}>Vision Type</InputLabel>
                  <Select
                    value={formData.type || ''}
                    label="Vision Type"
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    sx={{ fontSize: '0.875rem' }}
                  >
                    <MenuItem value="distance" sx={{ fontSize: '0.875rem' }}>
                      Distance
                    </MenuItem>
                    <MenuItem value="reading" sx={{ fontSize: '0.875rem' }}>
                      Reading
                    </MenuItem>
                    <MenuItem value="bifocal" sx={{ fontSize: '0.875rem' }}>
                      Bifocal
                    </MenuItem>
                    <MenuItem value="progressive" sx={{ fontSize: '0.875rem' }}>
                      Progressive
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Prism (Δ)"
                  name="prism"
                  value={formData.prism || ''}
                  onChange={handleInputChange}
                  placeholder="Value"
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                />
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 2 }}>
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 1, fontWeight: 'bold' }}>
              Additional Details
            </Typography>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Frame"
                  name="frame"
                  value={formData.frame || ''}
                  onChange={handleInputChange}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tint"
                  name="tint"
                  value={formData.tint || ''}
                  onChange={handleInputChange}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Coating"
                  name="coating"
                  value={formData.coating || ''}
                  onChange={handleInputChange}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                  InputProps={{
                    startAdornment: (
                      <Typography sx={{ mr: 0.5, fontSize: '0.875rem' }}>$</Typography>
                    ),
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={2}
                  sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button variant="outlined" size="small" onClick={resetForm}>
          Clear
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          disabled={loading || success}
          startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon fontSize="small" />}
          sx={{ minWidth: 150 }}
        >
          {loading ? 'Saving...' : success ? 'Saved!' : 'Save Prescription'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateOptical;
