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
  MedicalInformation,
} from '@mui/icons-material';
import { OperationalService } from '../../shared/api/services/operations.service';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';
import PrescriptionModal from './PrescriptionModal';
import { toast } from 'react-toastify';

interface LabTestFile {
  uuid: string;
  url: string;
  mime_type: string;
}

interface LabTestResult {
  id: string;
  test?: string; // From old format
  service_name?: string; // From new API format
  result: string | null;
  amount: string;
  is_payment_completed: boolean;
  technician: string | null;
  created_at: string;
  files?: LabTestFile[];
  lab_test_id?: string;
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
  testId: string;
  testName: string;
}

interface SubmitOperationalResultModalProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onResultSubmit?: () => void;
}

const SubmitOperationalResultModal: React.FC<SubmitOperationalResultModalProps> = ({
  open,
  onClose,
  patientId,
  patientName,
  onResultSubmit,
}) => {
  const [labTests, setLabTests] = useState<LabTestResult[] | LabTestGroup[]>([]);
  const [testResults, setTestResults] = useState<TestResultInput[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [viewingFiles, setViewingFiles] = useState<LabTestFile[] | null>(null);
  const [viewDialogTestName, setViewDialogTestName] = useState<string>('');
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [selectedOpForPrescription, setSelectedOpForPrescription] = useState<LabTestResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to check if data is in grouped format
  const isGroupedFormat = (data: any[]): data is LabTestGroup[] => {
    return data.length > 0 && data[0]?.group_name !== undefined;
  };

  // Get all tests regardless of format
  const getAllTests = (): LabTestResult[] => {
    if (!labTests || !Array.isArray(labTests)) return [];

    if (isGroupedFormat(labTests)) {
      return labTests.flatMap(group => group.tests || []);
    }

    return labTests as LabTestResult[];
  };

  const getCompletedTestsWithFiles = () => {
    return getAllTests().filter(test => test.files && test.files.length > 0 && !!test.result);
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

        const response = await OperationalService.getOperationRequest(patientId);
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

  // const hasPendingTests = () => {
  //   const tests = getAllTests();
  //   return tests.some(test => !test.result);
  // };

  const canSubmitResults = () => {
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

      const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
      const isValidExtension = allowedExtensions.includes(fileExtension);
      const isValidMimeType = allowedMimeTypes.includes(file.type);

      if (!isValidExtension && !isValidMimeType) {
        setError(`Invalid file type: ${file.name}. Allowed types: ${allowedExtensions.join(', ')}`);
        continue;
      }

      if (file.size > maxSize) {
        setError(`File too large: ${file.name}. Maximum size is 10MB.`);
        continue;
      }

      if (fileExtension === '.docx') {
        setError('DOCX files are not accepted. Please save as DOC or PDF instead.');
        continue;
      }

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
    const absoluteUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_EMS_URL}/${url}`;
    window.open(absoluteUrl, '_blank');
  };

  const handleViewLocalFile = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
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

      const formData = new FormData();
      const tests = getAllTests();

      const testsPayload = tests
        .map(test => {
          const resultEntry = testResults.find(r => r.id === test.id);
          const result = resultEntry?.result;
          const files = uploadedFiles.filter(f => f.testId === test.id);

          if (!result?.trim() && files.length === 0) {
            return null;
          }

          return {
            id: test.id,
            result: result?.trim(),
            files,
          };
        })
        .filter(Boolean) as {
        id: string;
        result?: string;
        files: UploadedFile[];
      }[];

      if (testsPayload.length === 0) {
        setError('Please enter a result or upload files');
        setSubmitting(false);
        return;
      }

      testsPayload.forEach((test, testIndex) => {
        formData.append(`patient_services[${testIndex}][id]`, test.id);

        if (test.result) {
          formData.append(`patient_services[${testIndex}][result]`, test.result);
        }

        test.files.forEach((fileObj, fileIndex) => {
          formData.append(`patient_services[${testIndex}][files][${fileIndex}]`, fileObj.file);
        });
      });

      await OperationalService.createOperationResult(patientId, formData);

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
      setError(err.response?.data?.message || 'Failed to submit results');
    } finally {
      setSubmitting(false);
    }
  };

  const getTestStatus = (test: LabTestResult) => {
    if (test.result) return { status: 'Completed', color: 'success' as const };
    return { status: 'Awaiting Results', color: 'warning' as const };
  };

  const handleUploadForTest = (testId: string, testName: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('data-test-id', testId);
      fileInputRef.current.setAttribute('data-test-name', testName);
      fileInputRef.current.click();
    }
  };

  const getFilesForTest = (testId: string) => {
    return uploadedFiles.filter(file => file.testId === testId);
  };

  const handleOpenPrescription = (test: LabTestResult) => {
    setSelectedOpForPrescription(test);
    setPrescriptionOpen(true);
  };

  const handlePrescriptionSubmit = async (data: any) => {
    try {
      setSubmitting(true);
      const orderData = {
        medicines: [data],
        order_date: new Date().toISOString(),
        notes: `Prescription for operation: ${selectedOpForPrescription ? getTestDisplayName(selectedOpForPrescription) : 'Unknown'}`,
      };
      await LaboratoryService.createPharmacyMedicinesOrder(patientId, orderData);
      toast.success('Prescription saved successfully!');
    } catch (err: any) {
      console.error('Failed to save prescription:', err);
      setError(err.response?.data?.message || 'Failed to save prescription');
      toast.error('Failed to save prescription');
    } finally {
      setSubmitting(false);
    }
  };

  const getTestDisplayName = (test: LabTestResult) => {
    return test.service_name || test.test || 'Unknown Operation';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Submit Operational Results</Typography>
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
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Results submitted successfully!
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
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

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" sx={{ py: 4 }}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading operations...</Typography>
            </Box>
          ) : labTests.length === 0 ? (
            <Box textAlign="center" sx={{ py: 4 }}>
              <Science sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary">
                No Operations Found
              </Typography>
            </Box>
          ) : (
            <Box>
              {/* Completed Tests with Files */}
              {getCompletedTestsWithFiles().length > 0 && (
                <Box mb={3}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Completed Operations with Files
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {getCompletedTestsWithFiles().map(test => (
                      <Paper key={test.id} variant="outlined" sx={{ p: 1.5, minWidth: 200 }}>
                        <Typography variant="body2" fontWeight="bold">
                          {getTestDisplayName(test)}
                        </Typography>
                        <Button
                          size="small"
                          startIcon={<Visibility />}
                          onClick={() => {
                            setViewingFiles(test.files || null);
                            setViewDialogTestName(getTestDisplayName(test));
                          }}
                        >
                          View {test.files?.length} Files
                        </Button>
                      </Paper>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Pending or Unsubmitted Results */}
              {isGroupedFormat(labTests) ? (
                labTests.map((group, idx) => {
                  const hasVisibleTests = group.tests.length > 0;
                  if (!hasVisibleTests) return null;
                  return (
                    <Accordion key={idx} defaultExpanded sx={{ mb: 2 }}>
                      <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box
                          sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            {group.group_name}
                          </Typography>
                          <Chip
                            label={`${group.tests.filter(t => !t.result).length} pending`}
                            size="small"
                            color="warning"
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Operation</TableCell>
                                <TableCell>Payment</TableCell>
                                <TableCell>Files</TableCell>
                                <TableCell>Prescription</TableCell>
                                <TableCell width="250px">Result</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {group.tests.map(test => {
                                const isPaid = test.is_payment_completed;
                                const hasRes = !!test.result;
                                const testFiles = getFilesForTest(test.id);
                                return (
                                  <TableRow key={test.id} sx={{ opacity: hasRes ? 0.7 : 1 }}>
                                    <TableCell>{getTestDisplayName(test)}</TableCell>
                                    <TableCell>
                                      <Chip
                                        label={isPaid ? 'Paid' : 'Unpaid'}
                                        size="small"
                                        color={isPaid ? 'success' : 'error'}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Box display="flex" alignItems="center" gap={1}>
                                        <Button
                                          size="small"
                                          startIcon={<AttachFile />}
                                          onClick={() =>
                                            handleUploadForTest(test.id, getTestDisplayName(test))
                                          }
                                          disabled={submitting || !isPaid || hasRes}
                                          variant={testFiles.length > 0 ? 'contained' : 'outlined'}
                                          color={testFiles.length > 0 ? 'success' : 'primary'}
                                        >
                                          {testFiles.length > 0 ? `${testFiles.length}` : 'Upload'}
                                        </Button>
                                        {test.files && test.files.length > 0 && (
                                          <IconButton
                                            size="small"
                                            onClick={() => {
                                              setViewingFiles(test.files || null);
                                              setViewDialogTestName(getTestDisplayName(test));
                                            }}
                                          >
                                            <Visibility fontSize="small" />
                                          </IconButton>
                                        )}
                                      </Box>
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        size="small"
                                        startIcon={<MedicalInformation />}
                                        onClick={() => handleOpenPrescription(test)}
                                        variant="outlined"
                                        color="secondary"
                                        disabled={!isPaid}
                                      >
                                        Add
                                      </Button>
                                    </TableCell>
                                    <TableCell>
                                      {hasRes ? (
                                        <Typography variant="body2">{test.result}</Typography>
                                      ) : (
                                        <TextField
                                          fullWidth
                                          size="small"
                                          placeholder={
                                            isPaid ? 'Enter result...' : 'Payment required'
                                          }
                                          value={getResultValue(test.id)}
                                          onChange={e =>
                                            handleResultChange(test.id, e.target.value)
                                          }
                                          disabled={submitting || !isPaid}
                                        />
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <Chip
                                        label={getTestStatus(test).status}
                                        size="small"
                                        color={getTestStatus(test).color}
                                      />
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
                })
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Operation</TableCell>
                        <TableCell>Payment</TableCell>
                        <TableCell>Files</TableCell>
                        <TableCell>Prescription</TableCell>
                        <TableCell width="250px">Result</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getAllTests().map(test => {
                        const isPaid = test.is_payment_completed;
                        const hasRes = !!test.result;
                        const testFiles = getFilesForTest(test.id);
                        return (
                          <TableRow key={test.id} sx={{ opacity: hasRes ? 0.7 : 1 }}>
                            <TableCell>{getTestDisplayName(test)}</TableCell>
                            <TableCell>
                              <Chip
                                label={isPaid ? 'Paid' : 'Unpaid'}
                                size="small"
                                color={isPaid ? 'success' : 'error'}
                              />
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Button
                                  size="small"
                                  startIcon={<AttachFile />}
                                  onClick={() =>
                                    handleUploadForTest(test.id, getTestDisplayName(test))
                                  }
                                  disabled={submitting || !isPaid || hasRes}
                                  variant={testFiles.length > 0 ? 'contained' : 'outlined'}
                                  color={testFiles.length > 0 ? 'success' : 'primary'}
                                >
                                  {testFiles.length > 0 ? `${testFiles.length}` : 'Upload'}
                                </Button>
                                {test.files && test.files.length > 0 && (
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      setViewingFiles(test.files || null);
                                      setViewDialogTestName(getTestDisplayName(test));
                                    }}
                                  >
                                    <Visibility fontSize="small" />
                                  </IconButton>
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                startIcon={<MedicalInformation />}
                                onClick={() => handleOpenPrescription(test)}
                                variant="outlined"
                                color="secondary"
                                disabled={!isPaid}
                              >
                                Add
                              </Button>
                            </TableCell>
                            <TableCell>
                              {hasRes ? (
                                <Typography variant="body2">{test.result}</Typography>
                              ) : (
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder={isPaid ? 'Enter result...' : 'Payment required'}
                                  value={getResultValue(test.id)}
                                  onChange={e => handleResultChange(test.id, e.target.value)}
                                  disabled={submitting || !isPaid}
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={getTestStatus(test).status}
                                size="small"
                                color={getTestStatus(test).color}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>
          )}

          {/* New Files List */}
          {uploadedFiles.length > 0 && (
            <Paper sx={{ p: 2, mt: 3, bgcolor: 'action.hover' }}>
              <Typography variant="subtitle2" fontWeight="bold">
                New Files to Upload
              </Typography>
              <List dense>
                {uploadedFiles.map(file => (
                  <ListItem
                    key={file.id}
                    secondaryAction={
                      <Box>
                        <IconButton size="small" onClick={() => handleViewLocalFile(file.file)}>
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveFile(file.id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      <AttachFile fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={file.file.name}
                      secondary={`${file.testName} • ${formatFileSize(file.file.size)}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmitResults}
          variant="contained"
          color="primary"
          disabled={!canSubmitResults() || submitting}
          startIcon={submitting ? <CircularProgress size={16} /> : <CheckCircle />}
        >
          {submitting ? 'Submitting...' : 'Submit Results'}
        </Button>
      </DialogActions>

      {/* File List Dialog */}
      <Dialog open={!!viewingFiles} onClose={() => setViewingFiles(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Files for {viewDialogTestName}</DialogTitle>
        <DialogContent>
          <List>
            {viewingFiles?.map((file, idx) => (
              <ListItem key={file.uuid || idx} disablePadding>
                <ListItemButton onClick={() => handleViewFile(file.url)}>
                  <ListItemIcon>{getFileIcon(file.mime_type)}</ListItemIcon>
                  <ListItemText primary={file.url.split('/').pop()} secondary={file.mime_type} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewingFiles(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Prescription Modal */}
      {selectedOpForPrescription && (
        <PrescriptionModal
          open={prescriptionOpen}
          onClose={() => setPrescriptionOpen(false)}
          medicineId={selectedOpForPrescription?.lab_test_id || selectedOpForPrescription?.id || ''}
          patientName={patientName}
          operationName={getTestDisplayName(selectedOpForPrescription)}
          onSubmit={handlePrescriptionSubmit}
        />
      )}
    </Dialog>
  );
};

export default SubmitOperationalResultModal;
