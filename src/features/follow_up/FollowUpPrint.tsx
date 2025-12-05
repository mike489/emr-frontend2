// FollowUpPrint.tsx
import { Box, Typography, Paper, Button, Grid, Divider } from '@mui/material';
import { PatientService } from '../../shared/api/services/patient.service';
import { useEffect, useState } from 'react';
// import { Print as PrintIcon } from 'lucide-react';

interface FollowUpData {
  id: string;
  patient_id: string;
  od_s_correction: string;
  od_c_correction: string;
  od_iop: string;
  od_cct: string;
  os_s_correction: string;
  os_c_correction: string;
  os_iop: string;
  os_cct: string;
  examination_findings: string;
  plan: string;
  remark: string;
  diagnosis: string;
  created_at: string;
  updated_at: string;
}

const FollowUpPrint = ({
  consultationId,
  // patientId,
}: {
  consultationId: string;
  patientId: string;
}) => {
  const [followUpData, setFollowUpData] = useState<FollowUpData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowUpData = async () => {
      try {
        const response = await PatientService.getFollowUpNotesData(consultationId);
        if (
          response.data.success &&
          response.data.data.data &&
          response.data.data.data.length > 0
        ) {
          // Get the first follow-up note from the array
          setFollowUpData(response.data.data.data[0]);
        }
      } catch (error) {
        console.error('Error fetching follow-up data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUpData();
  }, [consultationId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography>Loading follow-up data...</Typography>
      </Box>
    );
  }

  if (!followUpData) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography color="text.secondary">
          No follow-up data found for this consultation.
        </Typography>
      </Box>
    );
  }

  // Function to safely parse HTML content
  const parseHTML = (html: string) => {
    return { __html: html };
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Follow-up Examination Details
          </Typography>
          <Button
            variant="contained"
            // startIcon={<PrintIcon size={20} />}
            onClick={handlePrint}
            sx={{ textTransform: 'none' }}
          >
            Print Report
          </Button>
        </Box>

        {/* <Divider sx={{ mb: 3 }} /> */}

        {/* Patient and Consultation Info */}
        {/* <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Patient Information
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Typography>
                <strong>Patient ID:</strong> {patientId}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography>
                <strong>Consultation ID:</strong> {consultationId}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography>
                <strong>Record Created:</strong>{' '}
                {new Date(followUpData.created_at).toLocaleString()}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography>
                <strong>Last Updated:</strong> {new Date(followUpData.updated_at).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Box> */}

        <Divider sx={{ my: 3 }} />

        {/* OD (Right Eye) Examination */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            OD (Right Eye) Examination
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>S-Correction:</strong> {followUpData.od_s_correction}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>C-Correction:</strong> {followUpData.od_c_correction}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>IOP:</strong> {followUpData.od_iop}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>CCT:</strong> {followUpData.od_cct}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* OS (Left Eye) Examination */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            OS (Left Eye) Examination
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>S-Correction:</strong> {followUpData.os_s_correction}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>C-Correction:</strong> {followUpData.os_c_correction}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>IOP:</strong> {followUpData.os_iop}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Typography>
                <strong>CCT:</strong> {followUpData.os_cct}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Examination Findings */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
            Examination Findings
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300',
              minHeight: '80px',
            }}
          >
            <div dangerouslySetInnerHTML={parseHTML(followUpData.examination_findings)} />
          </Box>
        </Box>

        {/* Diagnosis */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
            Diagnosis
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300',
              minHeight: '80px',
            }}
          >
            <div dangerouslySetInnerHTML={parseHTML(followUpData.diagnosis)} />
          </Box>
        </Box>

        {/* Plan */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
            Treatment Plan
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300',
              minHeight: '80px',
            }}
          >
            <div dangerouslySetInnerHTML={parseHTML(followUpData.plan)} />
          </Box>
        </Box>

        {/* Remarks */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
            Remarks
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'grey.300',
              minHeight: '80px',
            }}
          >
            <div dangerouslySetInnerHTML={parseHTML(followUpData.remark)} />
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px dashed', borderColor: 'grey.400' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            This is a system-generated report. For official copies, please contact the medical
            records department.
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            align="center"
            display="block"
            sx={{ mt: 1 }}
          >
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default FollowUpPrint;

{
  /* <Button variant="contained" onClick={handlePrint}>
  Print
</Button>; */
}
