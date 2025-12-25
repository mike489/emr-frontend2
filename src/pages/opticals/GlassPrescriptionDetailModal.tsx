import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Divider,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  // ListItemText,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { Close, Print, Visibility, Add, ShoppingCart } from '@mui/icons-material';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';

// Type definitions based on your API response
interface GlassPrescriptionDetail {
  id: string;
  patient_id: string;
  sun_sensor: string;
  photo_solar: string;
  plastic_lens: string;
  white_lens: string;
  progressive: string;
  bifocal: string;
  tinted_percentage: string | null;
  polarized_lens: string;
  right_distance_sph: string | null;
  right_distance_cyl: string | null;
  right_distance_axis: string | null;
  left_distance_sph: string | null;
  left_distance_cyl: string | null;
  left_distance_axis: string | null;
  right_close_sph: string | null;
  right_close_cyl: string | null;
  right_close_axis: string | null;
  left_close_sph: string | null;
  left_close_cyl: string | null;
  left_close_axis: string | null;
  distance_pd: string | null;
  near_pd: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface PatientInfo {
  id: string;
  name: string;
  emr_number: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
}

// Material interface
interface GlassMaterial {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock_quantity: number;
}

// Glass Order interface
interface GlassOrderMaterial {
  id: string;
  quantity: number;
}

interface GlassOrderData {
  glass_prescription_id: string;
  materials: GlassOrderMaterial[];
}

interface GlassPrescriptionDetailModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string | null;
  patientInfo?: PatientInfo;
}

