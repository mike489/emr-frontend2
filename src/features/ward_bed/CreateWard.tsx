import React, { useState } from 'react';
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
  Alert,
} from '@mui/material';
import { toast } from 'react-toastify';
import { BedAndWardService } from '../../shared/api/services/BedandWard.service';

interface CreateWardModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface WardFormData {
  name: string;
  description: string;
  capacity: string;
}

const CreateWardModal: React.FC<CreateWardModalProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<WardFormData>({
    name: '',
    description: '',
    capacity: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof WardFormData, string>>>({});

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WardFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ward name is required';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Ward name must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
    } else {
      const capacityNum = parseInt(formData.capacity, 10);
      if (isNaN(capacityNum) || capacityNum <= 0) {
        newErrors.capacity = 'Capacity must be a positive number';
      } else if (capacityNum > 100) {
        newErrors.capacity = 'Capacity cannot exceed 100 beds';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange =
    (field: keyof WardFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      // For capacity field, only allow numbers
      if (field === 'capacity') {
        if (value === '' || /^\d+$/.test(value)) {
          setFormData(prev => ({
            ...prev,
            [field]: value,
          }));
          // Clear error for this field if user starts typing
          if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
          }
        }
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: value,
        }));
        // Clear error for this field if user starts typing
        if (errors[field]) {
          setErrors(prev => ({ ...prev, [field]: undefined }));
        }
      }
    };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const requestBody = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        capacity: parseInt(formData.capacity, 10),
      };

      await BedAndWardService.create(requestBody);

      toast.success('Ward created successfully!');

      resetForm();
      onClose();
      onSuccess && onSuccess();
    } catch (error: any) {
      console.error('Error creating ward:', error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Failed to create ward. Please try again.';

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      capacity: '',
    });
    setErrors({});
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: '1px solid #e0e0e0',
          pb: 2,
          backgroundColor: '#f8f9fa',
        }}
      >
        <Typography variant="h6" fontWeight="600">
          Create New Ward
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
          Add a new ward to the hospital management system
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Ward Name */}
          <Box>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Ward Name *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter ward name (e.g., General Ward, ICU)"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 1 },
              }}
            />
          </Box>

          {/* Description */}
          <Box>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Description *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter ward description"
              value={formData.description}
              onChange={handleInputChange('description')}
              error={!!errors.description}
              helperText={errors.description}
              multiline
              rows={3}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 1 },
              }}
            />
          </Box>

          {/* Capacity */}
          <Box>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Capacity *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter number of beds"
              value={formData.capacity}
              onChange={handleInputChange('capacity')}
              error={!!errors.capacity}
              helperText={errors.capacity || 'Total number of beds in this ward'}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 1 },
                endAdornment: (
                  <Typography variant="body2" color="textSecondary" sx={{ mr: 1 }}>
                    beds
                  </Typography>
                ),
              }}
            />
          </Box>

          {/* Info Alert */}
          <Alert
            severity="info"
            sx={{
              '& .MuiAlert-icon': { alignItems: 'center' },
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">
              <strong>Note:</strong> The system will automatically create {formData.capacity || '0'}{' '}
              bed slots with sequential bed numbers when this ward is created.
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
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            px: 3,
            color: 'text.secondary',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            px: 3,
            minWidth: 100,
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Creating...' : 'Create Ward'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWardModal;
