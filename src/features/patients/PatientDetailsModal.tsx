// src/components/patients/PatientDetailsModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Avatar,
  Stack,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  Phone,
  Email,
  CalendarToday,
  Transgender,
  LocationOn,
  Height,
  Bloodtype,
  Category,
  Person,
  CreditCard,
} from '@mui/icons-material';
import { format } from 'date-fns';

interface Patient {
  id: string;
  full_name: string;
  emr_number: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string | null;
  address: { city: string; kifle_ketema: string; wereda: string };
  blood_type: string | null;
  height: string | null;
  weight: string | null;
  national_id: string | null;
  passport_number: string | null;
  age: number;
  patient_category: { name: string; color: string };
  visit_type: string;
  flags: {
    active_patient: boolean;
    requires_payment: boolean;
    has_pending_bills: boolean;
    has_unpaid_bills: boolean;
  };
}

interface PatientDetailsModalProps {
  open: boolean;
  onClose: () => void;
  patient: Patient | null;
}

const PatientDetailsModal: React.FC<PatientDetailsModalProps> = ({ open, onClose, patient }) => {
  if (!patient) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white', py: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                width: 56,
                height: 56,
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              {getInitials(patient.full_name)}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {patient.full_name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                EMR: {patient.emr_number} • Age: {patient.age} years
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: 'grey.50' }}>
        <Grid container spacing={3} height='100%'>      
          {/* Basic Info */}
          <Grid size={{xs:12, md:6, }} sx={{height: '100%'}}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Personal Information
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarToday fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {format(new Date(patient.date_of_birth), 'dd MMMM yyyy')}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Transgender fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Gender</Typography>
                    <Typography variant="body1" fontWeight="medium">{patient.gender}</Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Phone fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Phone</Typography>
                    <Typography variant="body1" fontWeight="medium">{patient.phone}</Typography>
                  </Box>
                </Box>

                {patient.email && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Email fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1" fontWeight="medium">{patient.email}</Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Address & Category */}
          <Grid size={{xs:12, md:6}} sx={{height:'100%'}}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 , height: '100%'}}>
              <Typography variant="h6" gutterBottom color="primary">
                Address & Category
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <LocationOn fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Address</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {patient.address.city}, {patient.address.kifle_ketema}, Wereda {patient.address.wereda}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Category fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Patient Category</Typography>
                    <Chip
                      label={patient.patient_category.name}
                      size="small"
                      sx={{
                        bgcolor: patient.patient_category.color + '22',
                        color: patient.patient_category.color,
                        fontWeight: 'bold',
                      }}
                    />
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Person fontSize="small" color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Visit Type</Typography>
                    <Chip
                      label={patient.visit_type}
                      color={patient.visit_type === 'New' ? 'success' : 'info'}
                      size="small"
                    />
                  </Box>
                </Box>
              </Stack>
            </Paper>
          </Grid>


          {/* Medical Info */}
          <Grid size={{xs:12, md:6}}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Medical Profile
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2}>
                {patient.blood_type && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Bloodtype fontSize="small" color="error" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Blood Type</Typography>
                      <Typography variant="body1" fontWeight="bold" color="error.dark">
                        {patient.blood_type}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {patient.height && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Height fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Height</Typography>
                      <Typography variant="body1" fontWeight="medium">{patient.height} cm</Typography>
                    </Box>
                  </Box>
                )}

                {patient.national_id && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <CreditCard fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">National ID</Typography>
                      <Typography variant="body1" fontWeight="medium">{patient.national_id}</Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Flags */}
          <Grid size={{xs:12, md:6}}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom color="primary">
                Status & Flags
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Chip
                  label="Active Patient"
                  color={patient.flags.active_patient ? 'success' : 'default'}
                  size="small"
                />
                {patient.flags.requires_payment && (
                  <Chip label="Payment Required" color="warning" size="small" />
                )}
                {patient.flags.has_pending_bills && (
                  <Chip label="Pending Bills" color="error" size="small" />
                )}
                {patient.flags.has_unpaid_bills && (
                  <Chip label="Unpaid Bills" color="error" size="small" />
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetailsModal;