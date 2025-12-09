import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import { BedAndWardService } from '../../shared/api/services/BedandWard.service';

interface Ward {
  id: string;
  name: string;
  description: string;
  capacity: string;
  beds: any[];
}

interface UpdateWardModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  ward: Ward | null;
}

const UpdateWardModal: React.FC<UpdateWardModalProps> = ({ open, onClose, onSuccess, ward }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    capacity: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    capacity: '',
  });

  // Initialize form with ward data
  useEffect(() => {
    if (ward) {
      setFormData({
        name: ward.name || '',
        description: ward.description || '',
        capacity: ward.capacity || '',
      });
      // Clear errors
      setErrors({
        name: '',
        description: '',
        capacity: '',
      });
    }
  }, [ward]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      capacity: '',
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Ward name is required';
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = 'Capacity is required';
      isValid = false;
    } else if (isNaN(Number(formData.capacity)) || Number(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !ward) {
      return;
    }

    setLoading(true);
    try {
      // Prepare data for backend
      const updateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        capacity: parseInt(formData.capacity, 10),
      };

      await BedAndWardService.update(ward.id, updateData);

      toast.success(`Ward "${formData.name}" updated successfully`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update ward';
      toast.error(errorMessage);

      // You can set form errors based on backend response
      if (err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        setErrors(prev => ({
          ...prev,
          name: backendErrors.name?.[0] || '',
          description: backendErrors.description?.[0] || '',
          capacity: backendErrors.capacity?.[0] || '',
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">Update Ward</Typography>
            {ward && (
              <Typography variant="caption" color="textSecondary">
                ID: {ward.id.substring(0, 8)}...
              </Typography>
            )}
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Ward Name */}
            <TextField
              fullWidth
              name="name"
              label="Ward Name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              required
              size="small"
            />

            {/* Description */}
            <TextField
              fullWidth
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={loading}
              required
              multiline
              rows={3}
              size="small"
            />

            {/* Capacity */}
            <TextField
              fullWidth
              name="capacity"
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={handleInputChange}
              error={!!errors.capacity}
              helperText={errors.capacity}
              disabled={loading}
              required
              size="small"
              InputProps={{
                inputProps: {
                  min: 1,
                  step: 1,
                },
              }}
            />

            {/* Current Information (Read-only) */}
            {ward && (
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 1,
                  borderLeft: '4px solid #1976d2',
                }}
              >
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Current Information
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                  <Typography variant="body2">
                    <strong>Total Beds:</strong> {ward.beds?.length || 0}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Original Name:</strong> {ward.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Original Description:</strong> {ward.description}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading} variant="outlined">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Updating...' : 'Update Ward'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateWardModal;
