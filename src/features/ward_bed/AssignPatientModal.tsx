import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Autocomplete,
  Alert,
} from '@mui/material';
import { toast } from 'react-toastify';
import { BedAndWardService } from '../../shared/api/services/BedandWard.service';
import { PatientService } from '../../shared/api/services/patient.service';

interface Patient {
  id: string;
  full_name: string;
  gender?: string;
  age?: number;
  // Add other patient fields as needed
}

interface AssignPatientModalProps {
  open: boolean;
  onClose: () => void;
  bed: {
    id: string;
    bed_number: string;
    ward: { name: string };
  };
  onSuccess?: () => void;
}

interface ApiResponse {
  success: boolean;
  message: string;
  status: number;
  data:
    | {
        data?: Patient[]; // Check if data is nested
        patients?: Patient[]; // Alternative property name
        // Or it could be directly an array
      }
    | Patient[]; // Could be array directly
}

const AssignPatientModal: React.FC<AssignPatientModalProps> = ({
  open,
  onClose,
  bed,
  onSuccess,
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPatients, setFetchingPatients] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesError, setNotesError] = useState('');

  // Fetch patients from API
  const fetchPatients = async () => {
    if (!open) return;

    setFetchingPatients(true);
    try {
      const axiosResponse = await PatientService.getAll();
      const response: ApiResponse = axiosResponse.data;

      let patientsData: Patient[] = [];

      if (response.success) {
        // Handle different possible response structures
        if (Array.isArray(response.data)) {
          // If data is directly an array
          patientsData = response.data;
        } else if (response.data && Array.isArray((response.data as any).data)) {
          patientsData = (response.data as any).data;
        } else if (response.data && Array.isArray((response.data as any).patients)) {
          patientsData = (response.data as any).patients;
        } else if (Array.isArray((response as any).data)) {
          patientsData = (response as any).data;
        } else {
          console.warn('Unexpected API response structure:', response);
          toast.error('Unexpected data format received from server');
        }

        if (patientsData.length > 0) {
          patientsData = patientsData.map(patient => ({
            id: patient.id || '',
            full_name: patient.full_name || 'Unknown Patient',
            gender: patient.gender,
            age: patient.age,
          }));

          setPatients(patientsData);
        } else {
          toast.info('No patients found in the system');
        }
      } else {
        toast.error(response.message || 'Failed to fetch patients');
      }
    } catch (err: any) {
      console.error('Error fetching patients:', err);
      toast.error(err.response?.data?.message || 'Failed to fetch patients');
    } finally {
      setFetchingPatients(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchPatients();
      // Reset form
      setSelectedPatient(null);
      setNotes('');
      setNotesError('');
    }
  }, [open]);

  // Validate notes
  const validateNotes = () => {
    if (!notes.trim()) {
      setNotesError('Notes are required for patient assignment');
      return false;
    }
    if (notes.length > 500) {
      setNotesError('Notes cannot exceed 500 characters');
      return false;
    }
    setNotesError('');
    return true;
  };

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNotes(value);

    // Clear error when user starts typing
    if (notesError && value.trim()) {
      setNotesError('');
    }
  };

  // Handle assign patient
  const handleAssign = async () => {
    if (!selectedPatient) {
      toast.error('Please select a patient');
      return;
    }

    if (!validateNotes()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare the request body exactly as required
      const requestBody = {
        patient_id: selectedPatient.id,
        notes: notes.trim(),
      };

      await BedAndWardService.assignBed(bed.id, requestBody);
      toast.success(`Patient assigned to bed ${bed.bed_number} successfully!`);

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error assigning patient:', error);
      toast.error(error.response?.data?.message || 'Failed to assign patient');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading && !fetchingPatients) {
      setSelectedPatient(null);
      setNotes('');
      setNotesError('');
      onClose();
    }
  };

  // Filter patients (optional: filter out already assigned patients)
  const availablePatients = patients || []; // Ensure it's always an array

  // Safe getOptionLabel function
  const getOptionLabel = (option: Patient) => {
    const name = option.full_name || 'Unknown Patient';
    const age = option.age ? ` (${option.age}` : '';
    const gender = option.gender ? `${age ? ', ' : ' ('}${option.gender}` : '';
    const suffix = age || gender ? `${age}${gender})` : '';
    return `${name}${suffix}`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', pb: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h6" fontWeight="600">
          Assign Patient to Bed
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
          Bed {bed.bed_number} in {bed.ward.name}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Alert severity="info" sx={{ borderRadius: 1 }}>
            <Typography variant="body2">
              Select a patient to assign to this bed. The bed status will change to "Occupied".
            </Typography>
          </Alert>

          {/* Patient Selection */}
          <Box>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Select Patient *
            </Typography>
            {fetchingPatients ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Loading patients...
                </Typography>
              </Box>
            ) : (
              <Autocomplete
                options={availablePatients}
                getOptionLabel={getOptionLabel}
                value={selectedPatient}
                onChange={(_, value) => setSelectedPatient(value)}
                loading={fetchingPatients}
                disabled={loading}
                renderInput={params => (
                  <TextField
                    {...params}
                    size="small"
                    placeholder="Search patient by name..."
                    error={!selectedPatient && !!patients.length}
                    helperText={
                      !selectedPatient && !!patients.length ? 'Please select a patient' : ''
                    }
                    InputProps={{
                      ...params.InputProps,
                      sx: { borderRadius: 1 },
                      endAdornment: (
                        <>
                          {fetchingPatients ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body2">
                        {option.full_name || 'Unknown Patient'}
                      </Typography>
                      {(option.age || option.gender) && (
                        <Typography variant="caption" color="textSecondary">
                          {option.age && `Age: ${option.age}`}
                          {option.age && option.gender && ' • '}
                          {option.gender && `Gender: ${option.gender}`}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
                filterOptions={(options, { inputValue }) => {
                  if (!Array.isArray(options)) {
                    console.error('options is not an array:', options);
                    return [];
                  }
                  return options.filter(
                    option =>
                      option.full_name?.toLowerCase().includes(inputValue.toLowerCase()) ||
                      false ||
                      option.id?.toLowerCase().includes(inputValue.toLowerCase()) ||
                      false
                  );
                }}
                noOptionsText={fetchingPatients ? 'Loading patients...' : 'No patients found'}
                isOptionEqualToValue={(option, value) => option.id === value.id}
              />
            )}
          </Box>

          {/* Notes Field */}
          <Box>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Admission Notes *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Enter admission notes (e.g., reason for admission, special requirements)..."
              value={notes}
              onChange={handleNotesChange}
              error={!!notesError}
              helperText={notesError || 'Enter notes for patient admission'}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 1 },
              }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
              {notes.length}/500 characters
            </Typography>
          </Box>

          {/* Selected Patient Info */}
          {selectedPatient && (
            <Alert severity="success" sx={{ borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="600">
                Selected Patient:
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Typography variant="body2">
                  <strong>Name:</strong> {selectedPatient.full_name || 'Unknown Patient'}
                </Typography>
                {selectedPatient.age && (
                  <Typography variant="body2">
                    <strong>Age:</strong> {selectedPatient.age}
                  </Typography>
                )}
                {selectedPatient.gender && (
                  <Typography variant="body2">
                    <strong>Gender:</strong> {selectedPatient.gender}
                  </Typography>
                )}
              </Box>
            </Alert>
          )}

          {/* Bed Info Summary */}
          {/* <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Assignment Summary:
            </Typography>
            <Typography variant="body2">
              <strong>Bed:</strong> {bed.bed_number} in {bed.ward.name}
            </Typography>
            <Typography variant="body2">
              <strong>Patient:</strong>{' '}
              {selectedPatient ? selectedPatient.full_name || 'Unknown Patient' : 'Not selected'}
            </Typography>
            <Typography variant="body2">
              <strong>Notes:</strong>{' '}
              {notes
                ? notes.length > 50
                  ? `${notes.substring(0, 50)}...`
                  : notes
                : 'Not provided'}
            </Typography>
          </Box> */}
        </Box>
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          disabled={loading || fetchingPatients}
          sx={{ px: 3, color: 'text.secondary' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={loading || fetchingPatients || !selectedPatient || !notes.trim()}
          sx={{ px: 3, minWidth: 100 }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Assigning...' : 'Assign Patient'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignPatientModal;
