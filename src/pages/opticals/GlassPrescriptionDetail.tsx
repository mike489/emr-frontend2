import React, { useEffect, useState } from 'react';
import {
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
  Breadcrumbs,
  Link,
  Container,
} from '@mui/material';
import { Home, Print, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
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

const GlassPrescriptionDetailPage: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [prescriptionData, setPrescriptionData] = useState<GlassPrescriptionDetail | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const [_showPrescriptionForm, setShowPrescriptionForm] = useState<boolean>(false);

  // Fetch prescription details and patient info
  const fetchPrescriptionDetails = async () => {
    if (!patientId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await LaboratoryService.getGlassPrescriptionDetails(patientId);
      const data = response.data?.data?.data?.[0]; // Access the first item in data array

      if (data) {
        setPrescriptionData(data);
        // In a real app, you would fetch patient info separately or get it from the prescription data
        // For now, let's create mock patient info based on the prescription data
        setPatientInfo({
          id: data.patient_id,
          name: 'John Doe', // Replace with actual patient name from API
          emr_number: 'EMR123456',
          age: 42,
          gender: 'Male',
          phone: '+1234567890',
          email: 'john.doe@example.com',
        });
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

  useEffect(() => {
    if (patientId) {
      fetchPrescriptionDetails();
    }
  }, [patientId]);

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

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  // Handle home navigation
  const handleHome = () => {
    navigate('/'); // Navigate to home page
  };

  // Render breadcrumbs
  const renderBreadcrumbs = () => (
    <Box sx={{ mb: 3 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          onClick={handleHome}
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <Home sx={{ mr: 0.5, fontSize: 20 }} />
          Home
        </Link>
        <Link underline="hover" color="inherit" onClick={handleBack} sx={{ cursor: 'pointer' }}>
          Patients
        </Link>
        <Typography color="text.primary">Prescription Details</Typography>
      </Breadcrumbs>
    </Box>
  );

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
      <Paper sx={{ p: 3, bgcolor: '#e8f4fd', mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
          Prescription Summary
        </Typography>
        <Grid container spacing={2}>
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

  // Render patient info card
  const renderPatientInfo = () => {
    if (!patientInfo) return null;

    return (
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#1e3c72' }}>
          Patient Information
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Name:</strong> {patientInfo.name}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>MRN:</strong> {patientInfo.emr_number}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Age:</strong> {patientInfo.age}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Gender:</strong> {patientInfo.gender}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Phone:</strong> {patientInfo.phone}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="body2">
              <strong>Email:</strong> {patientInfo.email || 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      {renderBreadcrumbs()}

      {/* Header */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          bgcolor: '#1e3c72',
          color: 'white',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            Glass Prescription Details
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Complete prescription information for patient
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={handleBack} sx={{ color: 'white' }}>
            <ArrowBack />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{ bgcolor: 'white', color: '#1e3c72', '&:hover': { bgcolor: '#f5f5f5' } }}
          >
            Print
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading prescription details...</Typography>
        </Box>
      ) : error ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={fetchPrescriptionDetails} sx={{ mr: 2 }}>
            Retry
          </Button>
          <Button variant="outlined" onClick={handleBack}>
            Go Back
          </Button>
        </Paper>
      ) : prescriptionData ? (
        <>
          {/* Patient Info */}
          {renderPatientInfo()}

          {/* Prescription Summary */}
          {renderPrescriptionSummary()}

          <Divider sx={{ my: 4 }} />

          {/* Prescription Specifications */}
          <Typography variant="h5" sx={{ mb: 3, color: '#1e3c72' }}>
            Prescription Specifications
          </Typography>
          {renderLensSpecifications()}

          <Divider sx={{ my: 4 }} />

          {/* Lens Features */}
          <Typography variant="h5" sx={{ mb: 3, color: '#1e3c72' }}>
            Lens Features & Options
          </Typography>
          {renderLensFeatures()}

          <Divider sx={{ my: 4 }} />

          {/* Additional Information */}
          <Typography variant="h5" sx={{ mb: 3, color: '#1e3c72' }}>
            Additional Information
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Prescription Notes
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  This prescription is valid for two years from the date of issue. Recommend annual
                  eye examinations for monitoring vision changes.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Ensure lenses meet ANSI Z80.1 standards
                  <br />
                  • Verify prescription accuracy before dispensing
                  <br />• Check patient adaptation during follow-up
                </Typography>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Optical Center Instructions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Ensure proper fitting and adjustment
                  <br />
                  • Verify PD measurements with pupilometer
                  <br />
                  • Confirm lens specifications match prescription
                  <br />
                  • Schedule follow-up if adaptation issues occur
                  <br />
                  • Provide proper lens care instructions
                  <br />• Verify frame fit and comfort
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            No Prescription Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No glass prescription found for this patient.
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#1976d2' }}
            onClick={() => setShowPrescriptionForm(true)}
          >
            Create New Prescription
          </Button>
          <Button variant="outlined" sx={{ ml: 2 }} onClick={handleBack}>
            Go Back
          </Button>
        </Paper>
      )}

      {/* Footer */}
      <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid>
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
          </Grid>
          <Grid>
            <Button variant="outlined" onClick={handleBack} sx={{ mr: 2 }}>
              Back to Patient List
            </Button>
            <Button variant="contained" onClick={handlePrint}>
              Print Prescription
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default GlassPrescriptionDetailPage;
