import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  TextField,
} from '@mui/material';
import { toast } from 'react-toastify';
import { BedAndWardService } from '../../shared/api/services/BedandWard.service';

interface CurrentPatient {
  id: string;
  full_name: string;
  assigned_at: string;
}

interface ReleasePatientModalProps {
  open: boolean;
  onClose: () => void;
  bed: {
    id: string;
    bed_number: string;
    ward: { name: string };
    current_patient: CurrentPatient | null; // Updated to allow null
  };
  onSuccess?: () => void;
}

const ReleasePatientModal: React.FC<ReleasePatientModalProps> = ({
  open,
  onClose,
  bed,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [releaseNotes, setReleaseNotes] = useState('');
  const [notesError, setNotesError] = useState('');

  // Early return if no patient is assigned (shouldn't happen as this modal only shows for occupied beds)
  if (!bed.current_patient) {
    return null; // Or show an error message
  }

  // Validate release notes
  const validateNotes = () => {
    if (!releaseNotes.trim()) {
      setNotesError('Release notes are required');
      return false;
    }
    if (releaseNotes.length > 500) {
      setNotesError('Notes cannot exceed 500 characters');
      return false;
    }
    setNotesError('');
    return true;
  };

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReleaseNotes(value);

    // Clear error when user starts typing
    if (notesError && value.trim()) {
      setNotesError('');
    }
  };

  // Handle release patient
  const handleRelease = async () => {
    if (!validateNotes()) {
      return;
    }

    setLoading(true);
    try {
      const requestBody = {
        patient_id: bed.current_patient!.id, // We know current_patient exists here
        notes: releaseNotes.trim(),
        // Add any other required fields based on your API
      };

      await BedAndWardService.releaseBed(bed.id, requestBody);
      toast.success(`Patient released from bed ${bed.bed_number} successfully!`);

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error releasing patient:', error);
      toast.error(error.response?.data?.message || 'Failed to release patient');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return (
        date.toLocaleDateString() +
        ' ' +
        date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } catch (error) {
      return dateString; // Return original string if parsing fails
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      setReleaseNotes('');
      setNotesError('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid #e0e0e0',
          pb: 2,
          backgroundColor: '#f8f9fa',
        }}
      >
        <Typography variant="h6" fontWeight="600">
          Release Patient from Bed
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Warning Alert */}
          <Alert severity="warning" sx={{ borderRadius: 1 }}>
            <Typography variant="body2">
              You are about to release <strong>{bed.current_patient!.full_name}</strong> from bed{' '}
              <strong>{bed.bed_number}</strong> in <strong>{bed.ward.name}</strong>.
            </Typography>
          </Alert>

          {/* Patient Details */}
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Patient Details:
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {bed.current_patient!.full_name}
            </Typography>
            <Typography variant="body2">
              <strong>Assigned Since:</strong> {formatDate(bed.current_patient!.assigned_at)}
            </Typography>
            <Typography variant="body2">
              <strong>Bed:</strong> {bed.bed_number} • {bed.ward.name}
            </Typography>
          </Box>

          {/* Release Notes */}
          <Box>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Release Notes *
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              placeholder="Enter release notes (e.g., reason for release, patient condition, discharge notes)..."
              value={releaseNotes}
              onChange={handleNotesChange}
              error={!!notesError}
              helperText={notesError || 'Enter notes for patient release'}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 1 },
              }}
            />
            <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
              {releaseNotes.length}/500 characters
            </Typography>
          </Box>

          {/* Information about consequences */}
          <Alert severity="info" sx={{ borderRadius: 1 }}>
            <Typography variant="body2" gutterBottom>
              <strong>This action will:</strong>
            </Typography>
            <Typography variant="body2">• Change bed status to "Available"</Typography>
            <Typography variant="body2">• Remove the patient assignment</Typography>
            <Typography variant="body2">• Free up the bed for new patients</Typography>
            <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
              The patient will be removed from this bed but their record will remain in the system.
            </Typography>
          </Alert>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: '1px solid #e0e0e0',
          p: 2,
          gap: 1,
        }}
      >
        <Button onClick={handleClose} disabled={loading} sx={{ color: 'text.secondary' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="warning"
          onClick={handleRelease}
          disabled={loading || !releaseNotes.trim()}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ px: 3 }}
        >
          {loading ? 'Releasing...' : 'Release Patient'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReleasePatientModal;
