
import { useLocation } from "react-router-dom";
import { Box, Typography, Paper, Grid, Chip } from "@mui/material";

const Patients = () => {
  const location = useLocation();
  const patient = location.state?.patient;

  if (!patient) {
    return <Typography>No patient selected.</Typography>;
  }

  return (
    <Box sx={{ p: 3 , mt:-16}}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          {patient.full_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          EMR: {patient.emr_number} | Age: {patient.age} | Gender: {patient.gender}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={{xs:12, sm:6}}>
            <Typography variant="subtitle2">Contact</Typography>
            <Typography>{patient.phone}</Typography>
            <Typography>{patient.email}</Typography>
          </Grid>
          <Grid size={{xs:12, sm:6}}>
            <Typography variant="subtitle2">Address</Typography>
            <Typography>
              {patient.address?.kifle_ketema}, {patient.address?.wereda}, {patient.address?.city}
            </Typography>
          </Grid>
          <Grid size={{xs:12, sm:6}}>
            <Typography variant="subtitle2">Blood Type</Typography>
            <Chip label={patient.blood_type} color="primary" size="small" />
          </Grid>
          <Grid size={{xs:12, sm:6}}>
            <Typography variant="subtitle2">Visit Type</Typography>
            <Typography>{patient.visit_type}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Flags
        </Typography>
        <Grid container spacing={2}>
          <Grid >
            <Chip label="Checked In" color={patient.flags.is_checked_in ? "success" : "default"} />
          </Grid>
          <Grid >
            <Chip label="Checked Out" color={patient.flags.is_checked_out ? "warning" : "default"} />
          </Grid>
          <Grid >
            <Chip label="Requires Payment" color={patient.flags.requires_payment ? "error" : "default"} />
          </Grid>
          <Grid >
            <Chip label="Bill Paid" color={patient.flags.bill_paid ? "success" : "default"} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Patients;
