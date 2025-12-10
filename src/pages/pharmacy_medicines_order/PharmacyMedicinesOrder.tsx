import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Typography,
  TextField,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { LaboratoryService } from '../../shared/api/services/laboratory.service';
import { ToastContainer } from 'react-toastify';

interface PharmacyMedicine {
  id: string;
  name: string;
  price: string;
  description: string;
  default_code: string;
  status: string;
  created_at: string;
}

interface SelectedMedicine extends PharmacyMedicine {
  quantity: number;
}

interface PharmacyMedicinesOrderProps {
  patientId: string;
}

const PharmacyMedicinesOrder: React.FC<PharmacyMedicinesOrderProps> = ({ patientId }) => {
  const [medicines, setMedicines] = useState<PharmacyMedicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch medicines on component mount
  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await LaboratoryService.getMedications();
      if (response.data.success && response.data.data.data) {
        setMedicines(response.data.data.data);
      } else {
        setMedicines([]);
      }
    } catch (err) {
      setError('Failed to load medicines. Please try again.');
      console.error('Error fetching medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMedicine = (medicine: PharmacyMedicine, isSelected: boolean) => {
    if (isSelected) {
      // Add medicine to selected list with quantity 1
      setSelectedMedicines(prev => [...prev, { ...medicine, quantity: 1 }]);
    } else {
      // Remove medicine from selected list
      setSelectedMedicines(prev => prev.filter(item => item.id !== medicine.id));
    }
  };

  const handleQuantityChange = (medicineId: string, delta: number) => {
    setSelectedMedicines(prev =>
      prev.map(item => {
        if (item.id === medicineId) {
          const newQuantity = item.quantity + delta;
          return { ...item, quantity: newQuantity > 0 ? newQuantity : 1 };
        }
        return item;
      })
    );
  };

  const handleQuantityInputChange = (medicineId: string, value: string) => {
    const quantity = parseInt(value) || 1;
    setSelectedMedicines(prev =>
      prev.map(item =>
        item.id === medicineId ? { ...item, quantity: quantity > 0 ? quantity : 1 } : item
      )
    );
  };

  const calculateTotal = () => {
    return selectedMedicines.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const handleSubmitOrder = async () => {
    if (selectedMedicines.length === 0) {
      setError('Please select at least one medicine');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const orderData = {
        medicines: selectedMedicines.map(medicine => ({
          medicine_id: medicine.id,
          quantity: medicine.quantity,
          price: medicine.price,
          name: medicine.name,
        })),
        total_amount: calculateTotal().toString(),
        order_date: new Date().toISOString(),
        notes: '', // You can add a notes field if needed
      };

      await LaboratoryService.createPharmacyMedicinesOrder(patientId, orderData);

      setSuccess(true);
      setSelectedMedicines([]);

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error('Error creating order:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const isMedicineSelected = (medicineId: string) => {
    return selectedMedicines.some(item => item.id === medicineId);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Pharmacy Medicines Order
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Order created successfully!
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Left side: Available medicines list */}
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Available Medicines ({medicines.length})
          </Typography>
          <TableContainer sx={{ maxHeight: 500 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">Select</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  {/* <TableCell align="right">Price</TableCell> */}
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicines.map(medicine => (
                  <TableRow
                    key={medicine.id}
                    hover
                    sx={{
                      backgroundColor: isMedicineSelected(medicine.id)
                        ? 'action.selected'
                        : 'inherit',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isMedicineSelected(medicine.id)}
                        onChange={e => handleSelectMedicine(medicine, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>{medicine.name}</TableCell>
                    <TableCell>
                      <Chip label={medicine.default_code} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell align="right">${parseFloat(medicine.price).toFixed(2)}</TableCell>
                    <TableCell>{medicine.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {medicines.length === 0 && !loading && (
            <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
              No medicines available
            </Typography>
          )}
        </Paper>

        {/* Right side: Selected medicines cart */}
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Selected Medicines ({selectedMedicines.length})
          </Typography>

          {selectedMedicines.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                Select medicines from the list to add them to your order
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Medicine</TableCell>
                      <TableCell align="right">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      {/* <TableCell align="right">Subtotal</TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedMedicines.map(medicine => {
                      //   const subtotal = parseFloat(medicine.price) * medicine.quantity;
                      return (
                        <TableRow key={medicine.id}>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {medicine.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {medicine.default_code}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            ${parseFloat(medicine.price).toFixed(2)}
                          </TableCell>
                          <TableCell align="center">
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Tooltip title="Decrease quantity">
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(medicine.id, -1)}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <TextField
                                size="small"
                                value={medicine.quantity}
                                onChange={e =>
                                  handleQuantityInputChange(medicine.id, e.target.value)
                                }
                                sx={{
                                  width: 60,
                                  mx: 1,
                                  '& .MuiInputBase-input': {
                                    textAlign: 'center',
                                    py: 0.5,
                                  },
                                }}
                              />
                              <Tooltip title="Increase quantity">
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(medicine.id, 1)}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                          {/* <TableCell align="right">
                            <Typography fontWeight="medium">${subtotal.toFixed(2)}</Typography>
                          </TableCell> */}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Order summary */}
              <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Total Items:</Typography>
                  <Typography>
                    {selectedMedicines.reduce((sum, item) => sum + item.quantity, 0)}
                  </Typography>
                </Box>
                {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total Amount:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </Box> */}

                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={handleSubmitOrder}
                  disabled={submitting || selectedMedicines.length === 0}
                  sx={{ mt: 2 }}
                >
                  {submitting ? <CircularProgress size={24} color="inherit" /> : 'Create Order'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default PharmacyMedicinesOrder;
