import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Container,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ExaminationData } from '../../shared/api/types/examination.types';
import { PatientService } from '../../shared/api/services/patient.service';

interface LocationState {
  examinationData?: ExaminationData;
  visitData?: {
    visitDate: string;
    visitType: string;
    patientName: string;
  };
}
interface ExaminationDataPrintProps {
  consultationId: string;
}

const ExaminationDataPrint: React.FC<ExaminationDataPrintProps> = ({ consultationId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const [examinationData, setExaminationData] = React.useState<ExaminationData | null>(null);
  const [visitData, _setVisitData] = React.useState(state?.visitData);
  const [loading, setLoading] = React.useState(true);

  // Use both state and API data
  useEffect(() => {
    const fetchData = async () => {
      if (state?.examinationData) {
        setExaminationData(state.examinationData);
        setLoading(false);
        return;
      }

      if (!consultationId) {
        setLoading(false);
        return;
      }

      try {
        const res = await PatientService.getExaminationData(consultationId);
        const data = res.data.data.examination_data;

        const normalized = Object.fromEntries(
          Object.entries(data).map(([key, value]) => [key, value === '' ? null : value])
        ) as unknown as ExaminationData;

        setExaminationData({ ...normalized });

        if (!visitData) {
        }
      } catch (err) {
        console.log('No existing data or error:', err);
        setExaminationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [consultationId, state?.examinationData, state?.visitData]);

  // Show loading state
  if (loading) {
    return (
      <Container sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Show error only after loading is complete and no data exists
  if (!examinationData) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" color="error" align="center">
          No examination data found. Please go back and select a patient.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={() => navigate(-1)} startIcon={<ArrowBackIcon />}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implement PDF download functionality here
    console.log('Download PDF functionality');
  };

  // Helper function to format section data
  const renderSection = (title: string, data: Record<string, any>) => {
    const filteredData = Object.entries(data).filter(
      ([_, value]) =>
        value !== null &&
        value !== '' &&
        value !== undefined &&
        (!Array.isArray(value) || value.length > 0)
    );

    if (filteredData.length === 0) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            color: 'primary.main',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            pb: 1,
          }}
        >
          {title}
        </Typography>
        <Grid container spacing={2}>
          {filteredData.map(([key, value]) => (
            <Grid size={{ xs: 12, sm: 6 }} key={key}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {Array.isArray(value) ? value.join(', ') : String(value)}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // Render visual acuity table
  const renderVisualAcuity = () => {
    const visualAcuityData = [
      {
        type: 'Distance',
        od_ucva: examinationData.distance_od_ucva,
        od_scva: examinationData.distance_od_scva,
        od_bcva: examinationData.distance_od_bcva,
        os_ucva: examinationData.distance_os_ucva,
        os_scva: examinationData.distance_os_scva,
        os_bcva: examinationData.distance_os_bcva,
      },
      {
        type: 'Near',
        od_ucva: examinationData.near_od_ucva,
        od_scva: examinationData.near_od_scva,
        od_bcva: examinationData.near_od_bcva,
        os_ucva: examinationData.near_os_ucva,
        os_scva: examinationData.near_os_scva,
        os_bcva: examinationData.near_os_bcva,
      },
    ].filter(
      row => row.od_ucva || row.od_scva || row.od_bcva || row.os_ucva || row.os_scva || row.os_bcva
    );

    if (visualAcuityData.length === 0) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            color: 'primary.main',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            pb: 1,
          }}
        >
          Visual Acuity
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableBody>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell>
                  <strong>Type</strong>
                </TableCell>
                <TableCell>
                  <strong>OD UCVA</strong>
                </TableCell>
                <TableCell>
                  <strong>OD SCVA</strong>
                </TableCell>
                <TableCell>
                  <strong>OD BCVA</strong>
                </TableCell>
                <TableCell>
                  <strong>OS UCVA</strong>
                </TableCell>
                <TableCell>
                  <strong>OS SCVA</strong>
                </TableCell>
                <TableCell>
                  <strong>OS BCVA</strong>
                </TableCell>
              </TableRow>
              {visualAcuityData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <strong>{row.type}</strong>
                  </TableCell>
                  <TableCell>{row.od_ucva || '-'}</TableCell>
                  <TableCell>{row.od_scva || '-'}</TableCell>
                  <TableCell>{row.od_bcva || '-'}</TableCell>
                  <TableCell>{row.os_ucva || '-'}</TableCell>
                  <TableCell>{row.os_scva || '-'}</TableCell>
                  <TableCell>{row.os_bcva || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Render anterior segment data
  const renderAnteriorSegment = () => {
    const anteriorData = [
      { part: 'Lids', od: examinationData.lids_od, os: examinationData.lids_os },
      { part: 'Lashes', od: examinationData.lashes_od, os: examinationData.lashes_os },
      {
        part: 'Conjunctiva',
        od: examinationData.conjunctiva_od,
        os: examinationData.conjunctiva_os,
      },
      { part: 'Sclera', od: examinationData.sclera_od, os: examinationData.sclera_os },
      {
        part: 'Lacrimal System',
        od: examinationData.lacrimal_system_od,
        os: examinationData.lacrimal_system_os,
      },
      { part: 'Cornea', od: examinationData.cornea_od, os: examinationData.cornea_os },
      {
        part: 'Anterior Chamber',
        od: examinationData.anterior_chamber_od,
        os: examinationData.anterior_chamber_os,
      },
      { part: 'Iris', od: examinationData.iris_od, os: examinationData.iris_os },
      { part: 'Lens', od: examinationData.lens_od, os: examinationData.lens_os },
      { part: 'Vitreous', od: examinationData.vitreous_od, os: examinationData.vitreous_os },
    ].filter(item => item.od || item.os);

    if (anteriorData.length === 0) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            color: 'primary.main',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            pb: 1,
          }}
        >
          Anterior Segment
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableBody>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell>
                  <strong>Part</strong>
                </TableCell>
                <TableCell>
                  <strong>OD</strong>
                </TableCell>
                <TableCell>
                  <strong>OS</strong>
                </TableCell>
              </TableRow>
              {anteriorData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <strong>{item.part}</strong>
                  </TableCell>
                  <TableCell>{item.od || '-'}</TableCell>
                  <TableCell>{item.os || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Render posterior segment data
  const renderPosteriorSegment = () => {
    const posteriorData = [
      { part: 'Optic Disc', od: examinationData.optic_disc_od, os: examinationData.optic_disc_os },
      { part: 'Macula', od: examinationData.macula_od, os: examinationData.macula_os },
      { part: 'Vessels', od: examinationData.vessels_od, os: examinationData.vessels_os },
      { part: 'Periphery', od: examinationData.periphery_od, os: examinationData.periphery_os },
    ].filter(item => item.od || item.os);

    if (posteriorData.length === 0) return null;

    return (
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            color: 'primary.main',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            pb: 1,
          }}
        >
          Posterior Segment
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableBody>
              <TableRow sx={{ backgroundColor: 'grey.100' }}>
                <TableCell>
                  <strong>Part</strong>
                </TableCell>
                <TableCell>
                  <strong>OD</strong>
                </TableCell>
                <TableCell>
                  <strong>OS</strong>
                </TableCell>
              </TableRow>
              {posteriorData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <strong>{item.part}</strong>
                  </TableCell>
                  <TableCell>{item.od || '-'}</TableCell>
                  <TableCell>{item.os || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Render rich text content safely
  const renderRichText = (content: string) => {
    return (
      <Box
        sx={{
          '& h1, & h2, & h3': { margin: '8px 0' },
          '& p': { margin: '4px 0' },
          '& ul, & ol': { margin: '4px 0', paddingLeft: '20px' },
          '& li': { margin: '2px 0' },
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header with Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* <IconButton onClick={handleBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton> */}
            <Typography variant="h4" fontWeight="bold">
              Examination Report
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{ '@media print': { display: 'none' } }}
            >
              Print
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{ '@media print': { display: 'none' } }}
            >
              Download PDF
            </Button>
          </Box>
        </Box>

        {visitData && (
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Patient Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {visitData.patientName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Visit Date
                </Typography>
                <Typography variant="body1">
                  {new Date(visitData.visitDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Visit Type
                </Typography>
                <Typography variant="body1">{visitData.visitType}</Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Main Content */}
      <Paper elevation={0} sx={{ p: 4, mb: 3 }}>
        {/* Patient History */}
        {(examinationData.complaint_details ||
          examinationData.current_oscular_medication ||
          examinationData.current_systemic_medication ||
          examinationData.systemic_conditions?.length > 0 ||
          examinationData.allergies?.length > 0 ||
          examinationData.family_history?.length > 0) && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                color: 'primary.main',
                pb: 1,
                borderBottom: '2px solid',
                borderColor: 'primary.main',
              }}
            >
              Patient History
            </Typography>

            {examinationData.complaint_details && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Complaint Details:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  {renderRichText(examinationData.complaint_details)}
                </Paper>
              </Box>
            )}

            <Grid container spacing={3}>
              {examinationData.current_oscular_medication && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Current Ocular Medication:
                  </Typography>
                  <Typography>{examinationData.current_oscular_medication}</Typography>
                </Grid>
              )}

              {examinationData.current_systemic_medication && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Current Systemic Medication:
                  </Typography>
                  <Typography>{examinationData.current_systemic_medication}</Typography>
                </Grid>
              )}

              {examinationData.current_contact_lense_use && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Contact Lens Use:
                  </Typography>
                  <Chip
                    label={examinationData.current_contact_lense_use ? 'Yes' : 'No'}
                    color={examinationData.current_contact_lense_use ? 'primary' : 'default'}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                  {examinationData.lens_type && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Type: {examinationData.lens_type}
                    </Typography>
                  )}
                </Grid>
              )}
            </Grid>

            {/* Lists */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {examinationData.systemic_conditions?.length > 0 && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Systemic Conditions:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {examinationData.systemic_conditions.map((condition, index) => (
                      <Chip key={index} label={condition} size="small" variant="outlined" />
                    ))}
                  </Box>
                </Grid>
              )}

              {examinationData.allergies?.length > 0 && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Allergies:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {examinationData.allergies.map((allergy, index) => (
                      <Chip
                        key={index}
                        label={allergy}
                        size="small"
                        color="warning"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              )}

              {examinationData.family_history?.length > 0 && (
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    Family History:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                    {examinationData.family_history.map((history, index) => (
                      <Chip
                        key={index}
                        label={history}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Vital Signs */}
        {renderSection('Vital Signs', {
          'Heart Rate': examinationData.heart_rate ? `${examinationData.heart_rate} bpm` : null,
          Temperature: examinationData.temperature ? `${examinationData.temperature} °C` : null,
          'Respiratory Rate': examinationData.respiratory_rate
            ? `${examinationData.respiratory_rate} breaths/min`
            : null,
          'O2 Saturation': examinationData.oxygen_saturation
            ? `${examinationData.oxygen_saturation}%`
            : null,
          'Blood Pressure': examinationData.blood_pressure,
          'Time of Measurement': examinationData.time_of_measurement,
        })}

        {/* Visual Acuity */}
        {renderVisualAcuity()}

        {/* Pupil & Motility */}
        {renderSection('Pupil & Ocular Motility', {
          EOM: examinationData.eom,
          'EOM Gaze': examinationData.eom_gaze,
          'EOM Eye': examinationData.eom_eye,
        })}

        {/* IOP */}
        {renderSection('Intraocular Pressure', {
          Method: examinationData.methods?.value,
          'Other Method': examinationData.methods?.other,
          'Left Eye': examinationData.left_eye ? `${examinationData.left_eye} mmHg` : null,
          'Right Eye': examinationData.right_eye ? `${examinationData.right_eye} mmHg` : null,
        })}

        {/* Anterior Segment */}
        {renderAnteriorSegment()}

        {/* Dilation */}
        {renderSection('Dilation', {
          Dilated: examinationData.dilated,
          'Dilation Time': examinationData.dilation_time,
          'Drops Used': examinationData.dilation_drops_used,
        })}

        {/* Posterior Segment */}
        {renderPosteriorSegment()}

        {/* Diagnosis & Plan */}
        {(examinationData.primary_diagnosis || examinationData.plan) && (
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                color: 'primary.main',
                borderBottom: '2px solid',
                borderColor: 'primary.main',
                pb: 1,
              }}
            >
              Diagnosis & Management
            </Typography>

            {examinationData.primary_diagnosis && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Primary Diagnosis:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  {renderRichText(examinationData.primary_diagnosis)}
                </Paper>
              </Box>
            )}

            {examinationData.plan && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Management Plan:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
                  {renderRichText(examinationData.plan)}
                </Paper>
              </Box>
            )}
          </Box>
        )}

        {/* Footer */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Generated on: {new Date().toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: 'right' }}>
              {/* <Typography variant="body2" color="text.secondary">
                Examination ID: {examinationData.id || 'N/A'}
              </Typography> */}
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Action Buttons Footer */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          mt: 3,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
          '@media print': { display: 'none' },
        }}
      >
        <Button onClick={handleBack} variant="outlined">
          Back
        </Button>
        <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
          Print
        </Button>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownload}>
          Download PDF
        </Button>
      </Box>
    </Container>
  );
};

export default ExaminationDataPrint;
