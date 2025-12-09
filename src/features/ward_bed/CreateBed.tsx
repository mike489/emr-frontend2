import React, { useState, useEffect, type ReactNode } from 'react';
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
  //   MenuItem,
  Autocomplete,
} from '@mui/material';
import { toast } from 'react-toastify';
import { BedAndWardService } from '../../shared/api/services/BedandWard.service';

interface CreateBedModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Ward {
  description: ReactNode;
  id: string;
  name: string;
  capacity: string;
  beds: Array<{ id: string; bed_number: string; status: string }>;
}

interface BedFormData {
  ward_id: string;
  bed_number: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  status: number;
  data: Ward[];
}

const CreateBedModal: React.FC<CreateBedModalProps> = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<BedFormData>({
    ward_id: '',
    bed_number: '',
  });

  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingWards, setFetchingWards] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof BedFormData, string>>>({});
  const [existingBedNumbers, setExistingBedNumbers] = useState<string[]>([]);

  // Fetch wards data
  const fetchWards = async () => {
    setFetchingWards(true);
    try {
      const axiosResponse = await BedAndWardService.getAll();
      const response: ApiResponse = axiosResponse.data;

      if (response.success && response.data) {
        setWards(response.data);
      } else {
        toast.error('Failed to fetch wards data');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch wards');
      console.error('Error fetching wards:', err);
    } finally {
      setFetchingWards(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchWards();
      resetForm();
    }
  }, [open]);

  // Get selected ward
  const selectedWard = wards.find(ward => ward.id === formData.ward_id);

  // Update existing bed numbers when ward changes
  useEffect(() => {
    if (selectedWard) {
      const bedNumbers = selectedWard.beds.map(bed => bed.bed_number);
      setExistingBedNumbers(bedNumbers);

      setFormData(prev => ({ ...prev, bed_number: '' }));
    } else {
      setExistingBedNumbers([]);
    }
  }, [selectedWard]);

  // Calculate available capacity
  const getAvailableCapacity = (ward: Ward | undefined) => {
    if (!ward) return 0;
    const totalBeds = parseInt(ward.capacity, 10);
    const existingBeds = ward.beds.length;
    return totalBeds - existingBeds;
  };

  // Generate suggested bed numbers
  //   const getSuggestedBedNumbers = () => {
  //     if (!selectedWard) return [];

  //     const existingNumbers = existingBedNumbers
  //       .map(num => parseInt(num, 10))
  //       .filter(num => !isNaN(num));
  //     const maxExisting = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;

  //     const suggestions: string[] = [];
  //     for (let i = 1; i <= 5; i++) {
  //       const suggestedNumber = (maxExisting + i).toString();
  //       if (!existingBedNumbers.includes(suggestedNumber)) {
  //         suggestions.push(suggestedNumber);
  //       }
  //     }

  //     return suggestions;
  //   };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BedFormData, string>> = {};

    if (!formData.ward_id.trim()) {
      newErrors.ward_id = 'Ward selection is required';
    }

    if (!formData.bed_number.trim()) {
      newErrors.bed_number = 'Bed number is required';
    } else {
      // Check if bed number already exists in the selected ward
      if (existingBedNumbers.includes(formData.bed_number)) {
        newErrors.bed_number = 'This bed number already exists in the selected ward';
      }

      // Check if bed number is numeric
      if (!/^\d+$/.test(formData.bed_number)) {
        newErrors.bed_number = 'Bed number must contain only numbers';
      }

      // Check if bed number is positive
      const bedNum = parseInt(formData.bed_number, 10);
      if (isNaN(bedNum) || bedNum <= 0) {
        newErrors.bed_number = 'Bed number must be a positive number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleInputChange =
    (field: keyof BedFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));

      // Clear error for this field if user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
    };

  // Handle ward selection
  const handleWardChange = (_event: any, value: Ward | null) => {
    if (value) {
      setFormData(prev => ({
        ...prev,
        ward_id: value.id,
      }));
      if (errors.ward_id) {
        setErrors(prev => ({ ...prev, ward_id: undefined }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        ward_id: '',
      }));
    }
  };

  // Handle suggested bed number selection
  //   const handleSuggestedBedClick = (suggestedNumber: string) => {
  //     setFormData(prev => ({
  //       ...prev,
  //       bed_number: suggestedNumber,
  //     }));

  //     if (errors.bed_number) {
  //       setErrors(prev => ({ ...prev, bed_number: undefined }));
  //     }
  //   };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Prepare the request body exactly as required
      const requestBody = {
        ward_id: formData.ward_id,
        bed_number: formData.bed_number,
      };

      // Call your API service here
      await BedAndWardService.createBed(requestBody);

      toast.success('Bed created successfully!');

      // Close modal and call success callback
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating bed:', error);
      toast.error(error.response?.data?.message || 'Failed to create bed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    setFormData({
      ward_id: '',
      bed_number: '',
    });
    setErrors({});
    setExistingBedNumbers([]);
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading && !fetchingWards) {
      resetForm();
      onClose();
    }
  };

  const availableCapacity = getAvailableCapacity(selectedWard);
  //   const suggestedBedNumbers = getSuggestedBedNumbers();

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
          Create New Bed
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
          Add a new bed to a ward
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Ward Selection */}
          <Box>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Select Ward *
            </Typography>
            <Autocomplete
              options={wards}
              getOptionLabel={option =>
                `${option.name} (${option.beds.length}/${option.capacity} beds)`
              }
              value={selectedWard || null}
              onChange={handleWardChange}
              loading={fetchingWards}
              disabled={loading}
              renderInput={params => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select a ward"
                  error={!!errors.ward_id}
                  helperText={errors.ward_id}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {fetchingWards ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                    sx: { borderRadius: 1 },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="body2">{option.name}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {option.beds.length}/{option.capacity} beds • {option.description}
                    </Typography>
                  </Box>
                </li>
              )}
            />

            {selectedWard && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                  <strong>Ward Capacity:</strong> {selectedWard.beds.length} existing beds /{' '}
                  {selectedWard.capacity} total capacity
                </Typography>
                <Typography
                  variant="caption"
                  color={availableCapacity > 0 ? 'success.main' : 'warning.main'}
                  sx={{ display: 'block' }}
                >
                  <strong>Available slots:</strong> {availableCapacity} bed
                  {availableCapacity !== 1 ? 's' : ''} remaining
                </Typography>
              </Box>
            )}
          </Box>

          {/* Bed Number */}
          <Box>
            <Typography variant="subtitle2" fontWeight="600" gutterBottom>
              Bed Number *
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter bed number"
              value={formData.bed_number}
              onChange={handleInputChange('bed_number')}
              error={!!errors.bed_number}
              helperText={errors.bed_number || 'Enter a unique bed number for this ward'}
              disabled={loading || !formData.ward_id}
              InputProps={{
                sx: { borderRadius: 1 },
              }}
            />

            {/* Suggested bed numbers */}
            {/* {selectedWard && suggestedBedNumbers.length > 0 && (
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  sx={{ display: 'block', mb: 0.5 }}
                >
                  Suggested numbers:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {suggestedBedNumbers.map(suggestedNumber => (
                    <Button
                      key={suggestedNumber}
                      size="small"
                      variant="outlined"
                      onClick={() => handleSuggestedBedClick(suggestedNumber)}
                      sx={{
                        minWidth: 'auto',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                      }}
                    >
                      {suggestedNumber}
                    </Button>
                  ))}
                </Box>
              </Box>
            )} */}
          </Box>

          {/* Warnings/Info */}
          {selectedWard && availableCapacity <= 0 && (
            <Alert
              severity="warning"
              sx={{
                '& .MuiAlert-icon': { alignItems: 'center' },
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                <strong>Warning:</strong> This ward has reached its capacity (
                {selectedWard.capacity} beds). Adding more beds may exceed the planned capacity.
              </Typography>
            </Alert>
          )}

          {selectedWard && existingBedNumbers.length > 0 && (
            <Alert
              severity="info"
              sx={{
                '& .MuiAlert-icon': { alignItems: 'center' },
                borderRadius: 1,
              }}
            >
              <Typography variant="body2">
                <strong>Existing bed numbers in {selectedWard.name}:</strong>{' '}
                {existingBedNumbers.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).join(', ')}
              </Typography>
            </Alert>
          )}
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
          disabled={loading || fetchingWards}
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
          disabled={loading || fetchingWards || !formData.ward_id}
          sx={{
            px: 3,
            minWidth: 100,
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Creating...' : 'Create Bed'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBedModal;
