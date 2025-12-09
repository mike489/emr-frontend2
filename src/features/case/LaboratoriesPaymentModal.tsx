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
  Checkbox,
  FormGroup,
  FormControlLabel,
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
  Alert,
} from '@mui/material';
import { Close, ExpandMore, Payment } from '@mui/icons-material';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';
import { toast } from 'react-toastify';

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

interface SelectedTest {
  testId: string;
  testName: string;
  amount: number;
  groupName: string;
}

interface LaboratoriesPaymentModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onPaymentSuccess?: () => void;
}

const LaboratoriesPaymentModal: React.FC<LaboratoriesPaymentModalProps> = ({
  open,
  onClose,
  patientId,
  patientName,
  onPaymentSuccess,
}) => {
  const [labTests, setLabTests] = useState<LabTestGroup[]>([]);
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch laboratory tests when modal opens
  useEffect(() => {
    const fetchLabTests = async () => {
      if (!open || !patientId) return;

      try {
        setLoading(true);
        setError(null);
        setSelectedTests([]);

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

  const handleTestToggle = (test: LabTestResult, groupName: string) => {
    setSelectedTests(prev => {
      const existingIndex = prev.findIndex(selected => selected.testId === test.id);

      if (existingIndex >= 0) {
        // Remove test if already selected
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        // Add test if not selected and payment is not completed
        if (!test.is_payment_completed) {
          return [
            ...prev,
            {
              testId: test.id,
              testName: test.test,
              amount: parseFloat(test.amount),
              groupName: groupName,
            },
          ];
        }
        return prev;
      }
    });
  };

  const isTestSelected = (testId: string) => {
    return selectedTests.some(test => test.testId === testId);
  };

  const isTestSelectable = (test: LabTestResult) => {
    return !test.is_payment_completed;
  };

  const calculateTotalAmount = () => {
    return selectedTests.reduce((total, test) => total + test.amount, 0);
  };

  const handleSelectAll = (group: LabTestGroup) => {
    const selectableTests = group.tests.filter(test => isTestSelectable(test));
    const allSelected = selectableTests.every(test => isTestSelected(test.id));

    if (allSelected) {
      // Deselect all tests in this group
      setSelectedTests(prev => prev.filter(test => !group.tests.some(t => t.id === test.testId)));
    } else {
      // Select all selectable tests in this group
      const testsToAdd = selectableTests
        .filter(test => !isTestSelected(test.id))
        .map(test => ({
          testId: test.id,
          testName: test.test,
          amount: parseFloat(test.amount),
          groupName: group.group_name,
        }));

      setSelectedTests(prev => [...prev, ...testsToAdd]);
    }
  };

  const handleSubmitPayment = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const paymentData = {
        patient_tests: selectedTests.map(test => test.testId),
        total_amount: calculateTotalAmount().toString(),
        tests: selectedTests.map(test => ({
          patient_tests: test.testId,
          test_name: test.testName,
          amount: test.amount.toString(),
          group_name: test.groupName,
        })),
      };

      console.log('Submitting payment:', paymentData);

      await LaboratoryService.createLabPayment(patientId, paymentData);

      // Close modal and reset
      onClose();
      setSelectedTests([]);

      // Show success message and refresh if callback provided
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }

      toast.success('Payment submitted successfully!');
    } catch (err: any) {
      toast.error('Error submitting payment:', err);
      setError(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitting(false);
    }
  };

  //   const getPendingTestsCount = () => {
  //     return labTests.reduce(
  //       (count, group) => count + group.tests.filter(test => !test.is_payment_completed).length,
  //       0
  //     );
  //   };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Laboratory Payment</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="subtitle2" color="textSecondary">
          Patient: {patientName} (MRN: {patientId})
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Payment Summary */}
          {selectedTests.length > 0 && (
            <Paper sx={{ p: 2, mb: 3, backgroundColor: 'success.light' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Selected for Payment
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {selectedTests.length} test(s) selected
                  </Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Birr{calculateTotalAmount().toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total Amount
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}

          {/* Loading State */}
          {loading && (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading laboratory tests...</Typography>
            </Box>
          )}

          {/* Empty State */}
          {!loading && labTests.length === 0 && !error && (
            <Box textAlign="center" sx={{ py: 4 }}>
              <Payment sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Pending Laboratory Payments
              </Typography>
              <Typography variant="body2" color="textSecondary">
                All laboratory tests have been paid for this patient.
              </Typography>
            </Box>
          )}

          {/* Laboratory Tests List */}
          {!loading && labTests.length > 0 && (
            <Box>
              {labTests.map((group, groupIndex) => {
                const pendingTests = group.tests.filter(test => !test.is_payment_completed);
                const selectedInGroup = group.tests.filter(
                  test => isTestSelected(test.id) && !test.is_payment_completed
                );
                const allSelected =
                  pendingTests.length > 0 && selectedInGroup.length === pendingTests.length;

                if (pendingTests.length === 0) return null;

                return (
                  <Accordion key={groupIndex} defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ width: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex" alignItems="center" gap={1}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={allSelected}
                                  indeterminate={selectedInGroup.length > 0 && !allSelected}
                                  onChange={() => handleSelectAll(group)}
                                  disabled={pendingTests.length === 0}
                                />
                              }
                              label={
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {group.group_name}
                                </Typography>
                              }
                              sx={{ mr: 2 }}
                            />
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={`${selectedInGroup.length}/${pendingTests.length} selected`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={`$${pendingTests.reduce((sum, test) => sum + parseFloat(test.amount), 0)}`}
                              size="small"
                              color="secondary"
                            />
                          </Box>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <FormGroup>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell width="60px">Select</TableCell>
                                <TableCell>Test Name</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Requested Date</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {group.tests.map((test, testIndex) => (
                                <TableRow
                                  key={testIndex}
                                  sx={{
                                    opacity: test.is_payment_completed ? 0.6 : 1,
                                    backgroundColor: test.is_payment_completed
                                      ? 'action.hover'
                                      : 'transparent',
                                  }}
                                >
                                  <TableCell>
                                    <Checkbox
                                      checked={isTestSelected(test.id)}
                                      onChange={() => handleTestToggle(test, group.group_name)}
                                      disabled={!isTestSelectable(test)}
                                      color="primary"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      fontWeight={isTestSelected(test.id) ? 'bold' : 'normal'}
                                    >
                                      {test.test}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Chip
                                      label={`$${test.amount}`}
                                      size="small"
                                      color={isTestSelected(test.id) ? 'primary' : 'default'}
                                      variant={isTestSelected(test.id) ? 'filled' : 'outlined'}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={test.is_payment_completed ? 'Paid' : 'Pending'}
                                      color={test.is_payment_completed ? 'success' : 'warning'}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">{test.created_at}</Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </FormGroup>
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
        <Button
          onClick={handleSubmitPayment}
          variant="contained"
          color="primary"
          disabled={selectedTests.length === 0 || submitting}
          startIcon={submitting ? <CircularProgress size={16} /> : <Payment />}
        >
          {submitting ? 'Processing...' : `Pay $${calculateTotalAmount().toFixed(2)}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LaboratoriesPaymentModal;
