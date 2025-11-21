import { Box, Typography, Paper, Grid, Chip, Divider, Stack, Avatar } from "@mui/material";
import type { Patient } from "../../shared/api/types/patient.types";


type PatientsProps = {
  patient: Patient;
};

const Patients = ({ patient }: PatientsProps) => {
  const formatAddress = () => {
    if (!patient.address) return "—";
    const parts = [
      patient.address.kifle_ketema,
      patient.address.wereda && `Wereda ${patient.address.wereda}`,
      patient.address.city,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  };

  return (
    <Box sx={{ px: {  }, pt: 3 }}>
      <Paper elevation={6} sx={{ borderRadius: 2, overflow: "hidden", bgcolor: "background.paper" }}>
        {/* Top Header - Name + Key Info */}
        <Box
          sx={{
            bgcolor: "#f5f5f5f5",
            color: "primary.main",
            px: { xs: 3, sm: 4 },
            py: 2,
            position: "relative",
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            {/* Left: Name + Badges */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                <Typography variant="h4" fontWeight={800} sx={{ letterSpacing: 0.5 }}>
                  {patient.full_name }
                </Typography>

                {/* Visit Type Badge */}
                {patient.visit_type && (
                  <Chip
                    label={patient.visit_type}
                    color="secondary"
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: patient.visit_type === "Follow Up" ? "#FFD700" : "#4CAF50",
                      color: "white",
                    }}
                  />
                )}

                {/* Patient Category */}
                {patient.patient_category && (
                  <Chip
                    label={patient.patient_category.name}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: patient.patient_category.color || "#999",
                      color: "white",
                    }}
                  />
                )}
              </Stack>

              <Stack direction="row" spacing={3} mt={1.5} flexWrap="wrap" color="#242424ff" useFlexGap>
                <Typography variant="h6" sx={{ opacity: 0.95 }}>
                  EMR: <strong>{patient.emr_number}</strong>
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.95 }}>
                  Age: <strong>{patient.age ?? "—"}</strong>
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.95 }}>
                  Gender: <strong>{patient.gender}</strong>
                </Typography>
                {patient.national_id && (
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    NID: <strong>{patient.national_id}</strong>
                  </Typography>
                )}
              </Stack>
            </Grid>

            {/* Right: Status Flags */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
                  <Chip
                    label={patient.flags?.is_checked_in ? "Checked In" : "Checked Out"}
                    color={patient.flags?.is_checked_in ? "success" : "default"}
                    variant="filled"
                    size="medium"
                    sx={{ minWidth: 120, fontWeight: 600 }}
                  />
                  {/* <Chip
                    label={patient.flags?.bill_paid ? "Paid" : "Unpaid"}
                    color={patient.flags?.bill_paid ? "success" : "warning"}
                    variant="filled"
                    size="medium"
                    sx={{ minWidth: 110, fontWeight: 600 }}
                  /> */}
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* Bottom Section - Details */}
        <Box sx={{ p: { xs: 3, sm: 2 } }}>
          <Grid container spacing={4}>
            {/* Contact */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
                Contact
              </Typography>
              <Stack spacing={1.5}>
                <Typography color="text.secondary">
                  Phone: <strong>{patient.phone || "—"}</strong>
                </Typography>
                {patient.email && (
                  <Typography color="text.secondary">
                    Email: <strong>{patient.email}</strong>
                  </Typography>
                )}
              </Stack>
            </Grid>

            {/* Address */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
                Address
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {formatAddress()}
              </Typography>
            </Grid>

            {/* Assigned Doctor */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
                Assigned Doctor
              </Typography>
              {patient.current_doctor ? (
                <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                  <Avatar
                    src={patient.current_doctor.user?.profile_photo_url}
                    alt={patient.current_doctor.name}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography fontWeight={600}>{patient.current_doctor.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {patient.current_doctor.user?.email}
                    </Typography>
                  </Box>
                </Stack>
              ) : (
                <Typography color="text.disabled" fontStyle="italic">
                  Not assigned
                </Typography>
              )}
            </Grid>

            {/* Clinical Info */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="subtitle1" fontWeight={700} color="primary" gutterBottom>
                Clinical
              </Typography>
              <Stack spacing={1.5} mt={1}>
                {patient.blood_type ? (
                  <Chip label={patient.blood_type} color="error" size="small" sx={{ fontWeight: 700 }} />
                ) : (
                  <Typography color="text.disabled" fontStyle="italic" variant="body2">
                    No blood type
                  </Typography>
                )}
                {patient.weight && (
                  <Typography color="text.secondary">
                    Weight: <strong>{patient.weight} kg</strong>
                  </Typography>
                )}
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: "grey.300" }} />
        </Box>
      </Paper>
    </Box>
  );
};

export default Patients;