const GlassPrescriptionDetailModal: React.FC<GlassPrescriptionDetailModalProps> = ({
  open,
  onClose,
  patientId,
  patientInfo,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prescriptionData, setPrescriptionData] = useState<GlassPrescriptionDetail | null>(null);
  const [_showPrescriptionForm, setShowPrescriptionForm] = useState<boolean>(false);

  // States for glass order
  const [materials, setMaterials] = useState<GlassMaterial[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [materialQuantities, setMaterialQuantities] = useState<Record<string, number>>({});
  const [orderDialogOpen, setOrderDialogOpen] = useState<boolean>(false);
  const [creatingOrder, setCreatingOrder] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch prescription details
  const fetchPrescriptionDetails = async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await LaboratoryService.getGlassPrescriptionDetails(patientId);
      const data = response.data?.data?.data?.[0];

      if (data) {
        setPrescriptionData(data);
      } else {
        setError('No prescription data found for this patient.');
      }
    } catch (err: any) {
      console.error('Error fetching glass prescription details:', err);
      setError(err.response?.data?.message || 'Failed to fetch prescription details');
    } finally {
      setLoading(false);
    }
  };

  // Fetch glass materials
  const fetchGlassMaterials = async () => {
    try {
      const response = await LaboratoryService.getGlassOrdersMaterials();
      setMaterials(response.data?.data || []);
    } catch (err: any) {
      console.error('Error fetching glass materials:', err);
      setSnackbar({
        open: true,
        message: 'Failed to load materials',
        severity: 'error',
      });
    }
  };

  useEffect(() => {
    if (open && patientId) {
      fetchPrescriptionDetails();
      fetchGlassMaterials();
    } else {
      setPrescriptionData(null);
      setError(null);
      setSelectedMaterials([]);
      setMaterialQuantities({});
    }
  }, [open, patientId]);

  // Handle material selection
  const handleMaterialChange = (event: any) => {
    const value = event.target.value;
    setSelectedMaterials(value);

    // Initialize quantity to 1 for newly selected materials
    const newQuantities = { ...materialQuantities };
    value.forEach((materialId: string) => {
      if (!newQuantities[materialId]) {
        newQuantities[materialId] = 1;
      }
    });
    setMaterialQuantities(newQuantities);
  };

  // Handle quantity change
  const handleQuantityChange = (materialId: string, quantity: number) => {
    if (quantity < 1) return;

    setMaterialQuantities(prev => ({
      ...prev,
      [materialId]: quantity,
    }));
  };

  // Open order dialog
  const handleOpenOrderDialog = () => {
    if (!prescriptionData?.id) {
      setSnackbar({
        open: true,
        message: 'No prescription available to create order',
        severity: 'warning',
      });
      return;
    }
    setOrderDialogOpen(true);
  };

  // Create glass order
  const handleCreateOrder = async () => {
    if (!prescriptionData?.id || selectedMaterials.length === 0) {
      setSnackbar({
        open: true,
        message: 'Please select at least one material',
        severity: 'warning',
      });
      return;
    }

    setCreatingOrder(true);

    const orderData: GlassOrderData = {
      glass_prescription_id: prescriptionData.id,
      materials: selectedMaterials.map(materialId => ({
        id: materialId,
        quantity: materialQuantities[materialId] || 1,
      })),
    };

    try {
      await LaboratoryService.createGlassOrders(orderData);

      setSnackbar({
        open: true,
        message: 'Glass order created successfully!',
        severity: 'success',
      });

      // Reset form and close dialog
      setSelectedMaterials([]);
      setMaterialQuantities({});
      setOrderDialogOpen(false);
    } catch (err: any) {
      console.error('Error creating glass order:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to create glass order',
        severity: 'error',
      });
    } finally {
      setCreatingOrder(false);
    }
  };

  // Format boolean display
  const formatBoolean = (value: string) => {
    return value === '1' ? 'Yes' : 'No';
  };

  // Format prescription value
  const formatPrescriptionValue = (value: string | null) => {
    if (value === null || value === '') return 'N/A';
    return value;
  };

  // Get status color
  const getStatusColor = (value: string) => {
    return value === '1' ? 'success' : 'default';
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedMaterials.reduce((total, materialId) => {
      const material = materials.find(m => m.id === materialId);
      const quantity = materialQuantities[materialId] || 1;
      return total + (material?.price || 0) * quantity;
    }, 0);
  };

  // Render lens specifications
  const renderLensSpecifications = () => {
    if (!prescriptionData) return null;

    return (
      <Grid container spacing={2}>
        {/* Distance Vision */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1e3c72' }}>
            Distance Vision
          </Typography>
          <Grid container spacing={3}>
            {/* Right Eye */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Right Eye (OD)
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Sphere
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.right_distance_sph)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Cylinder
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.right_distance_cyl)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Axis
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.right_distance_axis)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Left Eye */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Left Eye (OS)
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Sphere
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.left_distance_sph)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Cylinder
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.left_distance_cyl)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Axis
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.left_distance_axis)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Near Vision (Reading) */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1e3c72' }}>
            Near Vision (Reading)
          </Typography>
          <Grid container spacing={3}>
            {/* Right Eye */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Right Eye (OD)
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Sphere
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.right_close_sph)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Cylinder
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.right_close_cyl)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Axis
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.right_close_axis)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Left Eye */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Left Eye (OS)
                </Typography>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Sphere
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.left_close_sph)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Cylinder
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.left_close_cyl)}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="caption" color="text.secondary">
                      Axis
                    </Typography>
                    <Typography variant="body1">
                      {formatPrescriptionValue(prescriptionData.left_close_axis)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Pupillary Distance */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" sx={{ mb: 2, color: '#1e3c72' }}>
            Pupillary Distance (PD)
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Distance PD
                </Typography>
                <Typography variant="body1">
                  {formatPrescriptionValue(prescriptionData.distance_pd)} mm
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Near PD
                </Typography>
                <Typography variant="body1">
                  {formatPrescriptionValue(prescriptionData.near_pd)} mm
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  // Render lens features table
  const renderLensFeatures = () => {
    if (!prescriptionData) return null;

    const features = [
      {
        label: 'Sun Sensor',
        value: prescriptionData.sun_sensor,
        description: 'Photochromic lenses that darken in sunlight',
      },
      {
        label: 'Photo Solar',
        value: prescriptionData.photo_solar,
        description: 'Advanced photochromic technology',
      },
      {
        label: 'Plastic Lens',
        value: prescriptionData.plastic_lens,
        description: 'CR-39 plastic material',
      },
      {
        label: 'White Lens',
        value: prescriptionData.white_lens,
        description: 'Clear, non-tinted lenses',
      },
      {
        label: 'Progressive',
        value: prescriptionData.progressive,
        description: 'No-line bifocal lenses',
      },
      {
        label: 'Bifocal',
        value: prescriptionData.bifocal,
        description: 'Line-segmented bifocal lenses',
      },
      {
        label: 'Polarized Lens',
        value: prescriptionData.polarized_lens,
        description: 'Reduces glare from reflective surfaces',
      },
      {
        label: 'Tinted Percentage',
        value: prescriptionData.tinted_percentage || '0%',
        description: 'Level of lens tinting',
      },
    ];

    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Feature</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {features.map((feature, index) => (
              <TableRow key={index}>
                <TableCell>{feature.label}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      feature.label === 'Tinted Percentage'
                        ? feature.value
                        : formatBoolean(feature.value)
                    }
                    size="small"
                    color={
                      feature.label === 'Tinted Percentage'
                        ? 'default'
                        : getStatusColor(feature.value)
                    }
                    variant={feature.label === 'Tinted Percentage' ? 'outlined' : 'filled'}
                  />
                </TableCell>
                <TableCell>{feature.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Render prescription summary
  const renderPrescriptionSummary = () => {
    if (!prescriptionData) return null;

    const hasDistanceVision =
      prescriptionData.right_distance_sph || prescriptionData.left_distance_sph;
    const hasNearVision = prescriptionData.right_close_sph || prescriptionData.left_close_sph;
    const isBifocal = prescriptionData.bifocal === '1';
    const isProgressive = prescriptionData.progressive === '1';

    return (
      <Paper sx={{ p: 2, bgcolor: '#e8f4fd', mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>
          Prescription Summary
        </Typography>
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Type:</strong>{' '}
              {hasDistanceVision && hasNearVision
                ? isProgressive
                  ? 'Progressive Lenses'
                  : isBifocal
                    ? 'Bifocal Lenses'
                    : 'Single Vision Lenses'
                : 'Single Vision Lenses'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Lens Material:</strong>{' '}
              {prescriptionData.plastic_lens === '1' ? 'Plastic (CR-39)' : 'N/A'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Tint:</strong>{' '}
              {prescriptionData.tinted_percentage
                ? `${prescriptionData.tinted_percentage}%`
                : 'None'}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Special Features:</strong>
              {prescriptionData.polarized_lens === '1' ? ' Polarized' : ''}
              {prescriptionData.sun_sensor === '1' ? ' Photochromic' : ''}
              {!prescriptionData.polarized_lens && !prescriptionData.sun_sensor ? ' None' : ''}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Created:</strong> {new Date(prescriptionData.created_at).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Last Updated:</strong>{' '}
              {new Date(prescriptionData.updated_at).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="glass-prescription-modal"
        aria-describedby="glass-prescription-details"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            width: '90%',
            maxWidth: 1200,
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 0,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              bgcolor: '#1e3c72',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Glass Prescription Details
              </Typography>
              {patientInfo && (
                <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                  Patient: {patientInfo.name} | MRN: {patientInfo.emr_number} | Age:{' '}
                  {patientInfo.age} | Gender: {patientInfo.gender}
                </Typography>
              )}
            </Box>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Box>

          {/* Action Buttons */}
          <Box
            sx={{ p: 2, bgcolor: '#f5f5f5', display: 'flex', gap: 1, justifyContent: 'flex-end' }}
          >
            <Button variant="outlined" startIcon={<Print />} onClick={handlePrint} size="small">
              Print
            </Button>
            {prescriptionData && (
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenOrderDialog}
                size="small"
                sx={{ bgcolor: '#388e3c', '&:hover': { bgcolor: '#2e7d32' } }}
              >
                Create Glass Order
              </Button>
            )}
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 200,
                }}
              >
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading prescription details...</Typography>
              </Box>
            ) : error ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
                <Button variant="outlined" onClick={fetchPrescriptionDetails}>
                  Retry
                </Button>
              </Box>
            ) : prescriptionData ? (
              <>
                {renderPrescriptionSummary()}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h5" sx={{ mb: 3, color: '#1e3c72' }}>
                  Prescription Specifications
                </Typography>

                {renderLensSpecifications()}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h5" sx={{ mb: 3, color: '#1e3c72' }}>
                  Lens Features & Options
                </Typography>

                {renderLensFeatures()}

                <Divider sx={{ my: 3 }} />

                {/* Additional Information */}
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Prescription Notes
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        This prescription is valid for two years from the date of issue. Recommend
                        annual eye examinations for monitoring vision changes.
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Optical Center Instructions
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Ensure proper fitting and adjustment
                        <br />
                        • Verify PD measurements
                        <br />
                        • Confirm lens specifications match prescription
                        <br />• Schedule follow-up if adaptation issues occur
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Visibility sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  No Prescription Data
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No glass prescription found for this patient.
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, bgcolor: '#1976d2' }}
                  onClick={() => setShowPrescriptionForm(true)}
                >
                  Create New Prescription
                </Button>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              bgcolor: '#f5f5f5',
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Prescription ID: {prescriptionData?.id || 'N/A'} | Created:{' '}
              {prescriptionData
                ? new Date(prescriptionData.created_at).toLocaleDateString()
                : 'N/A'}{' '}
              | Updated:{' '}
              {prescriptionData
                ? new Date(prescriptionData.updated_at).toLocaleDateString()
                : 'N/A'}
            </Typography>
          </Box>
        </Box>
      </Modal>

      {/* Glass Order Dialog */}
      <Dialog
        open={orderDialogOpen}
        onClose={() => !creatingOrder && setOrderDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#388e3c', color: 'white' }}>
          <ShoppingCart sx={{ mr: 1, verticalAlign: 'middle' }} />
          Create Glass Order
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select materials for the glass order based on the prescription.
            </Typography>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Materials</InputLabel>
              <Select
                multiple
                value={selectedMaterials}
                onChange={handleMaterialChange}
                input={<OutlinedInput label="Select Materials" />}
                renderValue={selected => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map(materialId => {
                      const material = materials.find(m => m.id === materialId);
                      return material ? (
                        <Chip key={materialId} label={material.name} size="small" />
                      ) : null;
                    })}
                  </Box>
                )}
              >
                {materials.map(material => (
                  <MenuItem key={material.id} value={material.id}>
                    <Checkbox checked={selectedMaterials.indexOf(material.id) > -1} />
                    {/* <ListItemText
                      primary={material.name}
                      secondary={`$${material.price.toFixed(2)} - ${material.category}`}
                    /> */}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedMaterials.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Selected Materials & Quantities
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>Material</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedMaterials.map(materialId => {
                        const material = materials.find(m => m.id === materialId);
                        if (!material) return null;
                        const quantity = materialQuantities[materialId] || 1;
                        const total = material.price * quantity;

                        return (
                          <TableRow key={materialId}>
                            <TableCell>{material.name}</TableCell>
                            <TableCell>{material.category}</TableCell>
                            {/* <TableCell>${material.price.toFixed(2)}</TableCell> */}
                            <TableCell>
                              <TextField
                                type="number"
                                size="small"
                                value={quantity}
                                onChange={e =>
                                  handleQuantityChange(materialId, parseInt(e.target.value) || 1)
                                }
                                inputProps={{ min: 1 }}
                                sx={{ width: 80 }}
                              />
                            </TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>${total.toFixed(2)}</TableCell>
                          </TableRow>
                        );
                      })}
                      <TableRow sx={{ bgcolor: '#e8f5e8' }}>
                        <TableCell colSpan={4} align="right" sx={{ fontWeight: 'bold' }}>
                          Grand Total:
                        </TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                          ${calculateTotal().toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {selectedMaterials.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ShoppingCart sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                <Typography color="text.secondary">
                  No materials selected. Please select at least one material to create an order.
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDialogOpen(false)} disabled={creatingOrder}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateOrder}
            variant="contained"
            disabled={selectedMaterials.length === 0 || creatingOrder}
            sx={{ bgcolor: '#388e3c', '&:hover': { bgcolor: '#2e7d32' } }}
          >
            {creatingOrder ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Creating Order...
              </>
            ) : (
              'Create Order'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GlassPrescriptionDetailModal;
