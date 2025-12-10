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
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';

interface CreateOpticalProps {
  patientId: string;
}

interface GlassPrescriptionData {
  rightEye?: {
    sphere?: string;
    cylinder?: string;
    axis?: string;
    add?: string;
    pd?: string;
  };
  leftEye?: {
    sphere?: string;
    cylinder?: string;
    axis?: string;
    add?: string;
    pd?: string;
  };
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

const CreateOptical = ({ patientId }: CreateOpticalProps) => {
  const [formData, setFormData] = useState<GlassPrescriptionData>({
    rightEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
    leftEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
    type: '',
    lensType: '',
    frame: '',
    tint: '',
    coating: '',
    notes: '',
    prescriptionDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    price: 0,
    prism: '',
    distancePD: '',
    nearPD: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEyeInputChange = (eye: 'rightEye' | 'leftEye', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!patientId) {
      setError('Patient ID is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await LaboratoryService.createGlassPrescriptions(patientId, formData);
      setSuccess(true);
      console.log('Prescription created successfully:', response.data);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          rightEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
          leftEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
          type: '',
          lensType: '',
          frame: '',
          tint: '',
          coating: '',
          notes: '',
          prescriptionDate: new Date().toISOString().split('T')[0],
          expiryDate: '',
          price: 0,
          prism: '',
          distancePD: '',
          nearPD: '',
        });
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create prescription');
      console.error('Error creating prescription:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Optical Prescription Form
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Prescription created successfully!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
            Eye Prescription
          </Typography>

          <Grid container spacing={4}>
            {/* Header Row - Eye Labels */}
            <Grid size={{ xs: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" align="center"></Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography variant="subtitle1" align="center" color="primary">
                Right (OD)
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <Typography variant="subtitle1" align="center" color="primary">
                Left (OS)
              </Typography>
            </Grid>

            {/* Sphere */}
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
              >
                Sphere (SPH)
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.rightEye?.sphere || ''}
                onChange={e => handleEyeInputChange('rightEye', 'sphere', e.target.value)}
                placeholder="0.00"
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.leftEye?.sphere || ''}
                onChange={e => handleEyeInputChange('leftEye', 'sphere', e.target.value)}
                placeholder="0.00"
              />
            </Grid>

            {/* Cylinder */}
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
              >
                Cylinder (CYL)
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.rightEye?.cylinder || ''}
                onChange={e => handleEyeInputChange('rightEye', 'cylinder', e.target.value)}
                placeholder="0.00"
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.leftEye?.cylinder || ''}
                onChange={e => handleEyeInputChange('leftEye', 'cylinder', e.target.value)}
                placeholder="0.00"
              />
            </Grid>

            {/* Axis */}
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
              >
                Axis
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.rightEye?.axis || ''}
                onChange={e => handleEyeInputChange('rightEye', 'axis', e.target.value)}
                placeholder="0"
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.leftEye?.axis || ''}
                onChange={e => handleEyeInputChange('leftEye', 'axis', e.target.value)}
                placeholder="0"
              />
            </Grid>

            {/* Add */}
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
              >
                Add
              </Typography>
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.rightEye?.add || ''}
                onChange={e => handleEyeInputChange('rightEye', 'add', e.target.value)}
                placeholder="+0.00"
              />
            </Grid>
            <Grid size={{ xs: 4 }}>
              <TextField
                fullWidth
                size="small"
                value={formData.leftEye?.add || ''}
                onChange={e => handleEyeInputChange('leftEye', 'add', e.target.value)}
                placeholder="+0.00"
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <Divider sx={{ my: 2 }} />
            </Grid>

            {/* Vision Type */}
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
              >
                Vision Type
              </Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Distance Vision</InputLabel>
                    <Select
                      value={formData.type || ''}
                      label="Distance Vision"
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                    >
                      <MenuItem value="distance">Distance</MenuItem>
                      <MenuItem value="reading">Reading</MenuItem>
                      <MenuItem value="bifocal">Bifocal</MenuItem>
                      <MenuItem value="progressive">Progressive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Lens Type</InputLabel>
                    <Select
                      value={formData.lensType || ''}
                      label="Lens Type"
                      onChange={e => setFormData({ ...formData, lensType: e.target.value })}
                    >
                      <MenuItem value="single_vision">Single Vision</MenuItem>
                      <MenuItem value="bifocal">Bifocal</MenuItem>
                      <MenuItem value="progressive">Progressive</MenuItem>
                      <MenuItem value="high_index">High Index</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            {/* Prism */}
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
              >
                Prism (Δ)
              </Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <TextField
                fullWidth
                size="small"
                name="prism"
                value={formData.prism || ''}
                onChange={handleInputChange}
                placeholder="Prism value"
              />
            </Grid>

            {/* PD Measurements */}
            <Grid size={{ xs: 4 }}>
              <Typography
                variant="subtitle2"
                sx={{ display: 'flex', alignItems: 'center', height: '100%' }}
              >
                PD (mm)
              </Typography>
            </Grid>
            <Grid size={{ xs: 8 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Distance PD"
                    name="distancePD"
                    value={formData.distancePD || ''}
                    onChange={handleInputChange}
                    placeholder="mm"
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Near PD"
                    name="nearPD"
                    value={formData.nearPD || ''}
                    onChange={handleInputChange}
                    placeholder="mm"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            Additional Details
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Frame"
                name="frame"
                value={formData.frame || ''}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Tint"
                name="tint"
                value={formData.tint || ''}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Coating"
                name="coating"
                value={formData.coating || ''}
                onChange={handleInputChange}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price || ''}
                onChange={handleInputChange}
                size="small"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
                multiline
                rows={3}
                size="small"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => {
            setFormData({
              rightEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
              leftEye: { sphere: '', cylinder: '', axis: '', add: '', pd: '' },
              type: '',
              lensType: '',
              frame: '',
              tint: '',
              coating: '',
              notes: '',
              prescriptionDate: new Date().toISOString().split('T')[0],
              expiryDate: '',
              price: 0,
              prism: '',
              distancePD: '',
              nearPD: '',
            });
            setSuccess(false);
            setError(null);
          }}
        >
          Clear Form
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || success}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{ minWidth: 200 }}
        >
          {loading ? 'Submitting...' : success ? 'Submitted!' : 'Save Prescription'}
        </Button>
      </Box>
    </Box>
  );
};

export default CreateOptical;
