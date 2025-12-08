import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Table,
  TableContainer,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Print as PrintIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { ExaminationData } from '../../shared/api/types/examination.types';
import { PatientService } from '../../shared/api/services/patient.service';

interface ExaminationDataPrintProps {
  consultationId: string;
}

const ExaminationDataPrint: React.FC<ExaminationDataPrintProps> = ({ consultationId }) => {
  const navigate = useNavigate();
  const [examinationData, setExaminationData] = React.useState<ExaminationData | null>(null);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchData = async () => {
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
      } catch (err) {
        console.log('No existing data or error:', err);
        setExaminationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [consultationId]);

  const handlePrint = () => {
    const printContent = document.getElementById('print-examination');

    if (printContent) {
      const printHTML = printContent.innerHTML;

      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Examination Report</title>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  margin: 15px;
                  color: #333;
                  font-size: 12px;
                  line-height: 1.4;
                }
                .print-header {
                  text-align: center;
                  margin-bottom: 20px;
                  border-bottom: 2px solid #1976d2;
                  padding-bottom: 10px;
                }
                .print-header h1 {
                  color: #1976d2;
                  margin: 0 0 5px 0;
                  font-size: 18px;
                }
                .section-title {
                  color: #1976d2;
                  font-weight: 600;
                  margin: 15px 0 8px 0;
                  font-size: 13px;
                  border-bottom: 1px solid #e0e0e0;
                  padding-bottom: 3px;
                }
                .subsection-title {
                  font-weight: 600;
                  margin: 12px 0 5px 0;
                  font-size: 12px;
                  color: #555;
                }
                .data-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 6px;
                  margin: 6px 0;
                }
                .data-item {
                  font-size: 11px;
                }
                .data-label {
                  font-weight: 600;
                  color: #333;
                  display: inline-block;
                  min-width: 120px;
                }
                .data-value {
                  color: #666;
                }
                .empty-value {
                  color: #999;
                  font-style: italic;
                }
                .text-content {
                  background: #f9f9f9;
                  border: 1px solid #ddd;
                  border-radius: 4px;
                  padding: 8px;
                  margin: 5px 0 10px 0;
                  font-size: 11px;
                  min-height: 20px;
                }
                .empty-text {
                  color: #999;
                  font-style: italic;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 8px 0;
                  font-size: 11px;
                }
                th {
                  background-color: #f5f5f5;
                  border: 1px solid #ddd;
                  padding: 5px;
                  text-align: left;
                  font-weight: 600;
                }
                td {
                  border: 1px solid #ddd;
                  padding: 5px;
                }
                .chip-container {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 3px;
                  margin: 3px 0;
                }
                .chip {
                  background: #e3f2fd;
                  border: 1px solid #90caf9;
                  border-radius: 10px;
                  padding: 1px 6px;
                  font-size: 10px;
                  display: inline-block;
                }
                .empty-chip {
                  color: #999;
                  font-style: italic;
                }
                .footer {
                  margin-top: 20px;
                  padding-top: 10px;
                  border-top: 1px dashed #ccc;
                  font-size: 10px;
                  color: #666;
                  text-align: center;
                }
                .page-break {
                  page-break-before: always;
                }
                @media print {
                  body {
                    margin: 10mm;
                    font-size: 11px;
                  }
                }
              </style>
            </head>
            <body>
              <div class="print-header">
                <h1>COMPREHENSIVE EYE EXAMINATION REPORT</h1>
                <div>Consultation ID: ${consultationId} | Generated: ${new Date().toLocaleDateString()}</div>
              </div>
              ${printHTML}
              <div class="footer">
                *** END OF REPORT ***<br>
                This is an electronically generated report. No signature required.
              </div>
            </body>
          </html>
        `);

        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <Typography fontSize="0.875rem">Loading examination data...</Typography>
      </Box>
    );
  }

  if (!examinationData) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography fontSize="0.875rem">No examination data found.</Typography>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mt: 1, fontSize: '0.75rem' }}>
          Go Back
        </Button>
      </Box>
    );
  }

  const formatFieldName = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/Od\b/g, 'OD')
      .replace(/Os\b/g, 'OS')
      .replace(/Ucva/g, 'UCVA')
      .replace(/Scva/g, 'SCVA')
      .replace(/Bcva/g, 'BCVA')
      .replace(/Iop/g, 'IOP')
      .replace(/Eom/g, 'EOM')
      .replace(/Cct/g, 'CCT');
  };

  const renderRichText = (content: string | null) => {
    if (!content || content === '<p><br></p>' || content.trim() === '') {
      return <span style={{ color: '#999', fontStyle: 'italic' }}>Not recorded</span>;
    }
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  };

  const renderValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'Not recorded';
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'None';
    }
    return String(value);
  };

  // Define all sections with their fields
  const sections = {
    'Patient Information & History': [
      'primary_complaint',
      'complaint_details',
      'current_oscular_medication',
      'current_contact_lense_use',
      'lens_type',
      'current_systemic_medication',
      'family_history',
      'systemic_conditions',
      'allergies',
    ],
    'Vital Signs': [
      'heart_rate',
      'blood_pressure',
      'temperature',
      'respiratory_rate',
      'oxygen_saturation',
    ],
    'Distance Visual Acuity': [
      'distance_od_ucva',
      'distance_od_scva',
      'distance_od_bcva',
      'distance_os_ucva',
      'distance_os_scva',
      'distance_os_bcva',
    ],
    'Near Visual Acuity': [
      'near_od_ucva',
      'near_od_scva',
      'near_od_bcva',
      'near_os_ucva',
      'near_os_scva',
      'near_os_bcva',
    ],
    'Pupil Reaction': [
      'pupil_reaction_od_ucva',
      'pupil_reaction_od_scva',
      'pupil_reaction_od_bcva',
      'pupil_reaction_os_ucva',
      'pupil_reaction_os_scva',
      'pupil_reaction_os_bcva',
    ],
    'Ocular Motility': ['eom', 'eom_gaze', 'eom_eye'],
    'Hirschberg Test': ['hirschberg_test', 'hirschberg_test_eye', 'hirschberg_test_deviation'],
    'Cover-Uncover Test': [
      'cover_uncover_test',
      'cover_uncover_test_phoria',
      'cover_uncover_test_tropia',
      'cover_uncover_test_direction',
      'cover_uncover_test_distance',
      'cover_uncover_test_near',
    ],
    Stereopsis: ['stereopsis', 'stereopsis_test'],
    'Intraocular Pressure': ['methods', 'left_eye', 'right_eye', 'time_of_measurement'],
    'Anterior Segment - OD': [
      'lids_od',
      'lashes_od',
      'conjunctiva_od',
      'sclera_od',
      'lacrimal_system_od',
      'cornea_od',
      'anterior_chamber_od',
      'iris_od',
      'lens_od',
      'vitreous_od',
    ],
    'Anterior Segment - OS': [
      'lids_os',
      'lashes_os',
      'conjunctiva_os',
      'sclera_os',
      'lacrimal_system_os',
      'cornea_os',
      'anterior_chamber_os',
      'iris_os',
      'lens_os',
      'vitreous_os',
    ],
    Dilation: ['dilated', 'dilation_time', 'dilation_drops_used'],
    'Posterior Segment - OD': ['optic_disc_od', 'macula_od', 'vessels_od', 'periphery_od'],
    'Posterior Segment - OS': ['optic_disc_os', 'macula_os', 'vessels_os', 'periphery_os'],
    'Diagnosis & Management': ['primary_diagnosis', 'plan'],
  };

  // Function to render a section in the display view
  const renderDisplaySection = (title: string, fields: string[]) => {
    const hasData = fields.some(
      field =>
        examinationData[field as keyof ExaminationData] !== null &&
        examinationData[field as keyof ExaminationData] !== undefined &&
        examinationData[field as keyof ExaminationData] !== '' &&
        (!Array.isArray(examinationData[field as keyof ExaminationData]) ||
          (examinationData[field as keyof ExaminationData] as any[]).length > 0)
    );

    return (
      <Accordion
        defaultExpanded={title === 'Vital Signs' || title === 'Patient Information & History'}
        sx={{
          mb: 1,
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: '4px !important',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            backgroundColor: 'grey.50',
            borderBottom: '1px solid',
            borderColor: 'grey.300',
            minHeight: '40px',
            '& .MuiAccordionSummary-content': {
              margin: '4px 0',
            },
          }}
        >
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: 'primary.main' }}>
            {title}{' '}
            {!hasData && (
              <span style={{ color: '#999', fontSize: '0.8rem', fontWeight: 'normal' }}>
                (No data recorded)
              </span>
            )}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 2 }}>
          {title.includes('Anterior Segment') || title.includes('Posterior Segment') ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <thead>
                  <tr>
                    <th style={{ padding: '6px', fontSize: '0.75rem' }}>Examination</th>
                    <th style={{ padding: '6px', fontSize: '0.75rem' }}>Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map(field => (
                    <tr key={field}>
                      <td style={{ padding: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {formatFieldName(field)}
                      </td>
                      <td
                        style={{
                          padding: '6px',
                          fontSize: '0.75rem',
                          color: examinationData[field as keyof ExaminationData]
                            ? 'inherit'
                            : '#999',
                          fontStyle: examinationData[field as keyof ExaminationData]
                            ? 'normal'
                            : 'italic',
                        }}
                      >
                        {renderValue(examinationData[field as keyof ExaminationData])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          ) : title === 'Diagnosis & Management' ? (
            <Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, mt: 1 }}>
                Primary Diagnosis:
              </Typography>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  fontSize: '0.75rem',
                  minHeight: '40px',
                }}
              >
                {renderRichText(examinationData.primary_diagnosis)}
              </Box>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 1, mt: 2 }}>
                Management Plan:
              </Typography>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'grey.50',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  fontSize: '0.75rem',
                  minHeight: '40px',
                }}
              >
                {renderRichText(examinationData.plan)}
              </Box>
            </Box>
          ) : title.includes('Visual Acuity') ? (
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <thead>
                  <tr>
                    <th style={{ padding: '6px', fontSize: '0.75rem' }}>Eye</th>
                    <th style={{ padding: '6px', fontSize: '0.75rem' }}>UCVA</th>
                    <th style={{ padding: '6px', fontSize: '0.75rem' }}>SCVA</th>
                    <th style={{ padding: '6px', fontSize: '0.75rem' }}>BCVA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                      OD (Right)
                    </td>
                    <td
                      style={{
                        padding: '6px',
                        fontSize: '0.75rem',
                        color: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_od_ucva` as keyof ExaminationData
                        ]
                          ? 'inherit'
                          : '#999',
                        fontStyle: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_od_ucva` as keyof ExaminationData
                        ]
                          ? 'normal'
                          : 'italic',
                      }}
                    >
                      {renderValue(
                        examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_od_ucva` as keyof ExaminationData
                        ]
                      )}
                    </td>
                    <td
                      style={{
                        padding: '6px',
                        fontSize: '0.75rem',
                        color: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_od_scva` as keyof ExaminationData
                        ]
                          ? 'inherit'
                          : '#999',
                        fontStyle: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_od_scva` as keyof ExaminationData
                        ]
                          ? 'normal'
                          : 'italic',
                      }}
                    >
                      {renderValue(
                        examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_od_scva` as keyof ExaminationData
                        ]
                      )}
                    </td>
                    <td
                      style={{
                        padding: '6px',
                        fontSize: '0.75rem',
                        color: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_od_bcva` as keyof ExaminationData
                        ]
                          ? 'inherit'
                          : '#999',
                        fontStyle: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_od_bcva` as keyof ExaminationData
                        ]
                          ? 'normal'
                          : 'italic',
                      }}
                    >
                      {renderValue(
                        examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_od_bcva` as keyof ExaminationData
                        ]
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                      OS (Left)
                    </td>
                    <td
                      style={{
                        padding: '6px',
                        fontSize: '0.75rem',
                        color: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_os_ucva` as keyof ExaminationData
                        ]
                          ? 'inherit'
                          : '#999',
                        fontStyle: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_os_ucva` as keyof ExaminationData
                        ]
                          ? 'normal'
                          : 'italic',
                      }}
                    >
                      {renderValue(
                        examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_os_ucva` as keyof ExaminationData
                        ]
                      )}
                    </td>
                    <td
                      style={{
                        padding: '6px',
                        fontSize: '0.75rem',
                        color: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_os_scva` as keyof ExaminationData
                        ]
                          ? 'inherit'
                          : '#999',
                        fontStyle: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_os_scva` as keyof ExaminationData
                        ]
                          ? 'normal'
                          : 'italic',
                      }}
                    >
                      {renderValue(
                        examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_os_scva` as keyof ExaminationData
                        ]
                      )}
                    </td>
                    <td
                      style={{
                        padding: '6px',
                        fontSize: '0.75rem',
                        color: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_os_bcva` as keyof ExaminationData
                        ]
                          ? 'inherit'
                          : '#999',
                        fontStyle: examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_os_bcva` as keyof ExaminationData
                        ]
                          ? 'normal'
                          : 'italic',
                      }}
                    >
                      {renderValue(
                        examinationData[
                          `${title.includes('Distance') ? 'distance' : 'near'}_os_bcva` as keyof ExaminationData
                        ]
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          ) : title === 'Patient Information & History' ? (
            <Box>
              <Grid container spacing={1.5}>
                {fields.map(field => {
                  const value = examinationData[field as keyof ExaminationData];
                  if (field === 'complaint_details') {
                    return (
                      <Grid size={{ xs: 12 }} key={field}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>
                          Complaint Details:
                        </Typography>
                        <Box
                          sx={{
                            p: 1.5,
                            bgcolor: 'grey.50',
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: 'grey.300',
                            fontSize: '0.75rem',
                            minHeight: '60px',
                          }}
                        >
                          {renderRichText(value as string)}
                        </Box>
                      </Grid>
                    );
                  }
                  if (
                    field === 'family_history' ||
                    field === 'systemic_conditions' ||
                    field === 'allergies'
                  ) {
                    return (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={field}>
                        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, mb: 0.5 }}>
                          {formatFieldName(field)}:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {Array.isArray(value) && value.length > 0 ? (
                            value.map((item: string, index: number) => (
                              <Chip
                                key={index}
                                label={item}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: '24px' }}
                              />
                            ))
                          ) : (
                            <Typography
                              sx={{ fontSize: '0.75rem', color: '#999', fontStyle: 'italic' }}
                            >
                              None recorded
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    );
                  }
                  return (
                    <Grid size={{ xs: 12, sm: 6 }} key={field}>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        {formatFieldName(field)}:
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: '0.75rem',
                          color: value ? 'inherit' : '#999',
                          fontStyle: value ? 'normal' : 'italic',
                        }}
                      >
                        {renderValue(value)}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          ) : (
            <Grid container spacing={1.5}>
              {fields.map(field => (
                <Grid size={{ xs: 12, sm: 6 }} key={field}>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
                    {formatFieldName(field)}:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.75rem',
                      color: examinationData[field as keyof ExaminationData] ? 'inherit' : '#999',
                      fontStyle: examinationData[field as keyof ExaminationData]
                        ? 'normal'
                        : 'italic',
                    }}
                  >
                    {renderValue(examinationData[field as keyof ExaminationData])}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </AccordionDetails>
      </Accordion>
    );
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Visible UI */}
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Examination Report
          </Typography>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
            }}
          >
            Print Full Report
          </Button>
        </Box>

        {/* Hidden print content */}
        <div id="print-examination" style={{ display: 'none' }}>
          {Object.entries(sections).map(([sectionTitle, fields]) => (
            <div key={sectionTitle}>
              <div className="section-title">{sectionTitle}</div>

              {sectionTitle.includes('Anterior Segment') ||
              sectionTitle.includes('Posterior Segment') ? (
                <table>
                  <thead>
                    <tr>
                      <th>Examination</th>
                      <th>Findings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map(field => (
                      <tr key={field}>
                        <td>
                          <strong>{formatFieldName(field)}</strong>
                        </td>
                        <td
                          className={
                            examinationData[field as keyof ExaminationData] ? '' : 'empty-value'
                          }
                        >
                          {renderValue(examinationData[field as keyof ExaminationData])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : sectionTitle === 'Diagnosis & Management' ? (
                <>
                  <div className="subsection-title">Primary Diagnosis:</div>
                  <div className="text-content">
                    {renderRichText(examinationData.primary_diagnosis)}
                  </div>
                  <div className="subsection-title">Management Plan:</div>
                  <div className="text-content">{renderRichText(examinationData.plan)}</div>
                </>
              ) : sectionTitle === 'Patient Information & History' ? (
                <div className="data-grid">
                  {fields.map(field => {
                    const value = examinationData[field as keyof ExaminationData];
                    if (
                      field === 'complaint_details' ||
                      field === 'primary_diagnosis' ||
                      field === 'plan'
                    ) {
                      return null; // These are handled separately
                    }
                    return (
                      <div className="data-item" key={field}>
                        <span className="data-label">{formatFieldName(field)}:</span>
                        <span className={`data-value ${!value ? 'empty-value' : ''}`}>
                          {field === 'family_history' ||
                          field === 'systemic_conditions' ||
                          field === 'allergies' ? (
                            Array.isArray(value) && value.length > 0 ? (
                              <div className="chip-container">
                                {value.map((item: string, index: number) => (
                                  <span key={index} className="chip">
                                    {item}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="empty-chip">None recorded</span>
                            )
                          ) : (
                            renderValue(value)
                          )}
                        </span>
                      </div>
                    );
                  })}
                  {examinationData.complaint_details && (
                    <>
                      <div className="subsection-title">Complaint Details:</div>
                      <div className="text-content">
                        {renderRichText(examinationData.complaint_details)}
                      </div>
                    </>
                  )}
                </div>
              ) : sectionTitle.includes('Visual Acuity') ? (
                <table>
                  <thead>
                    <tr>
                      <th>Eye</th>
                      <th>UCVA</th>
                      <th>SCVA</th>
                      <th>BCVA</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>OD (Right)</strong>
                      </td>
                      <td
                        className={
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_od_ucva` as keyof ExaminationData
                          ]
                            ? ''
                            : 'empty-value'
                        }
                      >
                        {renderValue(
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_od_ucva` as keyof ExaminationData
                          ]
                        )}
                      </td>
                      <td
                        className={
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_od_scva` as keyof ExaminationData
                          ]
                            ? ''
                            : 'empty-value'
                        }
                      >
                        {renderValue(
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_od_scva` as keyof ExaminationData
                          ]
                        )}
                      </td>
                      <td
                        className={
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_od_bcva` as keyof ExaminationData
                          ]
                            ? ''
                            : 'empty-value'
                        }
                      >
                        {renderValue(
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_od_bcva` as keyof ExaminationData
                          ]
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <strong>OS (Left)</strong>
                      </td>
                      <td
                        className={
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_os_ucva` as keyof ExaminationData
                          ]
                            ? ''
                            : 'empty-value'
                        }
                      >
                        {renderValue(
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_os_ucva` as keyof ExaminationData
                          ]
                        )}
                      </td>
                      <td
                        className={
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_os_scva` as keyof ExaminationData
                          ]
                            ? ''
                            : 'empty-value'
                        }
                      >
                        {renderValue(
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_os_scva` as keyof ExaminationData
                          ]
                        )}
                      </td>
                      <td
                        className={
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_os_bcva` as keyof ExaminationData
                          ]
                            ? ''
                            : 'empty-value'
                        }
                      >
                        {renderValue(
                          examinationData[
                            `${sectionTitle.includes('Distance') ? 'distance' : 'near'}_os_bcva` as keyof ExaminationData
                          ]
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <div className="data-grid">
                  {fields.map(field => (
                    <div className="data-item" key={field}>
                      <span className="data-label">{formatFieldName(field)}:</span>
                      <span
                        className={`data-value ${!examinationData[field as keyof ExaminationData] ? 'empty-value' : ''}`}
                      >
                        {renderValue(examinationData[field as keyof ExaminationData])}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Display all sections in accordions */}
        <Box sx={{ mt: 2 }}>
          {Object.entries(sections).map(([title, fields]) => renderDisplaySection(title, fields))}
        </Box>
      </Paper>

      {/* Back Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)} sx={{ fontSize: '0.875rem' }}>
          Back
        </Button>
      </Box>
    </Box>
  );
};

export default ExaminationDataPrint;
