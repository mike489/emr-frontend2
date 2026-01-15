import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from '@mui/material';
import { Visibility, Description, AttachFile } from '@mui/icons-material';
import { OperationalService } from '../../shared/api/services/operations.service';

interface ResultOperationPageProps {
  patientId: string;
  patientName?: string;
}

const ResultOperationPage: React.FC<ResultOperationPageProps> = ({ patientId, patientName }) => {
  const [opRequests, setOpRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedNote, setSelectedNote] = useState<any>(null);

  useEffect(() => {
    const fetchOpResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await OperationalService.getOperationRequest(patientId);
        
        // Handle various response structures robustly
        let data = [];
        const resData = response.data;
        if (resData && typeof resData === 'object') {
          if (Array.isArray(resData.data)) {
            data = resData.data;
          } else if (Array.isArray(resData)) {
            data = resData;
          }
        }
        
        console.log('Fetched op results:', data);

        // Auto-group flat responses by created_at if necessary
        if (data.length > 0 && !data[0].tests) {
          const grouped: Record<string, any[]> = {};
          data.forEach((item: any) => {
            const dateStr = item.created_at || 'Unknown Date';
            // Extract just the date part for grouping if it includes time
            const groupKey = dateStr.includes(',') ? dateStr.split(',')[0] : dateStr;
            if (!grouped[groupKey]) grouped[groupKey] = [];
            grouped[groupKey].push(item);
          });
          data = Object.keys(grouped).map(date => ({
            group_name: `Request ${date}`,
            tests: grouped[date],
          }));
        }

        setOpRequests(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch operation results');
      } finally {
        setLoading(false);
      }
    };
    fetchOpResults();
  }, [patientId]);

  const parseResult = (result: any) => {
    if (!result) return null;
    try {
      if (typeof result === 'string') {
        return JSON.parse(result);
      }
      return result;
    } catch (e) {
      return result;
    }
  };

  const getFileUrl = (url: string) => {
    return url.startsWith('http') ? url : `${import.meta.env.VITE_EMS_URL}/${url}`;
  };

  if (loading)
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 8 }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2 }} color="text.secondary">Loading Operation Results...</Typography>
      </Box>
    );

  if (error) return <Alert severity="error" sx={{ m: 3 }}>{error}</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
        Operation Results {patientName ? `for ${patientName}` : ''}
      </Typography>

      {Array.isArray(opRequests) && opRequests.length === 0 ? (
        <Paper elevation={0} variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover' }}>
          <Description sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body1" color="textSecondary">No operation results found for this patient.</Typography>
        </Paper>
      ) : (
        Array.isArray(opRequests) && opRequests.map(group => group && (
          <Box key={group.group_name} sx={{ mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ p: 1, color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
              <Description fontSize="small" sx={{ mr: 1 }} />
              {group.group_name}
            </Typography>

            <TableContainer component={Paper} elevation={1}>
              <Table size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell><strong>Operation Name</strong></TableCell>
                    <TableCell align="center"><strong>Status</strong></TableCell>
                    <TableCell align="center"><strong>Note</strong></TableCell>
                    <TableCell align="center"><strong>Files</strong></TableCell>
                    <TableCell align="center"><strong>Date</strong></TableCell>
                    <TableCell align="right"><strong>Technician</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array.isArray(group.tests) && group.tests.map((test: any) => {
                    const parsed = parseResult(test.result);
                    const hasNote = parsed && (parsed.operation_note || typeof parsed === 'object');
                    
                    return (
                      <TableRow key={test.id} hover>
                        <TableCell>{test.service_name || test.test}</TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color={test.result ? 'success.main' : 'warning.main'} fontWeight="bold">
                            {test.result ? 'Completed' : 'Pending'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {hasNote ? (
                            <Tooltip title="View Operation Note">
                              <IconButton size="small" color="primary" onClick={() => setSelectedNote({
                                name: test.service_name || test.test,
                                data: parsed.operation_note || parsed
                              })}>
                                <Visibility fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : '—'}
                        </TableCell>
                        <TableCell align="center">
                          {Array.isArray(test.files) && test.files.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              {test.files.map((file: any) => (
                                <Tooltip key={file.uuid} title={`View ${file.mime_type}`}>
                                  <IconButton size="small" component="a" href={getFileUrl(file.url)} target="_blank">
                                    <AttachFile fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              ))}
                            </Box>
                          ) : '—'}
                        </TableCell>
                        <TableCell align="center">
                          {test.created_at || '—'}
                        </TableCell>
                        <TableCell align="right">
                          {test.submitter || test.creator || test.technician || '—'}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))
      )}

      {/* Note Detail Dialog */}
      <Dialog open={!!selectedNote} onClose={() => setSelectedNote(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
          Operation Note: {selectedNote?.name}
        </DialogTitle>
        <DialogContent dividers>
          {selectedNote?.data && (
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Pre-op Diagnosis</Typography>
                <Typography variant="body1" gutterBottom>{selectedNote.data.pre_op_diagnosis || '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="subtitle2" color="text.secondary">Post-op Diagnosis</Typography>
                <Typography variant="body1" gutterBottom>{selectedNote.data.post_op_diagnosis || '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Typography variant="subtitle2" color="text.secondary">Procedure</Typography>
                <Typography variant="body1" gutterBottom>{selectedNote.data.procedure || '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="subtitle2" color="text.secondary">Anesthesia Type</Typography>
                <Typography variant="body1" gutterBottom>{selectedNote.data.anesthesia_type || '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">Findings</Typography>
                <Typography variant="body1" gutterBottom sx={{ whiteSpace: 'pre-line' }}>{selectedNote.data.findings || '—'}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="text.secondary">Post-op Plan</Typography>
                <Typography variant="body1" gutterBottom sx={{ whiteSpace: 'pre-line' }}>{selectedNote.data.post_op_plan || '—'}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedNote(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResultOperationPage;
