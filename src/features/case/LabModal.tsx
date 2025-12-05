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
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Close, ExpandMore, Science } from '@mui/icons-material';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';
import { toast } from 'react-toastify';

interface LabTest {
  id: string;
  name: string;
  price?: number;
}

interface Laboratory {
  id: string;
  name: string;
  description: string;
  tests: LabTest[];
}

interface SelectedTest {
  labId: string;
  labName: string;
  testId: string;
  testName: string;
  price?: number;
}

interface LabModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}

const LabModal: React.FC<LabModalProps> = ({ open, onClose, patientId, patientName }) => {
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch laboratories when modal opens
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const response = await LaboratoryService.getLabs();
        setLaboratories(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching labs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchLabs();
      setSelectedTests([]);
    }
  }, [open]);

  const handleTestToggle = (lab: Laboratory, test: LabTest) => {
    setSelectedTests(prev => {
      const existingIndex = prev.findIndex(selected => selected.testId === test.id);

      if (existingIndex >= 0) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [
          ...prev,
          {
            labId: lab.id,
            labName: lab.name,
            testId: test.id,
            testName: test.name,
            price: test.price || 0,
          },
        ];
      }
    });
  };

  const isTestSelected = (testId: string) => {
    return selectedTests.some(test => test.testId === testId);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      // Extract just the test IDs for the request
      const testIds = selectedTests.map(test => test.testId);

      // Prepare the request body according to the API requirements
      const requestBody = {
        test_ids: testIds,
        // Include additional data if needed by your API
        laboratory_data: selectedTests.map(test => ({
          test_id: test.testId,
          test_name: test.testName,
          lab_id: test.labId,
          lab_name: test.labName,
          price: test.price || 0,
        })),
      };

      console.log('Submitting lab request:', requestBody);

      // Submit the lab request
      await LaboratoryService.createLabRequest(patientId, requestBody);

      onClose();
      setSelectedTests([]);
      toast.success('Lab requests submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting lab requests:', error);

      // Show more detailed error message
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('Error submitting lab requests. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveTest = (testId: string) => {
    setSelectedTests(prev => prev.filter(test => test.testId !== testId));
  };

  const totalPrice = selectedTests.reduce((total, test) => total + (test.price || 0), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Request Laboratory Tests</Typography>
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
          {/* Selected Tests Summary */}
          {selectedTests.length > 0 && (
            <Box sx={{ mb: 3, p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Selected Tests ({selectedTests.length})
                {totalPrice > 0 && ` - Total: $${totalPrice}`}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedTests.map(test => (
                  <Chip
                    key={test.testId}
                    label={
                      <Box>
                        <Typography variant="body2" component="span">
                          {test.testName}
                        </Typography>
                        {test.price && test.price > 0 && (
                          <Typography variant="caption" component="div" color="textSecondary">
                            ${test.price}
                          </Typography>
                        )}
                        <Typography variant="caption" component="div" color="textSecondary">
                          {test.labName}
                        </Typography>
                      </Box>
                    }
                    onDelete={() => handleRemoveTest(test.testId)}
                    color="primary"
                    variant="filled"
                    size="medium"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Laboratories List */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {laboratories.length === 0 ? (
                <Typography textAlign="center" color="textSecondary" sx={{ py: 4 }}>
                  No laboratories available.
                </Typography>
              ) : (
                laboratories.map(lab => (
                  <Accordion key={lab.id} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ width: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {lab.name}
                          </Typography>
                          <Chip
                            label={`${lab.tests?.length || 0} tests`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Box>
                        {lab.description && (
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                            {lab.description}
                          </Typography>
                        )}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      {lab.tests && lab.tests.length > 0 ? (
                        <FormGroup>
                          {lab.tests.map(test => (
                            <FormControlLabel
                              key={test.id}
                              control={
                                <Checkbox
                                  checked={isTestSelected(test.id)}
                                  onChange={() => handleTestToggle(lab, test)}
                                  icon={<Science />}
                                  checkedIcon={<Science color="primary" />}
                                />
                              }
                              label={
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                  }}
                                >
                                  <Typography variant="body1">{test.name}</Typography>
                                  {test.price && test.price > 0 && (
                                    <Typography variant="body2" color="primary" fontWeight="bold">
                                      ${test.price}
                                    </Typography>
                                  )}
                                </Box>
                              }
                              sx={{
                                mb: 1,
                                px: 1,
                                py: 0.5,
                                '&:hover': {
                                  backgroundColor: 'action.hover',
                                  borderRadius: 1,
                                },
                                width: '100%',
                              }}
                            />
                          ))}
                        </FormGroup>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No tests available for this laboratory.
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Box>
          )}

          {!loading && selectedTests.length === 0 && laboratories.length > 0 && (
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
              sx={{ mt: 3, py: 2 }}
            >
              Select tests from the laboratory categories above.
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={selectedTests.length === 0 || submitting}
          startIcon={submitting ? <CircularProgress size={16} /> : <Science />}
        >
          {submitting ? 'Submitting...' : `Submit ${selectedTests.length} Test(s)`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabModal;
