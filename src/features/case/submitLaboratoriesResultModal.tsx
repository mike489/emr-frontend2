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
  TextField,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from '@mui/material';
import { Close, ExpandMore, Science, CheckCircle } from '@mui/icons-material';
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

interface TestResultInput {
  id: string; // Changed from testId to id to match API requirement
  result: string;
}

interface SubmitLaboratoriesResultModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onResultSubmit?: () => void;
}

const SubmitLaboratoriesResultModal: React.FC<SubmitLaboratoriesResultModalProps> = ({
  open,
  onClose,
  patientId,
  patientName,
  onResultSubmit,
}) => {
  const [labTests, setLabTests] = useState<LabTestGroup[]>([]);
  const [testResults, setTestResults] = useState<TestResultInput[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch laboratory tests when modal opens
  useEffect(() => {
    const fetchLabTests = async () => {
      if (!open || !patientId) return;

      try {
        setLoading(true);
        setError(null);
        setTestResults([]);
        setSuccess(false);

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

  const handleResultChange = (testId: string, result: string) => {
    setTestResults(prev => {
      const existingIndex = prev.findIndex(tr => tr.id === testId);

      if (existingIndex >= 0) {
        // Update existing result
        const updated = [...prev];
        updated[existingIndex] = { id: testId, result };
        return updated;
      } else {
        // Add new result
        return [...prev, { id: testId, result }];
      }
    });
  };

  const getResultValue = (testId: string) => {
    const result = testResults.find(tr => tr.id === testId);
    return result ? result.result : '';
  };

  const hasPendingTests = () => {
    return labTests.some(group =>
      group.tests.some(test => !test.result && test.is_payment_completed)
    );
  };

  const getCompletedTestsCount = () => {
    return labTests.reduce(
      (count, group) => count + group.tests.filter(test => test.result).length,
      0
    );
  };

  const getPendingTestsCount = () => {
    return labTests.reduce(
      (count, group) =>
        count + group.tests.filter(test => !test.result && test.is_payment_completed).length,
      0
    );
  };

  const canSubmitResults = () => {
    // Allow submission if there are any results entered
    return testResults.length > 0 && testResults.every(tr => tr.result.trim() !== '');
  };

  const handleSubmitResults = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Corrected submission data structure based on API requirements
      const submissionData = {
        patient_tests: testResults.map(tr => ({
          id: tr.id, // This should match the test ID from getLabRequest
          result: tr.result,
        })),
        technician: 'Lab Technician', // This could be dynamic based on logged-in user
      };

      console.log('Submitting lab results:', submissionData);

      await LaboratoryService.createLabResult(patientId, submissionData);

      setSuccess(true);

      // Call success callback if provided
      if (onResultSubmit) {
        onResultSubmit();
      }

      // Close modal after successful submission
      setTimeout(() => {
        onClose();
        setTestResults([]);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting lab results:', err);
      setError(err.response?.data?.message || 'Failed to submit laboratory results');
    } finally {
      setSubmitting(false);
    }
  };

  const getTestStatus = (test: LabTestResult) => {
    if (test.result) return { status: 'Completed', color: 'success' as const };
    if (test.is_payment_completed)
      return { status: 'Ready for Results', color: 'warning' as const };
    return { status: 'Payment Pending', color: 'error' as const };
  };

  // Get all pending tests for selection
  const getAllPendingTests = () => {
    const pendingTests: LabTestResult[] = [];
    labTests.forEach(group => {
      group.tests.forEach(test => {
        if (!test.result && test.is_payment_completed) {
          pendingTests.push(test);
        }
      });
    });
    return pendingTests;
  };

  // Select all pending tests
  const handleSelectAll = () => {
    const pendingTests = getAllPendingTests();
    const allSelected = pendingTests.every(test => testResults.some(tr => tr.id === test.id));

    if (allSelected) {
      // Deselect all
      setTestResults([]);
    } else {
      // Select all pending tests with empty results
      const newTestResults = pendingTests.map(test => ({
        id: test.id,
        result: getResultValue(test.id) || '', // Keep existing result if any
      }));
      setTestResults(newTestResults);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Submit Laboratory Results</Typography>
          <IconButton onClick={onClose} size="small" disabled={submitting}>
            <Close />
          </IconButton>
        </Box>
        <Typography variant="subtitle2" color="textSecondary">
          Patient: {patientName} (MRN: {patientId})
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Laboratory results submitted successfully!
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Action Buttons */}
          {hasPendingTests() && (
            <Box
              sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Button variant="outlined" onClick={handleSelectAll} disabled={submitting}>
                {getAllPendingTests().length === testResults.length
                  ? 'Deselect All'
                  : 'Select All Pending'}
              </Button>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Paper sx={{ p: 1.5, minWidth: 100, textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Ready to Submit
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {testResults.length}
                  </Typography>
                </Paper>

                <Paper sx={{ p: 1.5, minWidth: 100, textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Total Amount
                  </Typography>
                  <Typography variant="h6" color="secondary" fontWeight="bold">
                    $
                    {testResults.reduce((total, tr) => {
                      const test = labTests.flatMap(group => group.tests).find(t => t.id === tr.id);
                      return total + (test ? parseFloat(test.amount) : 0);
                    }, 0)}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}

          {/* Summary Cards */}
          {labTests.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
              <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {getPendingTestsCount()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pending Results
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {getCompletedTestsCount()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Completed
                </Typography>
              </Paper>

              <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main" fontWeight="bold">
                  {labTests.reduce(
                    (count, group) =>
                      count + group.tests.filter(test => !test.is_payment_completed).length,
                    0
                  )}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Payment Pending
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

          {/* No Tests State */}
          {!loading && labTests.length === 0 && !error && (
            <Box textAlign="center" sx={{ py: 4 }}>
              <Science sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Laboratory Tests Found
              </Typography>
              <Typography variant="body2" color="textSecondary">
                No laboratory tests requiring results for this patient.
              </Typography>
            </Box>
          )}

          {/* No Pending Tests State */}
          {!loading && labTests.length > 0 && !hasPendingTests() && (
            <Box textAlign="center" sx={{ py: 4 }}>
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                All Tests Completed
              </Typography>
              <Typography variant="body2" color="textSecondary">
                All laboratory tests have been completed for this patient.
              </Typography>
            </Box>
          )}

          {/* Laboratory Tests List */}
          {!loading && hasPendingTests() && (
            <Box>
              {labTests.map((group, groupIndex) => {
                const pendingTests = group.tests.filter(
                  test => !test.result && test.is_payment_completed
                );

                if (pendingTests.length === 0) return null;

                return (
                  <Accordion key={groupIndex} defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ width: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {group.group_name}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={`${pendingTests.length} pending`}
                              size="small"
                              color="warning"
                              variant="outlined"
                            />
                            <Chip
                              label={`${
                                pendingTests.filter(test =>
                                  testResults.some(tr => tr.id === test.id)
                                ).length
                              } selected`}
                              size="small"
                              color="primary"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper} variant="outlined">
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Test Name</TableCell>
                              <TableCell width="300px">Result</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Requested Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {group.tests.map((test, testIndex) => {
                              const status = getTestStatus(test);
                              const canEnterResult = !test.result && test.is_payment_completed;
                              const isSelected = testResults.some(tr => tr.id === test.id);

                              return (
                                <TableRow
                                  key={testIndex}
                                  sx={{
                                    opacity: test.result ? 0.7 : 1,
                                    backgroundColor: isSelected ? 'action.selected' : 'transparent',
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                    },
                                  }}
                                >
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      fontWeight={canEnterResult ? 'bold' : 'normal'}
                                    >
                                      {test.test}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    {canEnterResult ? (
                                      <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Enter test result..."
                                        value={getResultValue(test.id)}
                                        onChange={e => handleResultChange(test.id, e.target.value)}
                                        disabled={submitting}
                                        onFocus={() => {
                                          // Auto-select test when focusing on result field
                                          if (!isSelected) {
                                            handleResultChange(
                                              test.id,
                                              getResultValue(test.id) || ''
                                            );
                                          }
                                        }}
                                      />
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontFamily: test.result ? 'monospace' : 'inherit',
                                          backgroundColor: test.result ? 'white' : 'transparent',
                                          px: test.result ? 1 : 0,
                                          py: test.result ? 0.5 : 0,
                                          borderRadius: test.result ? 1 : 0,
                                          border: test.result ? '1px solid #e0e0e0' : 'none',
                                        }}
                                      >
                                        {test.result || 'N/A'}
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Chip label={status.status} color={status.color} size="small" />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={`$${test.amount}`}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">{test.created_at}</Typography>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        {hasPendingTests() && (
          <Button
            onClick={handleSubmitResults}
            variant="contained"
            color="primary"
            disabled={!canSubmitResults() || submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : <CheckCircle />}
          >
            {submitting ? 'Submitting...' : `Submit ${testResults.length} Result(s)`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SubmitLaboratoriesResultModal;
