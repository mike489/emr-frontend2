import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Close, ExpandMore, Science } from '@mui/icons-material';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';

interface LabTestResult {
  id: string;
  test: string;
  result: string | null;
  amount: string;
  is_payment_completed: boolean;
  technician: string | null;
  created_at: string;
}

interface LabTestGroup {
  group_name: string;
  tests: LabTestResult[];
}

interface PatientLaboratoriesProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

const PatientLaboratories: React.FC<PatientLaboratoriesProps> = ({
  open,
  onClose,
  patientId,
  patientName,
}) => {
  const [labTests, setLabTests] = useState<LabTestGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch laboratory tests when modal opens
  useEffect(() => {
    const fetchLabTests = async () => {
      if (!open || !patientId) return;

      try {
        setLoading(true);
        setError(null);

        // Using getLabRequest to fetch patient's laboratory tests
        const response = await LaboratoryService.getLabRequest(patientId);
        setLabTests(response.data?.data || []);
      } catch (err: any) {
        console.error('Error fetching laboratory tests:', err);
        setError(err.response?.data?.message || 'Failed to fetch laboratory tests');
        setLabTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLabTests();
  }, [open, patientId]);

  const getStatusColor = (test: LabTestResult) => {
    if (!test.is_payment_completed) return 'error';
    if (test.result) return 'success';
    return 'warning';
  };

  const getStatusText = (test: LabTestResult) => {
    if (!test.is_payment_completed) return 'Payment Pending';
    if (test.result) return 'Completed';
    return 'In Progress';
  };

  const calculateTotalAmount = () => {
    return labTests.reduce((total, group) => {
      return (
        total +
        group.tests.reduce((groupTotal, test) => {
          return groupTotal + parseFloat(test.amount || '0');
        }, 0)
      );
    }, 0);
  };

  const getTotalTestsCount = () => {
    return labTests.reduce((total, group) => total + group.tests.length, 0);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Patient Laboratory Tests</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="subtitle2" color="textSecondary">
          Patient: {patientName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Summary Cards */}
          {labTests.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {getTotalTestsCount()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Tests
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="secondary" fontWeight="bold">
                  ${calculateTotalAmount()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Amount
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {labTests.reduce(
                    (count, group) => count + group.tests.filter(t => t.result).length,
                    0
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completed
                </Typography>
              </Paper>
            </Box>
          )}

          {/* Loading State */}
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading laboratory tests...</Typography>
            </Box>
          )}

          {/* Error State */}
          {error && !loading && (
            <Box textAlign="center" sx={{ py: 4 }}>
              <Typography color="error">{error}</Typography>
              <Button variant="outlined" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
                Retry
              </Button>
            </Box>
          )}

          {/* Empty State */}
          {!loading && !error && labTests.length === 0 && (
            <Box textAlign="center" sx={{ py: 4 }}>
              <Science sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Laboratory Tests Found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                No laboratory tests have been requested for this patient yet.
              </Typography>
            </Box>
          )}

          {/* Laboratory Tests List */}
          {!loading && !error && labTests.length > 0 && (
            <Box>
              {labTests.map((group, groupIndex) => (
                <Accordion key={groupIndex} defaultExpanded sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Box sx={{ width: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold">
                          {group.group_name}
                        </Typography>
                        <Chip
                          label={`${group.tests.length} tests`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Test Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Result</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Technician</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Requested Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {group.tests.map((test, testIndex) => (
                            <TableRow key={testIndex}>
                              <TableCell>
                                <Typography variant="body2" fontWeight="medium">
                                  {test.test}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={`$${test.amount}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              </TableCell>
                              <TableCell>
                                {test.result ? (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontFamily: 'monospace',
                                      backgroundColor: 'success.light',
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                    }}
                                  >
                                    {test.result}
                                  </Typography>
                                ) : (
                                  <Typography variant="body2" color="textSecondary">
                                    Pending
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={getStatusText(test)}
                                  color={getStatusColor(test)}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {test.technician || 'Not assigned'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">{test.created_at}</Typography>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        {labTests.length > 0 && (
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              // Add functionality to print or export if needed
              console.log('Export laboratory tests');
            }}
          >
            Export Report
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PatientLaboratories;
