import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import {
  Description,
  MedicalServices,
  Assignment,
  Comment,
  Close,
  Visibility,
  Speed,
  Person,
  CalendarToday,
  Email,
  Phone,
  LocationOn,
  Fingerprint,
  Scale,
  Female,
  Male,
  Cake,
  Bloodtype,
  Straighten,
  MonitorHeart
} from '@mui/icons-material';

interface Patient {
  id: string;
  full_name: string;
  emr_number: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  address: {
    city: string;
    kifle_ketema: string;
    wereda: string;
  };
  blood_type: string | null;
  height: number | null;
  weight: string;
  national_id: string;
  age: number;
  current_doctor?: {
    name: string;
    phone: string;
    email: string;
  };
  visit_type: string;
}

export interface FollowUpNote {
  id: string;
  patient_id: string;
  od_s_correction: string;
  od_c_correction: string;
  od_iop: string; // Changed from number to string
  od_cct: string;
  os_s_correction: string;
  os_c_correction: string;
  os_iop: string; // Changed from number to string
  os_cct: string;
  examination_findings: string;
  plan: string;
  remark: string;
  diagnosis: string;
  created_at: string;
  updated_at: string;
  patient?: Patient;
}

interface ViewFollowUpModalProps {
  open: boolean;
  onClose: () => void;
  selectedFollowUp: FollowUpNote | null;
}

// Helper Components
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: any;
  isCritical?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, isCritical }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
      {icon}
      <Typography variant="body2" color="text.secondary">
        {label}:
      </Typography>
    </Box>
    <Typography 
      variant="body2" 
      fontWeight="medium"
      color={isCritical ? 'error.main' : 'text.primary'}
      sx={{ flex: 1, textAlign: 'right' }}
    >
      {value || 'N/A'}
    </Typography>
  </Box>
);

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  content?: string;
  simple?: boolean;
  children?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ icon, title, content, simple, children }) => (
  <Paper variant={simple ? "outlined" : "elevation"} elevation={simple ? 0 : 1} sx={{ p: 3, borderRadius: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: content ? 2 : 0 }}>
      {icon}
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
    </Box>
    {content ? (
      <div dangerouslySetInnerHTML={{ __html: content || 'N/A' }} />
    ) : (
      children
    )}
  </Paper>
);

