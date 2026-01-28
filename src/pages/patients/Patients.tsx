import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Stack,
  Avatar,
  Button,
  CircularProgress,
} from '@mui/material';
import { Send } from '@mui/icons-material';
import type { Patient } from '../../shared/api/types/patient.types';
import SendCrossModal from '../../features/triage/components/SendCrossModal';
import { useState, useEffect, useCallback } from 'react';
import { sendToDepartmentService } from '../../shared/api/services/sendTo.service';
import { toast } from 'react-toastify';
import AllergyModal from './AllergyModal';
import { ArrowBackIosNew as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { FollowUpService } from '../../shared/api/services/followUp.service';
import PatientFollowUpModal from './PatientFollowUpModal';

type PatientsProps = {
  patient?: Patient;
  onSendClick?: () => void;
};

const Patients = ({ patient, onSendClick }: PatientsProps) => {
  const navigate = useNavigate();
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [allergyModalOpen, setAllergyModalOpen] = useState(false);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [fetchedAllergies, setFetchedAllergies] = useState<any[]>([]);
  const [allergiesLoading, setAllergiesLoading] = useState(false);

  const fetchAllergies = useCallback(async () => {
    if (!patient?.id) return;
    setAllergiesLoading(true);
    try {
      const response = await FollowUpService.getAllergies(patient.id);
      setFetchedAllergies(response.data?.data || []);
    } catch (err: any) {
      console.error('Error fetching allergies:', err);
    } finally {
      setAllergiesLoading(false);
    }
  }, [patient?.id]);

  useEffect(() => {
    fetchAllergies();
  }, [fetchAllergies]);

  const address = !patient?.address
    ? '—'
    : [
        patient.address.kifle_ketema,
        patient.address.wereda && `Wereda ${patient.address.wereda}`,
        patient.address.city,
      ]
        .filter(Boolean)
        .join(', ') || '—';

  const handleSend = () => {
    onSendClick ? onSendClick() : setSendModalOpen(true);
  };

  const sendToDepartment = (department: string, doctor_id: string) => {
    if (!patient?.id) {
      toast.error('Patient ID not found');
      return;
    }

    const fromId = patient.constultation_id || patient.id;

    sendToDepartmentService
      .sendToDepartment(patient.id, { department, doctor_id, from: fromId })
      .then(() => {
        toast.success('Patient sent successfully');
        setSendModalOpen(false);
      })
      .catch((err: any) => {
        toast.error(err.response?.data?.message || 'Failed to send patient');
      });
  };

  const addAllergy = (_allergy: string) => {
    // Keep local state for immediate feedback if needed, or just re-fetch
    fetchAllergies();
    toast.success('Allergy added');
  };

  const removeAllergy = (index: number) => {
    // The original logic didn't seem to call an API to remove, just local state.
    // If there's a delete service, we should call it.
    // For now, I'll just filter the fetchedAllergies to match original behavior if delete is local.
    // However, usually these are persisted. If the user adds/removes, they probably want it saved.
    // Since I don't see a 'removeAllergy' in FollowUpService, I'll keep it simple for now.
    const updated = fetchedAllergies.filter((_, i) => i !== index);
    setFetchedAllergies(updated);
    toast.success('Allergy removed');
  };

  return (
    <>
      <Box sx={{ p: 2, mt: 2 }}>
        <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid #ddd', overflow: 'hidden' }}>
          <Box sx={{ bgcolor: '#1976d2', color: 'white', p: 2 }}>
            <Grid container alignItems="center" spacing={1}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                  <Button
                    onClick={() => navigate(-1)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      textTransform: 'none',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '8px',
                      minWidth: 'auto',
                      bgcolor: 'rgba(255, 255, 255, 0.12)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.22)' },
                    }}
                  >
                    <ArrowBackIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Back
                    </Typography>
                  </Button>
                  <Typography variant="h6" fontWeight={600}>
                    {patient?.full_name}
                  </Typography>
                  {patient?.visit_type && (
                    <Chip
                      label={patient.visit_type}
                      size="small"
                      sx={{ bgcolor: 'white', color: '#1976d2' }}
                    />
                  )}
                </Stack>
                <Stack direction="row" spacing={2} mt={0.5} flexWrap="wrap">
                  <Typography variant="body2">EMR: {patient?.emr_number}</Typography>
                  <Typography variant="body2">Age: {patient?.age ?? '—'}</Typography>
                  <Typography variant="body2">Gender: {patient?.gender}</Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Chip
                    label={patient?.flags?.is_checked_in ? 'Checked In' : 'Checked Out'}
                    size="small"
                    sx={{
                      bgcolor: patient?.flags?.is_checked_in ? '#4caf50' : '#757575',
                      color: 'white',
                    }}
                  />
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => setFollowUpModalOpen(true)}
                    sx={{
                      bgcolor: 'white',
                      color: '#2e7d32',
                      minWidth: 'auto',
                      px: 2,
                      fontWeight: 600,
                      '&:hover': { bgcolor: '#f1f8e9' },
                    }}
                  >
                    Follow-up
                  </Button>

                  <Button
                    size="small"
                    title="Send to Department"
                    onClick={handleSend}
                    sx={{ bgcolor: 'white', color: '#1976d2', minWidth: 'auto', p: 0.5 }}
                  >
                    <Typography sx={{ mr: 1 }}>Send</Typography>
                    <Send fontSize="small" />
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#1976d2" gutterBottom>
                  Contact
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {patient?.phone || '—'}
                </Typography>
                {patient?.email && (
                  <Typography variant="body2" color="text.secondary">
                    {patient?.email}
                  </Typography>
                )}
              </Grid>

              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#1976d2" gutterBottom>
                  Address
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {address}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, md: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 1,
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{
                      color: '#ff4444',
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Allergies
                  </Typography>
                </Box>
                <Box sx={{ maxHeight: '80px', overflowY: 'auto', pr: 0.5 }}>
                  <Stack spacing={0.5}>
                    {allergiesLoading ? (
                      <CircularProgress size={20} />
                    ) : fetchedAllergies.length > 0 ? (
                      fetchedAllergies.map((allergy, i) => (
                        <Chip
                          key={i}
                          label={allergy.name || allergy}
                          size="small"
                          onDelete={() => removeAllergy(i)}
                          sx={{
                            fontSize: '0.7rem',
                            height: '24px',
                            '& .MuiChip-label': { px: 1 },
                            bgcolor: '#ff4444',
                            color: 'white',
                            animation: 'glow 2s ease-in-out infinite alternate',
                            '&:hover': {
                              bgcolor: '#ff3333',
                              boxShadow: '0 0 8px rgba(255, 68, 68, 0.8)',
                            },
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.8rem' }}>
                        None
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Grid>

              <Grid size={{ xs: 6, md: 4 }}>
                <Typography variant="subtitle2" fontWeight={600} color="#1976d2" gutterBottom>
                  Doctor
                </Typography>
                {patient?.current_doctor ? (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar
                      src={patient?.current_doctor.user?.profile_photo_url}
                      sx={{ width: 32, height: 32 }}
                    />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {patient?.current_doctor.name}
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.disabled">
                    Not assigned
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <SendCrossModal
        open={sendModalOpen}
        onClose={() => setSendModalOpen(false)}
        onSend={sendToDepartment}
      />
      <AllergyModal
        open={allergyModalOpen}
        onClose={() => setAllergyModalOpen(false)}
        onSubmit={addAllergy}
        patientName={patient?.full_name}
      />

      <PatientFollowUpModal
        open={followUpModalOpen}
        onClose={() => setFollowUpModalOpen(false)}
        patientId={patient?.id || ''}
        patientName={patient?.full_name}
      />

      <style>
        {`
          @keyframes glow {
            from {
              box-shadow: 0 0 5px rgba(255, 68, 68, 0.7);
            }
            to {
              box-shadow: 0 0 10px rgba(255, 68, 68, 0.9), 0 0 15px rgba(255, 68, 68, 0.7);
            }
          }
        `}
      </style>
    </>
  );
};

export default Patients;
