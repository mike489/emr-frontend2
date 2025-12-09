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

  const canSubmitResults = () => {
    // Allow submission if there are any results entered OR files uploaded
    return testResults.length > 0 || uploadedFiles.length > 0;
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    testId: string,
    testName: string
  ) => {
    const files = event.target.files;
    if (!files || !testId) return;

    const newFiles: UploadedFile[] = [];

    // Server accepts these extensions: jpg, jpeg, png, svg, pdf, doc
    // Note: docx is NOT accepted by server according to error message
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
    if (fileType.includes('image')) return <Description />; // You can add an image icon if needed
    return <InsertDriveFile />;
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

      // Validate before submission
      const allTests = labTests.flatMap(g => g.tests);
      const testsWithData = allTests.filter(test => {
        const hasResult = testResults.some(r => r.id === test.id && r.result?.trim());
        const hasFiles = uploadedFiles.some(f => f.testId === test.id);
        return hasResult || hasFiles;
      });

      if (testsWithData.length === 0) {
        setError('Please enter results or upload files for at least one test');
        setSubmitting(false);
        return;
      }

      const formData = new FormData();

      // 1. Create an array of test objects with exactly 4 properties
      const testsData = testsWithData.map(test => {
        const tr = testResults.find(r => r.id === test.id);
        const filesForTest = uploadedFiles.filter(f => f.testId === test.id);

        // Each test object must have exactly these 4 properties:
        return {
          id: test.id, // Property 1
          result: tr?.result?.trim() || (filesForTest.length > 0 ? 'FILE_ATTACHED' : ''), // Property 2
          has_files: filesForTest.length > 0, // Property 3
          technician: 'Lab Technician', // Property 4
        };
      });

      testsData.forEach((test, index) => {
        // Append each test as individual form fields
        formData.append(`patient_tests[${index}][id]`, test.id);
        formData.append(`patient_tests[${index}][result]`, test.result);
        formData.append(`patient_tests[${index}][has_files]`, test.has_files.toString());
        formData.append(`patient_tests[${index}][technician]`, test.technician);
      });

      // OR if server expects a single field with JSON array:
      // formData.append('patient_tests', JSON.stringify(testsData));

      // 2. Append files separately
      testsWithData.forEach(test => {
        const filesForTest = uploadedFiles.filter(f => f.testId === test.id);

        if (filesForTest.length > 0) {
          filesForTest.forEach((fileObj, _fileIndex) => {
            // Validate file size before appending
            if (fileObj.file.size > 10 * 1024 * 1024) {
              throw new Error(`File ${fileObj.file.name} exceeds 10MB limit`);
            }

            // Check if file is valid
            if (fileObj.file instanceof File && fileObj.file.size > 0) {
              // Use proper naming convention for files
              formData.append(`patient_tests_files[${test.id}][]`, fileObj.file, fileObj.file.name);
            } else {
              console.warn('Skipping invalid file:', fileObj);
            }
          });
        }
      });

      formData.append('patientId', patientId);

      // Debug: Log FormData entries
      console.log('=== FormData Debug ===');
      console.log('Tests Data:', testsData);
      console.log('Total Files:', uploadedFiles.length);
      console.log('FormData entries:');

      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // Call API
      await LaboratoryService.createLabResult(patientId, formData);

      setSuccess(true);
      if (onResultSubmit) onResultSubmit();

      setTimeout(() => {
        onClose();
        setTestResults([]);
        setUploadedFiles([]);
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      console.error('Error submitting lab results:', err);

      // Handle timeout specifically
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        setError(
          'Submission timeout. The server is taking too long to respond. Please try again with fewer files or smaller file sizes.'
        );
      } else if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .filter((msg, index, arr) => arr.indexOf(msg) === index)
          .join(', ');
        setError(`Validation errors: ${errorMessages}`);

        // Log detailed error for debugging
        console.log('Server validation errors:', err.response.data.errors);
      } else {
        setError(err.response?.data?.message || 'Failed to submit laboratory results');
      }
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
                                pendingTests.filter(
                                  test =>
                                    testResults.some(tr => tr.id === test.id) ||
                                    getFilesForTest(test.id).length > 0
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
                              <TableCell>File Upload</TableCell>
                              <TableCell width="250px">Result</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Requested Date</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {group.tests.map((test, testIndex) => {
                              const status = getTestStatus(test);
                              const canEnterResult = !test.result && test.is_payment_completed;
                              const isSelected = testResults.some(tr => tr.id === test.id);
                              const testFiles = getFilesForTest(test.id);
                              const hasFiles = testFiles.length > 0;

                              return (
                                <TableRow
                                  key={testIndex}
                                  sx={{
                                    opacity: test.result ? 0.7 : 1,
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
                                    >
                                      {test.test}
                                    </Typography>
                                    {hasFiles && (
                                      <Typography variant="caption" color="primary" display="block">
                                        {testFiles.length} file(s) uploaded for this test
                                      </Typography>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {canEnterResult && (
                                      <Button
                                        size="small"
                                        startIcon={<AttachFile />}
                                        onClick={() => handleUploadForTest(test.id, test.test)}
                                        disabled={submitting}
                                        variant={hasFiles ? 'contained' : 'outlined'}
                                        color={hasFiles ? 'success' : 'primary'}
                                      >
                                        {hasFiles ? `${testFiles.length} File(s)` : 'Upload File'}
                                      </Button>
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
                  Uploaded Files ({uploadedFiles.length})
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
                      {test?.test || 'Unknown Test'} ({files.length} file(s))
                      <Typography variant="caption" color="textSecondary" sx={{ ml: 2 }}>
                        Test ID: {testId}
                      </Typography>
                    </Typography>
                    <List>
                      {files.map(file => (
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
              : `Submit (${testResults.length} text + ${uploadedFiles.length} files)`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SubmitLaboratoriesResultModal;
