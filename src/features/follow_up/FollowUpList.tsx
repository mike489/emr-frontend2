import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from '@mui/material';
import { usePatientDetailsState } from '../../contexts/PatientContext';
import { FollowUpService } from '../../shared/api/services/followUp.service';
import Patients from '../../pages/patients/Patients';
import { format } from 'date-fns';

const FollowUpList = () => {
  const patientDetailsState = usePatientDetailsState();
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patient = patientDetailsState?.patient;

  useEffect(() => {
    const fetchFollowUps = async () => {
      if (!patient?.id) return;

      setLoading(true);
      setError(null);
      try {
        const response = await FollowUpService.getFollowUpNote(patient.id);
        // API response structure: { success: true, data: { current_page: 1, data: [...] } }
        // So we need response.data.data.data
        const payload = response.data;
        const pagedData = payload?.data;
        const list = pagedData?.data && Array.isArray(pagedData.data) ? pagedData.data : [];
        setFollowUps(list);
      } catch (err) {
        console.error('Error fetching follow-up notes:', err);
        setError('Failed to load follow-up notes.');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, [patient?.id]);

  if (!patientDetailsState) {
    return <div>Loading patient data...</div>;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: 'background.paper',
        mt: -16, 
        p: 3
      }}
    >
      <Box sx={{ mb: 3 }}>
        {patient && <Patients patient={patient} />}
      </Box>

      <Typography variant="h6" gutterBottom>
        Follow Up Notes
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : followUps.length === 0 ? (
        <Typography>No follow-up notes found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow
                sx={{
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  '& th': {
                    borderBottom: '2px solid #e0e0e0',
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Diagnosis</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Plan</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'white', py: 1.5 }}>Remark</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {followUps.map((note: any, index: number) => (
                <TableRow key={note.id || index} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {note.created_at ? format(new Date(note.created_at), 'yyyy-MM-dd HH:mm') : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500} component="div">
                      <div dangerouslySetInnerHTML={{ __html: note.diagnosis || '-' }} />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500} component="div">
                      <div dangerouslySetInnerHTML={{ __html: note.plan || '-' }} />
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500} component="div">
                      <div dangerouslySetInnerHTML={{ __html: note.remark || '-' }} />
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FollowUpList;
