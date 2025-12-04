import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Eye, FileUp, Send } from 'lucide-react';
import type { Patient } from '../../shared/api/types/patient.types';

interface Attachment {
  name: string;
  mime_type: string;
  size: string;
  url: string;
}

interface PatientTableProps {
  patients: Patient[];
  loading?: boolean;
  uploadingId?: string | null;
  onViewDetails: (patient: Patient) => void;
  onCheckout: (patient: Patient) => void;
  onPay: (patient: Patient) => void;
  onSendToTriage: (patient: Patient) => void;
  onAttachFiles: (patientId: string, files: FileList | null) => void;
  onViewAttachments: (attachments: Attachment[]) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  loading = false,
  uploadingId = '',
  onViewDetails,
  onCheckout,
  onSendToTriage,
  //   onAttachFiles,
  //   onViewAttachments,
}) => {
  if (loading) {
    return (
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!patients || patients.length === 0) {
    return (
      <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
        <Typography>No patients found.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ px: 4 }}>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              '& th': {
                borderBottom: '2px solid #e0e0e0',
              },
            }}
          >
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 50,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Category
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 110,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Patient Name
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 110,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              MRN
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 60,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Age
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 80,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Gender
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 120,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Phone
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 120,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              City
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 10,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {' '}
              Blood Type
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 120,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Visit Type
            </TableCell>
            {/* <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 120,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Payment
            </TableCell> */}
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 120,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Checkout
            </TableCell>
            {/* <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 120,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Pay
            </TableCell> */}
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 120,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Payment Status
            </TableCell>
            <TableCell
              sx={{
                fontWeight: 'bold',
                color: 'white',
                width: 120,
                fontSize: '0.8rem',
                py: 1.5,
                borderRight: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map(patient => (
            <TableRow key={patient.id} hover>
              {/* Category Color */}
              <TableCell>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '4px',
                    backgroundColor: patient.patient_category?.color || '#ccc',
                  }}
                />
              </TableCell>

              {/* Patient Name */}
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  {patient.full_name}
                </Typography>
                {patient.title && (
                  <Typography variant="body2" color="text.secondary">
                    {patient.title}
                  </Typography>
                )}
              </TableCell>

              <TableCell>{patient.emr_number}</TableCell>
              <TableCell>{patient.age} yrs</TableCell>
              <TableCell>
                <Chip
                  label={patient.gender}
                  size="small"
                  variant="outlined"
                  sx={{
                    height: '24px',
                    fontSize: '0.75rem',
                    borderColor: patient.gender === 'Male' ? '#2196f3' : '#e91e63',
                    color: patient.gender === 'Male' ? '#2196f3' : '#e91e63',
                    fontWeight: '500',
                  }}
                />
              </TableCell>
              <TableCell>{patient.phone}</TableCell>
              <TableCell>{patient.address?.city}</TableCell>
              <TableCell>
                {' '}
                <Chip
                  label={patient.blood_type || 'N/A'}
                  size="small"
                  sx={{
                    height: '24px',
                    fontSize: '0.75rem',
                    backgroundColor: '#ffebee',
                    color: '#c62828',
                    fontWeight: 'bold',
                  }}
                />
              </TableCell>
              <TableCell>{patient.visit_type || 'N/A'}</TableCell>

              {/* <TableCell>
                <Select
                  value={patient.flags?.bill_paid ? 'Paid' : 'Unpaid'}
                  size="small"
                  sx={{ minWidth: 100 }}
                  // onChange={(e) => onChangePaymentStatus(patient, e.target.value)}
                  renderValue={selected => (
                    <Chip
                      label={selected}
                      color={selected === 'Paid' ? 'success' : 'error'}
                      variant="filled"
                      size="small"
                      sx={{ fontWeight: 'bold', p: 1 }}
                    />
                  )}
                >
                  <MenuItem value="Paid">
                    <Chip
                      label="Paid"
                      color="success"
                      variant="filled"
                      size="small"
                      sx={{ fontWeight: 'bold', p: 1 }}
                    />
                  </MenuItem>
                  <MenuItem value="Unpaid">
                    <Chip
                      label="Unpaid"
                      color="error"
                      variant="filled"
                      size="small"
                      sx={{ fontWeight: 'bold', p: 1 }}
                    />
                  </MenuItem>
                </Select>
              </TableCell> */}

              {/* Checkout Button */}
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  color={patient.flags?.is_checked_out ? 'warning' : 'success'}
                  onClick={() => onCheckout(patient)}
                >
                  {patient.flags?.is_checked_out ? 'Checkin' : 'Checkout'}
                </Button>
              </TableCell>

              {/* Pay Button */}
              {/* <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  color="primary"
                  disabled={!patient.flags.bill_paid}
                  onClick={() => onPay(patient)}
                >
                  Pay
                </Button>
              </TableCell> */}

              {/* Status */}
              <TableCell>
                <Chip
                  label={patient.flags?.bill_paid ? 'Paid' : 'Not Paid'}
                  color={patient.flags?.bill_paid ? 'success' : 'warning'}
                  size="small"
                />
              </TableCell>

              {/* Actions */}
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  {/* Send to Triage */}
                  <Tooltip
                    title={
                      patient.flags?.can_be_send_to_triage
                        ? 'Send to Triage'
                        : 'Cannot send to triage'
                    }
                  >
                    <span>
                      <IconButton
                        size="small"
                        onClick={() => onSendToTriage(patient)}
                        disabled={!patient.flags?.can_be_send_to_triage}
                        sx={{
                          bgcolor: patient.flags?.can_be_send_to_triage ? '#1976d2' : '#9e9e9e',
                          color: patient.flags?.can_be_send_to_triage ? '#fff' : '#000',
                          '&:hover': {
                            backgroundColor: patient.flags?.can_be_send_to_triage
                              ? 'rgba(25, 118, 210, 0.1)'
                              : 'transparent',
                          },
                        }}
                      >
                        <Send size={20} />
                      </IconButton>
                    </span>
                  </Tooltip>

                  {/* View Details */}
                  <Tooltip title="View Details">
                    <IconButton
                      size="small"
                      onClick={() => onViewDetails(patient)}
                      sx={{
                        bgcolor: '#4caf50',
                        color: '#fff',
                        '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
                      }}
                    >
                      <Eye size={20} />
                    </IconButton>
                  </Tooltip>

                  {/* Attach Files */}

                  <Tooltip title="Attach files for this patient" arrow>
                    <span>
                      <IconButton
                        size="small"
                        disabled={uploadingId === patient.id}
                        onClick={() => {
                          const fileInput = document.querySelector(
                            'input[type="file"]'
                          ) as HTMLInputElement | null;
                          fileInput?.click();

                          if (fileInput) {
                            fileInput.dataset.patientId = patient.id;
                          }
                        }}
                        sx={{
                          backgroundColor: '#626568',
                          color: 'white',
                          '&:hover': { backgroundColor: '#000000' },
                        }}
                      >
                        {uploadingId === patient.id ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <FileUp size={18} />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>

                  {/* View Attachments */}
                  {/* {patient?.attachments?.length > 0 && (
      <Tooltip title="View Attachments">
        <IconButton
          size="small"
          onClick={() => onViewAttachments(patient.attachments || [])}
          sx={{
            color: '#9c27b0', // purple
            '&:hover': { backgroundColor: 'rgba(156, 39, 176, 0.1)' },
          }}
        >
          <FileSearch size={20} />
        </IconButton>
      </Tooltip>
    )} */}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientTable;
