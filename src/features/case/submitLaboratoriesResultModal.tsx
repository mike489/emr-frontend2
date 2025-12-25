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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getCompletedTestsWithFiles = () => {
    return labTests.flatMap(group =>
      group.tests.filter(test => test.files && test.files.length > 0)
    );
  };

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

      const formData = new FormData();

      // Build patient_tests array
      const testsPayload = labTests
        .flatMap(group =>
          group.tests.map(test => {
            const result = testResults.find(r => r.id === test.id)?.result;
            const files = uploadedFiles.filter(f => f.testId === test.id);

            if (!result?.trim() && files.length === 0) {
              return null; // skip empty test
            }

            return {
              id: test.id,
              result: result?.trim(),
              files,
            };
          })
        )
        .filter(Boolean) as {
        id: string;
        result?: string;
        files: { file: File }[];
      }[];

      if (testsPayload.length === 0) {
        setError('Please enter a result or upload files');
        return;
      }

      // Append to FormData
      testsPayload.forEach((test, testIndex) => {
        formData.append(`patient_tests[${testIndex}][id]`, test.id);

        if (test.result) {
          formData.append(`patient_tests[${testIndex}][result]`, test.result);
        }

        test.files.forEach((fileObj, fileIndex) => {
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
          {/* {!loading && labTests.length > 0 && !hasPendingTests() && (
            <Box textAlign="center" sx={{ py: 4 }}>
              <CheckCircle sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                All Tests Completed
              </Typography>
              <Typography variant="body2" color="textSecondary">
                All laboratory tests have been completed for this patient.
              </Typography>
            </Box>
          )} */}

          {/* No Pending Tests State – Show Completed Files */}
          {!loading && labTests.length > 0 && !hasPendingTests() && (
            <Box>
              {/* Header */}
              <Box display="flex" alignItems="center" justifyContent="center" gap={1} mb={2}>
                <CheckCircle fontSize="small" color="success" />
                <Typography variant="subtitle1" fontWeight={500}>
                  All Tests Completed
                </Typography>
              </Box>

              {/* Files */}
              <Box>
                {getCompletedTestsWithFiles().map(test => (
                  <Box key={test.id} mb={2}>
                    {/* Test name */}
                    <Typography variant="body2" fontWeight={600} color="text.primary" mb={0.5}>
                      {test.test}
                    </Typography>

                    {/* Files list */}
                    <List dense disablePadding>
                      {test.files!.map(file => (
                        <ListItem key={file.uuid} disablePadding sx={{ mb: 0.25 }}>
                          <ListItemButton
                            component="a"
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              {getFileIcon(file.mime_type)}
                            </ListItemIcon>

                            <ListItemText
                              primary={
                                <Typography variant="body2">{file.url.split('/').pop()}</Typography>
                              }
                              secondary={
                                <Typography variant="caption" color="text.secondary">
                                  {file.mime_type}
                                </Typography>
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </Box>
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