// Format date function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ViewFollowUpModal: React.FC<ViewFollowUpModalProps> = ({ open, onClose, selectedFollowUp }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{
      sx: { borderRadius: 2, maxHeight: '90vh' }
    }}>
      <DialogTitle sx={{ 
        borderBottom: 1, 
        borderColor: 'divider',
        bgcolor: 'background.paper',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Visibility color="primary" />
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Follow-up Note Details
            </Typography>
            {selectedFollowUp && (
              <Typography variant="body2" color="text.secondary">
                Created: {formatDateTime(selectedFollowUp.created_at)} • 
                Updated: {formatDateTime(selectedFollowUp.updated_at)}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {selectedFollowUp && (
          <Box sx={{ pt: 1 }}>
            {/* Patient Information Section */}
            {selectedFollowUp.patient && (
              <>
                <SectionCard 
                  icon={<Person />}
                  title="Patient Information"
                  simple
                >
                  <Grid container spacing={3}>
                    <Grid size={{xs:12, md:6}}>
                      <InfoRow icon={<Person />} label="Full Name" value={selectedFollowUp.patient.full_name} />
                      <InfoRow icon={<Fingerprint />} label="EMR Number" value={selectedFollowUp.patient.emr_number} />
                      <InfoRow icon={<CalendarToday />} label="Date of Birth" value={formatDate(selectedFollowUp.patient.date_of_birth)} />
                      <InfoRow 
                        icon={selectedFollowUp.patient.gender === 'Female' ? <Female /> : <Male />} 
                        label="Gender" 
                        value={selectedFollowUp.patient.gender} 
                      />
                      <InfoRow icon={<Cake />} label="Age" value={`${selectedFollowUp.patient.age} years`} />
                    </Grid>
                    <Grid size={{xs:12, md:6}}>
                      <InfoRow icon={<Phone />} label="Phone" value={selectedFollowUp.patient.phone} />
                      <InfoRow icon={<Email />} label="Email" value={selectedFollowUp.patient.email} />
                      <InfoRow icon={<Scale />} label="Weight" value={`${selectedFollowUp.patient.weight} kg`} />
                      <InfoRow icon={<Bloodtype />} label="Blood Type" value={selectedFollowUp.patient.blood_type} />
                      <InfoRow icon={<Fingerprint />} label="National ID" value={selectedFollowUp.patient.national_id} />
                    </Grid>
                    <Grid size={12}>
                      <InfoRow 
                        icon={<LocationOn />} 
                        label="Address" 
                        value={
                          selectedFollowUp.patient.address ? 
                          `${selectedFollowUp.patient.address.city}, ${selectedFollowUp.patient.address.kifle_ketema}, Wereda ${selectedFollowUp.patient.address.wereda}` 
                          : 'N/A'
                        } 
                      />
                    </Grid>
                    {selectedFollowUp.patient.current_doctor && (
                      <Grid size={12}>
                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Current Doctor
                          </Typography>
                          <InfoRow icon={<Person />} label="Name" value={selectedFollowUp.patient.current_doctor.name} />
                          <InfoRow icon={<Phone />} label="Phone" value={selectedFollowUp.patient.current_doctor.phone} />
                          <InfoRow icon={<Email />} label="Email" value={selectedFollowUp.patient.current_doctor.email} />
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </SectionCard>
                
                <Box sx={{ my: 3 }}>
                  <Divider />
                </Box>
              </>
            )}

            {/* Eye Measurements Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* OD Section */}
              <Grid size={{xs:12, md:6}}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                        OD
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      Right Eye Measurements
                    </Typography>
                  </Box>
                  
                  <InfoRow icon={<Visibility />} label="S Correction" value={selectedFollowUp.od_s_correction} />
                  <InfoRow icon={<Visibility />} label="C Correction" value={selectedFollowUp.od_c_correction} />
                  <InfoRow 
                    icon={<Speed sx={{ fontSize: 20 }} />} 
                    label="IOP" 
                    value={selectedFollowUp.od_iop}
                    // isCritical={selectedFollowUp.od_iop && parseFloat(selectedFollowUp.od_iop) > 21}
                  />
                  <InfoRow icon={<Straighten />} label="CCT" value={selectedFollowUp.od_cct} />
                </Paper>
              </Grid>

              {/* OS Section */}
              <Grid size={{xs:12, md:6}}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ 
                      width: 32, 
                      height: 32, 
                      borderRadius: '50%', 
                      bgcolor: 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}>
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 'bold' }}>
                        OS
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      Left Eye Measurements
                    </Typography>
                  </Box>
                  
                  <InfoRow icon={<Visibility />} label="S Correction" value={selectedFollowUp.os_s_correction} />
                  <InfoRow icon={<Visibility />} label="C Correction" value={selectedFollowUp.os_c_correction} />
                  <InfoRow 
                    icon={<Speed sx={{ fontSize: 20 }} />} 
                    label="IOP" 
                    value={selectedFollowUp.os_iop}
                    // isCritical={selectedFollowUp.os_iop && parseFloat(selectedFollowUp.os_iop) > 21}
                  />
                  <InfoRow icon={<Straighten />} label="CCT" value={selectedFollowUp.os_cct} />
                </Paper>
              </Grid>
            </Grid>

            {/* Rich Text Content Sections */}
            <Grid container spacing={3}>
              <Grid size={12}>
                <SectionCard 
                  icon={<Description />}
                  title="Examination Findings"
                  content={selectedFollowUp.examination_findings}
                />
              </Grid>

              <Grid size={12}>
                <SectionCard 
                  icon={<MedicalServices />}
                  title="Diagnosis"
                  content={selectedFollowUp.diagnosis}
                />
              </Grid>

              <Grid size={12}>
                <SectionCard 
                  icon={<Assignment />}
                  title="Plan"
                  content={selectedFollowUp.plan}
                />
              </Grid>

              {selectedFollowUp.remark && (
                <Grid size={12}>
                  <SectionCard 
                    icon={<Comment />}
                    title="Remark"
                    content={selectedFollowUp.remark}
                  />
                </Grid>
              )}
            </Grid>

            {/* Additional Metadata */}
            <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid size={{xs:12, md:6}}>
                  <Chip 
                    icon={<CalendarToday />}
                    label={`Created: ${formatDateTime(selectedFollowUp.created_at)}`}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                <Grid size={{xs:12, md:6}}>
                  <Chip 
                    icon={<CalendarToday />}
                    label={`Updated: ${formatDateTime(selectedFollowUp.updated_at)}`}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                {selectedFollowUp.patient && (
                  <Grid size={12}>
                    <Chip 
                      icon={<MonitorHeart />}
                      label={`Visit Type: ${selectedFollowUp.patient.visit_type}`}
                      color="primary"
                      variant="outlined"
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} variant="contained" startIcon={<Close />}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewFollowUpModal;