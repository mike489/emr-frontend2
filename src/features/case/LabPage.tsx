import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  CircularProgress,
  Paper,
  Container,
  IconButton,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import { ExpandMore, Science, CheckCircle, Delete } from '@mui/icons-material';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface LabTest {
  id: string;
  name: string;
  price?: number;
  description?: string;
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

interface LabPageProps {
  patientId: string;
  patientName: string;
}

const LabPage: React.FC<LabPageProps> = ({ patientId }) => {
  const navigate = useNavigate();
  const [laboratories, setLaboratories] = useState<Laboratory[]>([]);
  const [selectedTests, setSelectedTests] = useState<SelectedTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const response = await LaboratoryService.getLabs();

        if (response.data && response.data.success) {
          if (Array.isArray(response.data.data)) {
            console.log('Setting laboratories:', response.data.data);
            setLaboratories(response.data.data);
          } else {
            console.log('Data is not an array:', response.data.data);
            setLaboratories([]);
          }
        } else {
          if (Array.isArray(response.data)) {
            setLaboratories(response.data);
          } else {
            setLaboratories([]);
          }
        }
      } catch (error) {
        console.error('Error fetching labs:', error);
        toast.error('Failed to load laboratories');
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

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

      setSelectedTests([]);
      toast.success('Lab requests submitted successfully!');

      // Optionally navigate back or show success message
      navigate(-1); // Go back to previous page
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

  const handleClearAll = () => {
    setSelectedTests([]);
  };

  const totalPrice = selectedTests.reduce((total, test) => total + (test.price || 0), 0);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Left Column - Selected Tests Summary */}
        <Box sx={{ width: { xs: '100%', lg: '65%' } }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
              Available Laboratories
            </Typography>

            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 8 }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading laboratories...</Typography>
              </Box>
            ) : (
              <Box>
                {laboratories.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      No laboratories available.
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                      Please check the API response structure.
                    </Typography>
                  </Box>
                ) : (
                  laboratories.map(lab => (
                    <Accordion key={lab.id} sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box sx={{ width: '100%' }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold">
                              {lab.name}
                            </Typography>
                            <Chip
                              label={`${lab.tests?.length || 0} tests`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Stack>
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
              <Box
                sx={{
                  textAlign: 'center',
                  mt: 4,
                  py: 3,
                  border: '1px dashed',
                  borderColor: 'divider',
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1" color="textSecondary">
                  Select tests from the laboratory categories above
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Your selections will appear in the summary panel
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Right Column - Laboratories List */}

        <Box sx={{ width: { xs: '100%', lg: '35%' } }}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6" fontWeight="bold">
                Selected Tests
              </Typography>
              {selectedTests.length > 0 && (
                <Button size="small" color="error" startIcon={<Delete />} onClick={handleClearAll}>
                  Clear All
                </Button>
              )}
            </Stack>

            {selectedTests.length > 0 ? (
              <>
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {selectedTests.length} test(s) selected
                    </Typography>
                    {totalPrice > 0 && (
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        Total: ${totalPrice}
                      </Typography>
                    )}
                  </Stack>

                  <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                    {selectedTests.map(test => (
                      <Card
                        key={test.testId}
                        variant="outlined"
                        sx={{
                          mb: 2,
                          borderColor: 'primary.main',
                        }}
                      >
                        <CardContent sx={{ py: 2, px: 2 }}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {test.testName}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {test.labName}
                              </Typography>
                              {/* {test.price && test.price > 0 && (
                                <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                                  ${test.price}
                                </Typography>
                              )} */}
                            </Box>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveTest(test.testId)}
                              sx={{ ml: 1 }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : <CheckCircle />}
                  sx={{ py: 1.5 }}
                >
                  {submitting ? 'Submitting...' : `Submit ${selectedTests.length} Test(s)`}
                </Button>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Science sx={{ fontSize: 60, color: 'action.disabled', mb: 2 }} />
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  No tests selected
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Select tests from the laboratories list
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default LabPage;
