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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  ListItemButton,
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
  Visibility,
} from '@mui/icons-material';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';

interface LabTestFile {
  uuid: string;
  url: string;
  mime_type: string;
}

interface LabTestResult {
  id: string;
  test: string;
  result: string | null;
  amount: string;
  is_payment_completed: boolean;
  technician: string | null;
  created_at: string;
  files?: LabTestFile[];
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
  testId: string; // Required - always associate with specific test
  testName: string; // Required - for display and organization
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
  const [viewingFiles, setViewingFiles] = useState<LabTestFile[] | null>(null);
  const [viewDialogTestName, setViewDialogTestName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // const getCompletedTestsWithFiles = () => {
  //   return labTests.flatMap(group =>
  //     group.tests.filter(test => test.files && test.files.length > 0)
  //   );
  // };

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
    return labTests.some(
      group => group.tests.some(test => !test.result) // Show ALL tests without results
    );
  };

  const canSubmitResults = () => {
    // Allow submission if there are any pending tests with entered results OR files uploaded
    const hasResultsForPendingTests = testResults.some(result => {
      const test = labTests.flatMap(g => g.tests).find(t => t.id === result.id);
      return test && !test.result; // Only count results for tests that don't have results yet
    });

    return hasResultsForPendingTests || uploadedFiles.length > 0;
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    testId: string,
    testName: string
  ) => {
    const files = event.target.files;
    if (!files || !testId) return;

    const newFiles: UploadedFile[] = [];

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.svg', '.pdf', '.doc'];
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = file.name.toLowerCase();

      // Check file extension
      const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
      const isValidExtension = allowedExtensions.includes(fileExtension);
      const isValidMimeType = allowedMimeTypes.includes(file.type);

      if (!isValidExtension && !isValidMimeType) {
        setError(`Invalid file type: ${file.name}. Allowed types: ${allowedExtensions.join(', ')}`);
        continue;
      }

      // Validate file size
      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Maximum size is 10MB.`);
        continue;
      }

      // For .docx files, we need to handle them specially since server doesn't accept them
      if (fileExtension === '.docx') {
        setError('DOCX files are not accepted. Please save as DOC or PDF instead.');
        continue;
      }

      // Create a new File object to ensure it's valid
      const validFile = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });

      newFiles.push({
        id: `${testId}-${Date.now()}-${i}`,
        file: validFile,
        testId,
        testName,
      });
    }

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      setError(null);
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
    if (fileType.includes('image')) return <Description />;
    return <InsertDriveFile />;
  };

  const handleViewFile = (url: string) => {
    if (!url) return;
    // Check if URL is already absolute
    const absoluteUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_EMS_URL}/${url}`;
    window.open(absoluteUrl, '_blank');
  };

  const handleViewLocalFile = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    // We don't revoke here because it might be needed again, 
    // but in a real app you'd manage these URLs.
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const organizeFilesByTest = () => {
    const organized: Record<string, UploadedFile[]> = {};

    uploadedFiles.forEach(file => {
      if (!organized[file.testId]) {
        organized[file.testId] = [];
      }
      organized[file.testId].push(file);
    });

    return organized;
  };

  const handleSubmitResults = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Filter for tests that actually have something to submit
      const testsToSubmit = labTests
        .flatMap(group => group.tests)
        .filter(test => {
          const hasResult = testResults.find(r => r.id === test.id)?.result?.trim();
          const hasFiles = uploadedFiles.filter(f => f.testId === test.id).length > 0;
          return !test.result && (hasResult || hasFiles); // Only submit if test doesn't have result yet AND has new data
        });

      if (testsToSubmit.length === 0) {
        setError('Please enter results or upload files for pending tests');
        return;
      }

      const formData = new FormData();

      // Build patient_tests array
      testsToSubmit.forEach((test, testIndex) => {
        const result = testResults.find(r => r.id === test.id)?.result;
        const files = uploadedFiles.filter(f => f.testId === test.id);

        formData.append(`patient_tests[${testIndex}][id]`, test.id);

        if (result?.trim()) {
          formData.append(`patient_tests[${testIndex}][result]`, result.trim());
        }

        files.forEach((fileObj, fileIndex) => {
          formData.append(`patient_tests[${testIndex}][files][${fileIndex}]`, fileObj.file);
        });
      });

      // 🔍 Debug (remove in prod)
      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      await LaboratoryService.createLabResult(patientId, formData);

      setSuccess(true);
      onResultSubmit?.();

      setTimeout(() => {
        onClose();
        setTestResults([]);
        setUploadedFiles([]);
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit laboratory results');
    } finally {
      setSubmitting(false);
    }
  };

  const getTestStatus = (test: LabTestResult) => {
    if (test.result) return { status: 'Completed', color: 'success' as const };
    if (test.is_payment_completed)
      return { status: 'Ready for Results', color: 'warning' as const };
    return { status: 'Payment Required', color: 'error' as const };
  };

  const handleUploadForTest = (testId: string, testName: string) => {
    if (fileInputRef.current) {
      // Store the test ID and name in data attributes
      fileInputRef.current.setAttribute('data-test-id', testId);
      fileInputRef.current.setAttribute('data-test-name', testName);
      fileInputRef.current.click();
    }
  };

  // Get files for a specific test
  const getFilesForTest = (testId: string) => {
    return uploadedFiles.filter(file => file.testId === testId);
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
          Patient: {patientName}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Laboratory results submitted successfully! Files will be organized in patient_tests
              directory.
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
            // Match server requirements: jpg, jpeg, png, svg, pdf, doc
            accept=".jpg,.jpeg,.png,.svg,.pdf,.doc,image/jpeg,image/png,image/svg+xml,application/pdf,application/msword"
            multiple
            onChange={e => {
              const testId = fileInputRef.current?.getAttribute('data-test-id');
              const testName = fileInputRef.current?.getAttribute('data-test-name');
              if (testId && testName) {
                handleFileUpload(e, testId, testName);
              }
            }}
          />

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

          {/* Laboratory Tests List - Shows ALL tests (both with and without results) */}
          {!loading && labTests.length > 0 && (
            <Box>
              {labTests.map((group, groupIndex) => {
                const allTests = group.tests;
                const pendingTests = group.tests.filter(test => !test.result);
                const completedTests = group.tests.filter(test => test.result);

                if (allTests.length === 0) return null;

                // Count tests by payment status for better display
                const unpaidTests = pendingTests.filter(test => !test.is_payment_completed).length;
                const paidTests = pendingTests.filter(test => test.is_payment_completed).length;

                return (
                  <Accordion key={groupIndex} defaultExpanded sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ width: '100%' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {group.group_name}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            {pendingTests.length > 0 && (
                              <Chip
                                label={`${pendingTests.length} pending`}
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                            )}
                            {completedTests.length > 0 && (
                              <Chip
                                label={`${completedTests.length} completed`}
                                size="small"
                                color="success"
                              />
                            )}
                            {unpaidTests > 0 && (
                              <Chip
                                label={`${unpaidTests} need payment`}
                                size="small"
                                color="error"
                              />
                            )}
                            {paidTests > 0 && (
                              <Chip
                                label={`${paidTests} ready`}
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            )}
                            {pendingTests.length > 0 && (
                              <Chip
                                label={`${
                                  pendingTests.filter(
                                    test =>
                                      testResults.some(tr => tr.id === test.id) ||
                                      getFilesForTest(test.id).length > 0
                                  ).length
                                } in progress`}
                                size="small"
                                color="primary"
                              />
                            )}
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
                              <TableCell>Payment Status</TableCell>
                              <TableCell>File Upload</TableCell>
                              <TableCell width="250px">Result</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Requested Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {group.tests.map((test, testIndex) => {
                              const status = getTestStatus(test);
                              const canEnterResult = !test.result; // Allow entry for tests without results
                              const isSelected = testResults.some(tr => tr.id === test.id);
                              const testFiles = getFilesForTest(test.id);
                              const hasFiles = testFiles.length > 0;
                              const isPaid = test.is_payment_completed;
                              const hasExistingResult = !!test.result;
                              const hasExistingFiles = test.files && test.files.length > 0;

                              return (
                                <TableRow
                                  key={testIndex}
                                  sx={{
                                    opacity: hasExistingResult ? 0.8 : 1,
                                    backgroundColor:
                                      isSelected || hasFiles ? 'action.selected' : 'transparent',
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                    },
                                  }}
                                >
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      fontWeight={canEnterResult ? 'bold' : 'normal'}
                                      color={
                                        !isPaid && !hasExistingResult
                                          ? 'text.secondary'
                                          : 'text.primary'
                                      }
                                    >
                                      {test.test}
                                      {!isPaid && !hasExistingResult && (
                                        <Typography
                                          variant="caption"
                                          color="error"
                                          display="block"
                                          sx={{ fontStyle: 'italic' }}
                                        >
                                          Payment required
                                        </Typography>
                                      )}
                                      {hasExistingFiles && (
                                        <Typography
                                          variant="caption"
                                          color="primary"
                                          display="block"
                                        >
                                          {test.files!.length} existing file(s)
                                        </Typography>
                                      )}
                                      {hasFiles && (
                                        <Typography
                                          variant="caption"
                                          color="secondary"
                                          display="block"
                                        >
                                          {testFiles.length} new file(s) to upload
                                        </Typography>
                                      )}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Chip
                                      label={isPaid ? 'Paid' : 'Unpaid'}
                                      size="small"
                                      color={isPaid ? 'success' : 'error'}
                                      variant={isPaid ? 'filled' : 'outlined'}
                                    />
                                  </TableCell>

                                  <TableCell>
                                    {hasExistingResult ? (
                                      // Show existing files if test is completed
                                      hasExistingFiles ? (
                                        <Box>
                                          <Button
                                            size="small"
                                            startIcon={<Visibility />}
                                            onClick={() => {
                                              if (test.files && test.files.length === 1) {
                                                handleViewFile(test.files[0].url);
                                              } else if (test.files && test.files.length > 1) {
                                                setViewingFiles(test.files);
                                                setViewDialogTestName(test.test);
                                              }
                                            }}
                                            variant="outlined"
                                            color="primary"
                                          >
                                            View Files ({test.files!.length})
                                          </Button>
                                        </Box>
                                      ) : (
                                        <Typography variant="caption" color="textSecondary">
                                          No files
                                        </Typography>
                                      )
                                    ) : canEnterResult ? (
                                      // Allow upload for pending tests
                                      <Button
                                        size="small"
                                        startIcon={<AttachFile />}
                                        onClick={() => handleUploadForTest(test.id, test.test)}
                                        disabled={submitting}
                                        variant={hasFiles ? 'contained' : 'outlined'}
                                        color={hasFiles ? 'success' : 'primary'}
                                        sx={{
                                          opacity: !isPaid ? 0.7 : 1,
                                          '&:disabled': { opacity: 0.5 },
                                        }}
                                      >
                                        {hasFiles ? `${testFiles.length} File(s)` : 'Upload File'}
                                      </Button>
                                    ) : null}
                                  </TableCell>

                                  <TableCell>
                                    {hasExistingResult ? (
                                      // Show existing result for completed tests
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            fontFamily: 'monospace',
                                            backgroundColor: 'white',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            border: '1px solid #e0e0e0',
                                            color: 'success.dark',
                                            fontWeight: 'medium',
                                          }}
                                        >
                                          {test.result}
                                        </Typography>
                                        {test.technician && (
                                          <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            display="block"
                                          >
                                            By: {test.technician}
                                          </Typography>
                                        )}
                                      </Box>
                                    ) : canEnterResult ? (
                                      // Allow editing for pending tests
                                      <TextField
                                        fullWidth
                                        size="small"
                                        placeholder={
                                          isPaid
                                            ? 'Enter test result...'
                                            : 'Enter result (payment pending)...'
                                        }
                                        value={getResultValue(test.id)}
                                        onChange={e => handleResultChange(test.id, e.target.value)}
                                        disabled={submitting}
                                        onFocus={() => {
                                          if (!isSelected) {
                                            handleResultChange(
                                              test.id,
                                              getResultValue(test.id) || ''
                                            );
                                          }
                                        }}
                                        sx={{
                                          '& .MuiOutlinedInput-root': {
                                            backgroundColor: !isPaid
                                              ? 'rgba(255, 0, 0, 0.04)'
                                              : 'transparent',
                                            borderColor: !isPaid
                                              ? 'rgba(255, 0, 0, 0.2)'
                                              : undefined,
                                          },
                                        }}
                                      />
                                    ) : (
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          fontStyle: 'italic',
                                          color: 'text.secondary',
                                        }}
                                      >
                                        N/A
                                      </Typography>
                                    )}
                                  </TableCell>

                                  <TableCell>
                                    <Chip
                                      label={status.status}
                                      color={status.color}
                                      size="small"
                                      variant={hasExistingResult ? 'filled' : 'outlined'}
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

          {/* Uploaded Files Section - Organized by Test */}
          {uploadedFiles.length > 0 && (
            <Paper sx={{ p: 2, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="primary">
                  New Files to Upload ({uploadedFiles.length})
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Files will be organized in: patient_tests/test_id/
                </Typography>
              </Box>

              {Object.entries(organizeFilesByTest()).map(([testId, files]) => {
                const test = labTests.flatMap(g => g.tests).find(t => t.id === testId);
                return (
                  <Box
                    key={testId}
                    sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 1, p: 2 }}
                  >
                    <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                      {test?.test || 'Unknown Test'} ({files.length} new file(s))
                      <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                        Test ID: {testId}
                      </Typography>
                    </Typography>
                    <List>
                      {files.map(file => (
                        <ListItem
                          key={file.id}
                          secondaryAction={
                            <Box display="flex" gap={1}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleViewLocalFile(file.file)}
                                title="View file"
                              >
                                <Visibility />
                              </IconButton>
                              <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleRemoveFile(file.id)}
                                disabled={submitting}
                                color="error"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
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
                                  {formatFileSize(file.file.size)} • {file.file.type}
                                </Typography>
                                <Typography variant="caption" color="primary">
                                  Will be saved to: patient_tests/{testId}/
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                );
              })}
            </Paper>
          )}
        </Box>

        {/* Existing Files Viewer Dialog */}
        <Dialog
          open={Boolean(viewingFiles)}
          onClose={() => setViewingFiles(null)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Files for {viewDialogTestName}</Typography>
              <IconButton onClick={() => setViewingFiles(null)} size="small">
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <List>
              {viewingFiles?.map((file, index) => (
                <ListItem key={file.uuid || index} disablePadding>
                  <ListItemButton onClick={() => handleViewFile(file.url)}>
                    <ListItemIcon>{getFileIcon(file.mime_type)}</ListItemIcon>
                    <ListItemText
                      primary={`File ${index + 1}`}
                      secondary={file.mime_type}
                    />
                    <Visibility color="action" />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewingFiles(null)}>Close</Button>
          </DialogActions>
        </Dialog>
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
              ? 'Uploading... (This may take a minute)'
              : `Submit Results (${testResults.length} text + ${uploadedFiles.length} files)`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SubmitLaboratoriesResultModal;
