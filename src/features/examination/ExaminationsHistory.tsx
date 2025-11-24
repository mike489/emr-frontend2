import React from 'react';
import { Box, Typography, Grid, Paper, Divider, Chip } from '@mui/material';
import {
  History,
  RecordVoiceOver,
  RemoveRedEye,
  Speed,
  AccessTime,
  MedicalServices,
  Assignment,
  Visibility,
  Favorite,
  Thermostat,
  AccessibilityNew,
  Opacity,
  Bloodtype,
  Medication,
  FamilyRestroom,
  Warning,
  Contactless,
  VisibilityOff,
  PanTool,
  TrackChanges,
  LensBlur,
  Adjust,
} from '@mui/icons-material';
import type { ExaminationData } from '../../shared/api/types/examination.types';

interface PreviousHistoryModalProps {
  data: ExaminationData | null;
}

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: any;
  critical?: boolean;
}> = ({ icon, label, value, critical }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
    </Box>
    <Typography
      variant="body2"
      fontWeight="medium"
      color={critical ? 'error.main' : 'text.primary'}
      sx={{ textAlign: 'left', justifySelf: 'flex-start' }}
    >
      {value || 'N/A'}
    </Typography>
  </Box>
);

const SectionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  simple?: boolean;
}> = ({ icon, title, children, simple }) => (
  <Paper
    variant={simple ? 'outlined' : 'elevation'}
    elevation={simple ? 0 : 2}
    sx={{ p: 3, borderRadius: 2 }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      {icon}
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
    </Box>
    {children}
  </Paper>
);

const ExaminationsHistory: React.FC<PreviousHistoryModalProps> = ({ data }) => {
  if (!data) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No examination data found.</Typography>
      </Box>
    );
  }

  const exam = data; // shortcut

  return (
    <Box>
      <Box
        sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper', py: 2, px: 3 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <History color="primary" />
          <Typography variant="h5" fontWeight="bold">
            Complete Previous Examination History
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Chief Complaint */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard
              icon={<RecordVoiceOver color="primary" />}
              title="Primary Complaint"
              simple
            >
              <Typography
                variant="body1"
                sx={{ whiteSpace: 'normal' }}
                dangerouslySetInnerHTML={{
                  __html: exam.primary_complaint || '<i>Not specified</i>',
                }}
              ></Typography>
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard
              icon={<Typography fontWeight="bold">?</Typography>}
              title="Complaint Details"
              simple
            >
              <Typography
                variant="body1"
                sx={{ whiteSpace: 'normal' }}
                dangerouslySetInnerHTML={{
                  __html: exam.complaint_details || '<i>Not specified</i>',
                }}
              ></Typography>
            </SectionCard>
          </Grid>

          {/* Medications & Allergies */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard
              icon={<Medication color="info" />}
              title="Current Ocular Medication"
              simple
            >
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: exam.current_oscular_medication || '<i>None</i>',
                }}
              ></Typography>
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard
              icon={<Medication color="info" />}
              title="Current Systemic Medication"
              simple
            >
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{
                  __html: exam.current_systemic_medication || '<i>None</i>',
                }}
              ></Typography>
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard icon={<Warning color="error" />} title="Allergies" simple>
              {exam.allergies && exam.allergies.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {exam.allergies.map((a, i) => (
                    <Chip key={i} label={a} color="error" size="small" />
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No known allergies</Typography>
              )}
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard icon={<Contactless color="success" />} title="Contact Lens Use" simple>
              <Typography
                fontWeight="bold"
                color={exam.current_contact_lense_use ? 'success.main' : 'text.secondary'}
              >
                {exam.current_contact_lense_use
                  ? `Yes - ${exam.lens_type || 'Type not specified'}`
                  : 'Not using contact lenses'}
              </Typography>
            </SectionCard>
          </Grid>

          {/* Visual Acuity - Distance */}
          <Grid size={12}>
            <SectionCard icon={<RemoveRedEye color="primary" />} title="Distance Visual Acuity">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      <Box
                        component="span"
                        sx={{
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1,
                        }}
                      >
                        OD
                      </Box>
                      Right Eye
                    </Typography>
                    <InfoRow icon={<Visibility />} label="UCVA" value={exam.distance_od_ucva} />
                    <InfoRow icon={<Visibility />} label="SCVA" value={exam.distance_od_scva} />
                    <InfoRow icon={<Visibility />} label="BCVA" value={exam.distance_od_bcva} />
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      <Box
                        component="span"
                        sx={{
                          bgcolor: 'secondary.main',
                          color: 'white',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1,
                        }}
                      >
                        OS
                      </Box>
                      Left Eye
                    </Typography>
                    <InfoRow icon={<Visibility />} label="UCVA" value={exam.distance_os_ucva} />
                    <InfoRow icon={<Visibility />} label="SCVA" value={exam.distance_os_scva} />
                    <InfoRow icon={<Visibility />} label="BCVA" value={exam.distance_os_bcva} />
                  </Paper>
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>

          {/* Near Visual Acuity */}
          {exam.near_od_ucva || exam.near_os_ucva ? (
            <Grid size={12}>
              <SectionCard icon={<VisibilityOff />} title="Near Visual Acuity">
                <Grid container spacing={3}>
                  <Grid size={6}>
                    <InfoRow icon={<Visibility />} label="OD UCVA" value={exam.near_od_ucva} />
                  </Grid>
                  <Grid size={6}>
                    <InfoRow icon={<Visibility />} label="OS UCVA" value={exam.near_os_ucva} />
                  </Grid>
                  <Grid size={6}>
                    <InfoRow icon={<Visibility />} label="OD SCVA" value={exam.near_od_scva} />
                  </Grid>
                  <Grid size={6}>
                    <InfoRow icon={<Visibility />} label="OS SCVA" value={exam.near_os_scva} />
                  </Grid>
                  <Grid size={6}>
                    <InfoRow icon={<Visibility />} label="OD BCVA" value={exam.near_od_bcva} />
                  </Grid>
                  <Grid size={6}>
                    <InfoRow icon={<Visibility />} label="OS BCVA" value={exam.near_os_bcva} />
                  </Grid>
                </Grid>
              </SectionCard>
            </Grid>
          ) : null}

          {/* Intraocular Pressure */}
          {(exam.right_eye || exam.left_eye) && (
            <Grid size={12}>
              <SectionCard icon={<Speed color="warning" />} title="Intraocular Pressure (IOP)">
                <Grid container spacing={2}>
                  <Grid size={4}>
                    <InfoRow
                      icon={<TrackChanges />}
                      label="Method"
                      value={exam.methods?.value || exam.methods}
                    />
                  </Grid>
                  <Grid size={4}>
                    <InfoRow
                      icon={<Box sx={{ fontWeight: 'bold', color: 'primary.main' }}>OD</Box>}
                      label="Right Eye"
                      value={exam.right_eye ? `${exam.right_eye} mmHg` : 'N/A'}
                    />
                  </Grid>
                  <Grid size={4}>
                    <InfoRow
                      icon={<Box sx={{ fontWeight: 'bold', color: 'secondary.main' }}>OS</Box>}
                      label="Left Eye"
                      value={exam.left_eye ? `${exam.left_eye} mmHg` : 'N/A'}
                    />
                  </Grid>
                  {exam.time_of_measurement && (
                    <Grid size={12}>
                      <InfoRow
                        icon={<AccessTime />}
                        label="Time Measured"
                        value={exam.time_of_measurement}
                      />
                    </Grid>
                  )}
                </Grid>
              </SectionCard>
            </Grid>
          )}

          {/* Vital Signs */}
          <Grid size={12}>
            <SectionCard icon={<Favorite color="error" />} title="Vital Signs">
              <Grid container spacing={2}>
                {/* Desktop: 5 columns | Tablet: 3 | Mobile: 2 or 1 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoRow
                    icon={<Favorite color="error" />}
                    label="Heart Rate"
                    value={exam.heart_rate ? `${exam.heart_rate} bpm` : '—'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoRow
                    icon={<Thermostat color="warning" />}
                    label="Temperature"
                    value={exam.temperature || '—'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoRow
                    icon={<AccessibilityNew color="info" />}
                    label="Respiratory Rate"
                    value={exam.respiratory_rate ? `${exam.respiratory_rate}/min` : '—'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoRow
                    icon={<Opacity color="success" />}
                    label="SpO₂"
                    value={exam.oxygen_saturation || '—'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <InfoRow
                    icon={<Bloodtype color="error" />}
                    label="Blood Pressure"
                    value={exam.blood_pressure ? `${exam.blood_pressure} mmHg` : '—'}
                  />
                </Grid>
              </Grid>
            </SectionCard>
          </Grid>

          {/* Anterior Segment Findings */}
          <Grid size={12}>
            <SectionCard icon={<LensBlur />} title="Anterior Segment Examination">
              <Grid container spacing={2}>
                {[
                  'lids',
                  'lashes',
                  'conjunctiva',
                  'sclera',
                  'cornea',
                  'anterior_chamber',
                  'iris',
                  'lens',
                ].map(part => (
                  <Grid size={{ xs: 12, md: 6 }} key={part}>
                    <Typography variant="subtitle2" gutterBottom>
                      {part.charAt(0).toUpperCase() + part.slice(1)}
                    </Typography>
                    <InfoRow
                      icon={<PanTool />}
                      label="OD"
                      value={exam[`${part}_od` as keyof typeof exam] || 'Normal'}
                    />
                    <InfoRow
                      icon={<PanTool />}
                      label="OS"
                      value={exam[`${part}_os` as keyof typeof exam] || 'Normal'}
                    />
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                ))}
              </Grid>
            </SectionCard>
          </Grid>

          {/* Posterior Segment (if dilated) */}
          {exam.dilated && (
            <Grid size={12}>
              <SectionCard icon={<Adjust color="success" />} title="Fundus Examination (Dilated)">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Dilated at: {exam.dilation_time} with {exam.dilation_drops_used}
                </Typography>
                <Grid container spacing={2}>
                  {['optic_disc', 'macula', 'vessels', 'periphery'].map(part => (
                    <React.Fragment key={part}>
                      <Grid size={6}>
                        <InfoRow
                          icon={<Visibility />}
                          label={`${part.replace('_', ' ')} OD`}
                          value={exam[`${part}_od` as keyof typeof exam] || 'Normal'}
                        />
                      </Grid>
                      <Grid size={6}>
                        <InfoRow
                          icon={<Visibility />}
                          label={`${part.replace('_', ' ')} OS`}
                          value={exam[`${part}_os` as keyof typeof exam] || 'Normal'}
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              </SectionCard>
            </Grid>
          )}

          {/* Diagnosis & Plan */}
          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard
              icon={<MedicalServices color="success" />}
              title="Primary Diagnosis"
              simple
            >
              <Box
                sx={{ whiteSpace: 'normal' }}
                dangerouslySetInnerHTML={{
                  __html: exam.primary_diagnosis || '<i>Not specified</i>',
                }}
              />
            </SectionCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <SectionCard icon={<Assignment color="info" />} title="Management Plan" simple>
              <Box
                sx={{ whiteSpace: 'normal' }}
                dangerouslySetInnerHTML={{
                  __html: exam.plan || '<i>Not specified</i>',
                }}
              />
            </SectionCard>
          </Grid>

          {/* Family History */}
          {exam.family_history && exam.family_history.length > 0 && (
            <Grid size={12}>
              <SectionCard icon={<FamilyRestroom />} title="Family History">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {exam.family_history.map((item, i) => (
                    <Box
                      key={i}
                      sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'background.paper',
                      }}
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  ))}
                </Box>
              </SectionCard>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ExaminationsHistory;
