import { Box, Typography, Paper, Grid, Chip, Divider, Stack, Avatar } from '@mui/material';
import type { Patient } from '../../shared/api/types/patient.types';

type PatientsProps = {
  patient: Patient;
};

const Patients = ({ patient }: PatientsProps) => {
  const formatAddress = () => {
    if (!patient.address) return '—';
    const parts = [
      patient.address.kifle_ketema,
      patient.address.wereda && `Wereda ${patient.address.wereda}`,
      patient.address.city,
    ].filter(Boolean);
    return parts.length ? parts.join(', ') : '—';
  };

  return (
    <Box sx={{ px: 2, pt: 3 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, primary.main 0%, primary.dark 100%)',
            color: 'text.primary',
            px: { xs: 3, sm: 4 },
            py: 3,
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            },
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            {/* Left: Name + Badges */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    letterSpacing: -0.5,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {patient.full_name}
                </Typography>

                {/* Visit Type Badge */}
                {patient.visit_type && (
                  <Chip
                    label={patient.visit_type}
                    color="secondary"
                    size="small"
                    sx={{
                      fontWeight: 600,
                      bgcolor: 'white',
                      color: 'primary.main',
                      border: '1px solid',
                      borderColor: 'rgba(255,255,255,0.3)',
                    }}
                  />
                )}

                {/* Patient Category */}
                {patient.patient_category && (
                  <Chip
                    label={patient.patient_category.name}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      bgcolor: patient.patient_category.color || 'grey.600',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                )}
              </Stack>

              <Stack
                direction="row"
                spacing={3}
                mt={2}
                flexWrap="wrap"
                useFlexGap
                sx={{ opacity: 0.95 }}
              >
                <Typography variant="body1" fontWeight={500}>
                  EMR: <strong>{patient.emr_number}</strong>
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  Age: <strong>{patient.age ?? '—'}</strong>
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  Gender: <strong>{patient.gender}</strong>
                </Typography>
                {patient.national_id && (
                  <Typography variant="body1" fontWeight={500}>
                    NID: <strong>{patient.national_id}</strong>
                  </Typography>
                )}
              </Stack>
            </Grid>

            {/* Right: Status Flags */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  spacing={2}
                  justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                >
                  <Chip
                    label={patient.flags?.is_checked_in ? 'Checked In' : 'Checked Out'}
                    color={patient.flags?.is_checked_in ? 'success' : 'default'}
                    variant="filled"
                    size="medium"
                    sx={{
                      minWidth: 120,
                      fontWeight: 600,
                      bgcolor: patient.flags?.is_checked_in ? 'success.main' : 'grey.400',
                      color: 'white',
                    }}
                  />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Section - Details */}
        <Box sx={{ p: { xs: 3, sm: 4 } }}>
          <Grid container spacing={4}>
            {/* Contact */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="primary.main"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 16,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                  }}
                />
                Contact
              </Typography>
              <Stack spacing={1.5}>
                <Typography color="text.secondary" variant="body2">
                  Phone: <strong>{patient.phone || '—'}</strong>
                </Typography>
                {patient.email && (
                  <Typography color="text.secondary" variant="body2">
                    Email: <strong>{patient.email}</strong>
                  </Typography>
                )}
              </Stack>
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="primary.main"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 16,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                  }}
                />
                Address
              </Typography>
              <Typography color="text.secondary" variant="body2" sx={{ mt: 1, lineHeight: 1.6 }}>
                {formatAddress()}
              </Typography>
            </Grid>

            {/* Assigned Doctor */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="primary.main"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 16,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                  }}
                />
                Assigned Doctor
              </Typography>
              {patient.current_doctor ? (
                <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                  <Avatar
                    src={patient.current_doctor.user?.profile_photo_url}
                    alt={patient.current_doctor.name}
                    sx={{
                      width: 44,
                      height: 44,
                      border: '2px solid',
                      borderColor: 'primary.light',
                    }}
                  />
                  <Box>
                    <Typography fontWeight={600} variant="body2">
                      {patient.current_doctor.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {patient.current_doctor.user?.email}
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Typography color="text.disabled" fontStyle="italic" variant="body2">
                  Not assigned
                </Typography>
              )}
            </Grid>

            {/* Clinical Info */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography
                variant="subtitle1"
                fontWeight={600}
                color="primary.main"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Box
                  sx={{
                    width: 4,
                    height: 16,
                    bgcolor: 'primary.main',
                    borderRadius: 1,
                  }}
                />
                Clinical
              </Typography>
              <Stack spacing={1.5} mt={1}>
                {patient.blood_type ? (
                  <Chip
                    label={patient.blood_type}
                    color="error"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: 'error.main',
                      color: 'white',
                    }}
                  />
                ) : (
                  <Typography color="text.disabled" fontStyle="italic" variant="body2">
                    No blood type
                  </Typography>
                )}
                {patient.weight && (
                  <Typography color="text.secondary" variant="body2">
                    Weight: <strong>{patient.weight} kg</strong>
                  </Typography>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Divider
            sx={{
              my: 4,
              borderColor: 'grey.200',
              '&::before, &::after': {
                borderColor: 'grey.200',
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Patients;
