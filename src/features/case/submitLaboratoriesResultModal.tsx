import React, { useState, useEffect, useRef } from 'react';
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
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Close,
  ExpandMore,
  Science,
  CheckCircle,
  AttachFile,
  Delete,
  PictureAsPdf,
  Description,
  InsertDriveFile,
} from '@mui/icons-material';
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
  id: string;
  result: string;
}

interface UploadedFile {
  id: string;
  file: File;
  testId?: string; // Optional - to associate with specific test
  testName?: string; // Optional - for display
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
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch laboratory tests when modal opens
  useEffect(() => {
    const fetchLabTests = async () => {
      if (!open || !patientId) return;

      try {
        setLoading(true);
        setError(null);
        setTestResults([]);
        setUploadedFiles([]);
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
    // Allow submission if there are any results entered OR files uploaded
    return testResults.length > 0 || uploadedFiles.length > 0;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, testId?: string) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Only PDF and DOC files are allowed.`);
        continue;
      }

      // Validate file size
      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Maximum size is 10MB.`);
        continue;
      }

      // Find test name for display
      let testName = '';
      if (testId) {
        labTests.forEach(group => {
          const test = group.tests.find(t => t.id === testId);
          if (test) testName = test.test;
        });
      }

      newFiles.push({
        id: `${Date.now()}-${i}`,
        file,
        testId,
        testName,
      });
    }

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      if (error?.includes('Invalid file type') || error?.includes('File too large')) {
        setError(null); // Clear error if we successfully added some files
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <PictureAsPdf />;
    if (fileType.includes('word') || fileType.includes('document')) return <Description />;
    return <InsertDriveFile />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmitResults = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Prepare form data for file upload
      const formData = new FormData();

      // Add text results if any
      if (testResults.length > 0) {
        const textResults = testResults.map(tr => ({
          id: tr.id,
          result: tr.result,
        }));
        formData.append('patient_tests', JSON.stringify(textResults));
      }

      // Add files if any
      uploadedFiles.forEach(file => {
        formData.append('files', file.file);
        if (file.testId) {
          // Add test association if file is linked to a specific test
          formData.append(
            'file_tests',
            JSON.stringify({
              testId: file.testId,
              fileName: file.file.name,
            })
          );
        }
      });

      // Add technician info
      formData.append('technician', 'Lab Technician');

      console.log('Submitting lab results with files:', {
        textResults: testResults.length,
        files: uploadedFiles.length,
      });

      await LaboratoryService.createLabResult(patientId, formData);

      setSuccess(true);

      // Call success callback if provided
      if (onResultSubmit) {
        onResultSubmit();
      }

      // Close modal after successful submission
      setTimeout(() => {
        onClose();
        setTestResults([]);
        setUploadedFiles([]);
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

  const handleUploadForTest = (testId: string) => {
    if (fileInputRef.current) {
      // Store the test ID in a data attribute
      fileInputRef.current.setAttribute('data-test-id', testId);
      fileInputRef.current.click();
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

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple
            onChange={e => {
              const testId = fileInputRef.current?.getAttribute('data-test-id');
              handleFileUpload(e, testId || undefined);
            }}
          />

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
                    {testResults.length + uploadedFiles.length}
                  </Typography>
                </Paper>

                <Paper sx={{ p: 1.5, minWidth: 100, textAlign: 'center' }}>
                  <Typography variant="body2" color="textSecondary">
                    Files Uploaded
                  </Typography>
                  <Typography variant="h6" color="secondary" fontWeight="bold">
                    {uploadedFiles.length}
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

          {/* Uploaded Files Section */}
          {uploadedFiles.length > 0 && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="primary">
                  Uploaded Files ({uploadedFiles.length})
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AttachFile />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting}
                >
                  Add More Files
                </Button>
              </Box>
              <List>
                {uploadedFiles.map(file => (
                  <ListItem
                    key={file.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveFile(file.id)}
                        disabled={submitting}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.light' }}>
                        {getFileIcon(file.file.type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="medium">
                          {file.file.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {formatFileSize(file.file.size)}
                            {file.testName && ` • For: ${file.testName}`}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {file.file.type}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}

          {/* Upload Button when no files uploaded yet */}
          {uploadedFiles.length === 0 && hasPendingTests() && (
            <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
              <AttachFile sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Upload Result Files (Optional)
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                You can upload PDF or DOC files containing test results. Files can be uploaded for
                specific tests or as general reports.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AttachFile />}
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting}
              >
                Upload Files
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                Maximum file size: 10MB • Supported formats: PDF, DOC, DOCX
              </Typography>
            </Paper>
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
                              <TableCell>File Upload</TableCell>
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
                              const hasFileForTest = uploadedFiles.some(
                                file => file.testId === test.id
                              );

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
                                    {hasFileForTest && (
                                      <Typography variant="caption" color="primary" display="block">
                                        File uploaded
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {canEnterResult ? (
                                      <TextField
                                        fullWidth
                                        size="small"
                                        placeholder="Enter test result (optional)..."
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
                                    {canEnterResult && (
                                      <Button
                                        size="small"
                                        startIcon={<AttachFile />}
                                        onClick={() => handleUploadForTest(test.id)}
                                        disabled={submitting}
                                        variant={hasFileForTest ? 'contained' : 'outlined'}
                                        color={hasFileForTest ? 'success' : 'primary'}
                                      >
                                        {hasFileForTest ? 'File Added' : 'Upload File'}
                                      </Button>
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
        {(hasPendingTests() || uploadedFiles.length > 0) && (
          <Button
            onClick={handleSubmitResults}
            variant="contained"
            color="primary"
            disabled={!canSubmitResults() || submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : <CheckCircle />}
          >
            {submitting
              ? 'Submitting...'
              : `Submit Results (${testResults.length + uploadedFiles.length})`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SubmitLaboratoriesResultModal;
