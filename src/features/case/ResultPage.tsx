import React, { useEffect } from 'react';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  IconButton,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  ExpandMore,
  Description,
  Science,
  Visibility,
  FilePresent,
} from '@mui/icons-material';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';

interface ResultPageProps {
  patientId: string;
  patientName?: string;
}

const ResultPage: React.FC<ResultPageProps> = ({ patientId, patientName }) => {
  const [labTests, setLabTests] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchLabTests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await LaboratoryService.getLabRequest(patientId);
        let data = response.data?.data || [];
        
        // Auto-group flat responses by created_at if necessary
        if (Array.isArray(data) && data.length > 0 && !data[0].tests) {
          const grouped: Record<string, any[]> = {};
          data.forEach((item: any) => {
            const dateStr = item.created_at || 'Unknown Date';
            const groupKey = dateStr.includes(',') ? dateStr.split(',')[0] : dateStr;
            if (!grouped[groupKey]) grouped[groupKey] = [];
            grouped[groupKey].push(item);
          });
          data = Object.keys(grouped).map(date => ({
            group_name: `Request ${date}`,
            tests: grouped[date],
          }));
        }
        
        setLabTests(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch laboratory tests');
      } finally {
        setLoading(false);
      }
    };
    fetchLabTests();
  }, [patientId]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary" sx={{ mb: 3 }}>
        Laboratory Results {patientName ? `for ${patientName}` : ''}
      </Typography>

      {labTests.length === 0 ? (
        <Paper elevation={0} variant="outlined" sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover' }}>
          <Science sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="body1" color="textSecondary">No laboratory results found for this patient.</Typography>
        </Paper>
      ) : (
        labTests.map(group => (
          <Accordion key={group.group_name} defaultExpanded sx={{ mb: 2, borderRadius: '8px !important', '&:before': { display: 'none' }, boxShadow: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Description color="action" fontSize="small" />
                <Typography variant="subtitle1" fontWeight="bold">
                  {group.group_name}
                </Typography>
                <Chip
                  label={`${group.tests?.length || 0} tests`}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 2 }}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <TableContainer sx={{ borderTop: 1, borderColor: 'divider' }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: 'action.hover' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', py: 1.5 }}>Test Name</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Result</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Files</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold' }}>Technician</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.tests.map((test: any) => (
                      <TableRow key={test.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ py: 1.5 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {test.service_name || test.test}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={test.result || 'Pending'}
                            size="small"
                            color={test.result ? 'success' : 'warning'}
                            variant={test.result ? 'filled' : 'outlined'}
                            sx={{ fontWeight: 'bold', minWidth: 80 }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {test.files && test.files.length > 0 ? (
                            <Stack direction="row" spacing={0.5} justifyContent="center">
                              {test.files.map((file: any) => (
                                <Tooltip key={file.uuid} title={`View ${file.mime_type}`}>
                                  <IconButton
                                    size="small"
                                    component="a"
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    color="primary"
                                  >
                                    {file.mime_type.startsWith('image/') ? <Visibility fontSize="small" /> : <FilePresent fontSize="small" />}
                                  </IconButton>
                                </Tooltip>
                              ))}
                            </Stack>
                          ) : (
                            <Typography variant="caption" color="text.disabled">—</Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" color="text.secondary">
                            {test.created_at}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                            {test.technician || '—'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};

export default ResultPage;
