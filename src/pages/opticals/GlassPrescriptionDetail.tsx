import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  Snackbar,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';
import { useNavigate } from 'react-router-dom';
import CreateGlassOrderModal from './CreateGlassOrderModal';

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
  price: string;
  category: string;
  stock_quantity: number;
}

// Props interface for the component
interface GlassPrescriptionDetailPageProps {
  patientId?: string;
  patientInfo?: PatientInfo;
}

const GlassPrescriptionDetailPage: React.FC<GlassPrescriptionDetailPageProps> = ({
  patientId: patientId,
  patientInfo: propPatientInfo,
}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [prescriptionData, setPrescriptionData] = useState<GlassPrescriptionDetail | null>(null);
  const [_patientInfo, _setPatientInfo] = useState<PatientInfo | null>(propPatientInfo || null);
  const [_showPrescriptionForm, setShowPrescriptionForm] = useState<boolean>(false);

  // States for glass order
  const [materials, setMaterials] = useState<GlassMaterial[]>([]);
  const [orderModalOpen, setOrderModalOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  // Fetch patient info and prescription details
  const fetchData = async () => {
    console.log('Current patientId:', patientId);

    if (!patientId) {
      console.error('No patient ID provided');
      setError('No patient ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching prescription details for patient:', patientId);

      const response = await LaboratoryService.getGlassPrescriptionDetails(patientId);
      console.log('API Response:', response);

      // Check if response has the expected structure
      if (!response.data) {
        console.warn('No data in response:', response);
        setError('No prescription data found for this patient.');
        setLoading(false);
        return;
      }

      // Try to extract data from different response structures
      let prescriptionData = null;

      // Common API response structures
      if (response.data?.data?.data?.[0]) {
        prescriptionData = response.data.data.data[0];
      } else if (response.data?.data?.[0]) {
        prescriptionData = response.data.data[0];
      } else if (response.data?.data) {
        prescriptionData = response.data.data;
      } else if (Array.isArray(response.data)) {
        prescriptionData = response.data[0];
      } else {
        prescriptionData = response.data;
      }

      console.log('Extracted prescription data:', prescriptionData);

      if (prescriptionData) {
        setPrescriptionData(prescriptionData);
      } else {
        console.warn('No prescription data extracted');
        setError('No prescription data found for this patient.');
      }
    } catch (err: any) {
      console.error('Error fetching glass prescription details:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config, // This shows the URL being called
      });

      let errorMessage = 'Failed to fetch prescription details';
      if (err.response?.status === 404) {
        errorMessage = 'Prescription not found for this patient';
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication required';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch glass materials
  const fetchGlassMaterials = async () => {
    try {
      console.log('Fetching glass materials...');
      const response = await LaboratoryService.getGlassOrdersMaterials();
      console.log('Materials response:', response);
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
    if (patientId) {
      fetchData();
      fetchGlassMaterials();
    } else {
      setError('No patient ID provided');
    }
  }, [patientId]);

  // Open order modal
  const handleOpenOrderModal = () => {
    if (!prescriptionData?.id) {
      setSnackbar({
        open: true,
        message: 'No prescription available to create order',
        severity: 'warning',
      });
      return;
    }
    setOrderModalOpen(true);
  };

  // Handle order created successfully
  const handleOrderCreated = () => {
    setSnackbar({
      open: true,
      message: 'Glass order created successfully!',
      severity: 'success',
    });
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
  // const handlePrint = () => {
  //   window.print();
  // };

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
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
  // const renderPrescriptionSummary = () => {
  //   if (!prescriptionData) return null;

  //   const hasDistanceVision =
  //     prescriptionData.right_distance_sph || prescriptionData.left_distance_sph;
  //   const hasNearVision = prescriptionData.right_close_sph || prescriptionData.left_close_sph;
  //   const isBifocal = prescriptionData.bifocal === '1';
  //   const isProgressive = prescriptionData.progressive === '1';

  //   return (
  //     <Paper sx={{ p: 2, bgcolor: '#e8f4fd', mb: 2 }}>
  //       <Typography variant="h6" sx={{ mb: 1, color: '#1976d2' }}>
  //         Prescription Summary
  //       </Typography>
  //       <Grid container spacing={1}>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <Typography variant="body2">
  //             <strong>Type:</strong>{' '}
  //             {hasDistanceVision && hasNearVision
  //               ? isProgressive
  //                 ? 'Progressive Lenses'
  //                 : isBifocal
  //                   ? 'Bifocal Lenses'
  //                   : 'Single Vision Lenses'
  //               : 'Single Vision Lenses'}
  //           </Typography>
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <Typography variant="body2">
  //             <strong>Lens Material:</strong>{' '}
  //             {prescriptionData.plastic_lens === '1' ? 'Plastic (CR-39)' : 'N/A'}
  //           </Typography>
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <Typography variant="body2">
  //             <strong>Tint:</strong>{' '}
  //             {prescriptionData.tinted_percentage
  //               ? `${prescriptionData.tinted_percentage}%`
  //               : 'None'}
  //           </Typography>
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <Typography variant="body2">
  //             <strong>Special Features:</strong>
  //             {prescriptionData.polarized_lens === '1' ? ' Polarized' : ''}
  //             {prescriptionData.sun_sensor === '1' ? ' Photochromic' : ''}
  //             {!prescriptionData.polarized_lens && !prescriptionData.sun_sensor ? ' None' : ''}
  //           </Typography>
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <Typography variant="body2">
  //             <strong>Created:</strong> {new Date(prescriptionData.created_at).toLocaleDateString()}
  //           </Typography>
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 6 }}>
  //           <Typography variant="body2">
  //             <strong>Last Updated:</strong>{' '}
  //             {new Date(prescriptionData.updated_at).toLocaleDateString()}
  //           </Typography>
  //         </Grid>
  //       </Grid>
  //     </Paper>
  //   );
  // };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      {/* <Box
        sx={{
          p: 3,
          bgcolor: '#1976d2',
          color: 'white',
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Button
            variant="contained"
            onClick={handleBack}
            startIcon={<ArrowBack />}
            sx={{
              bgcolor: 'white',
              color: '#1e3c72',
              '&:hover': { bgcolor: '#f5f5f5' },
            }}
          >
            Back
          </Button>
        </Box>
      </Box> */}

      {/* Content */}
      <Box sx={{ p: 0 }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 400,
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading prescription details...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="error" sx={{ mb: 2, fontSize: '1.2rem' }}>
              {error}
            </Typography>
            <Button variant="outlined" onClick={fetchData}>
              Retry
            </Button>
            <Button variant="contained" onClick={handleBack} sx={{ ml: 2 }}>
              Go Back
            </Button>
          </Box>
        ) : prescriptionData ? (
          <>
            {/* {renderPrescriptionSummary()} */}

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box
              sx={{
                p: 2,
                // bgcolor: '#f5f5f5',
                display: 'flex',
                gap: 1,
                justifyContent: 'space-between',
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography variant="h4" sx={{ color: '#1e3c72' }}>
                Prescription Specifications
              </Typography>
              {prescriptionData && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleOpenOrderModal}
                  size="small"
                  sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
                >
                  Create Glass Order
                </Button>
              )}
            </Box>

            {renderLensSpecifications()}

            <Divider sx={{ my: 3 }} />

            <Typography variant="h4" sx={{ mb: 3, color: '#1e3c72' }}>
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
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
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
          borderRadius: 1,
          textAlign: 'center',
          mt: 3,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Prescription ID: {prescriptionData?.id || 'N/A'} | Created:{' '}
          {prescriptionData ? new Date(prescriptionData.created_at).toLocaleDateString() : 'N/A'} |
          Updated:{' '}
          {prescriptionData ? new Date(prescriptionData.updated_at).toLocaleDateString() : 'N/A'}
        </Typography>
      </Box>

      {/* Create Glass Order Modal */}
      <CreateGlassOrderModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        materials={materials}
        prescriptionId={prescriptionData?.id || ''}
        onOrderCreated={handleOrderCreated}
      />

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
    </Box>
  );
};

export default GlassPrescriptionDetailPage;
