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
  Container,
  InputAdornment,
  Grid,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
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
  const [filteredMedicines, setFilteredMedicines] = useState<PharmacyMedicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<SelectedMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Filter medicines based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMedicines(medicines);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = medicines.filter(
        medicine =>
          medicine.name.toLowerCase().includes(query) ||
          medicine.default_code.toLowerCase().includes(query) ||
          (medicine.description && medicine.description.toLowerCase().includes(query))
      );
      setFilteredMedicines(filtered);
    }
  }, [searchQuery, medicines]);

  const fetchMedicines = async (search?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response: any = await LaboratoryService.getMedications(search);

      if (response.data.success && response.data.data.data) {
        setMedicines(response.data.data.data);
        setFilteredMedicines(response.data.data.data);
      } else {
        setMedicines([]);
        setFilteredMedicines([]);
      }
    } catch (err) {
      setError('Failed to load medicines. Please try again.');
      console.error('Error fetching medicines:', err);
      setMedicines([]);
      setFilteredMedicines([]);
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchLoading(true);
    fetchMedicines(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchLoading(true);
    fetchMedicines(); // Fetch without search query
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

  const handleRemoveMedicine = (medicineId: string) => {
    setSelectedMedicines(prev => prev.filter(item => item.id !== medicineId));
  };

  const handleClearAll = () => {
    setSelectedMedicines([]);
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
        notes: '',
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
    <Container maxWidth="lg" sx={{ py: 3 }}>
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

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        {/* Left side: Available medicines list */}
        <Box sx={{ width: { xs: '100%', lg: '65%' } }}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              Available Medicines
            </Typography>

            {/* Search Bar */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid size={{ xs: 12, sm: 9 }}>
                <TextField
                  fullWidth
                  placeholder="Search medicines by name, code, or description..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={handleClearSearch} edge="end">
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSearch}
                  disabled={searchLoading}
                  startIcon={searchLoading ? <CircularProgress size={20} /> : <SearchIcon />}
                >
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
              </Grid>
            </Grid>

            {searchQuery && (
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Showing results for "{searchQuery}" ({filteredMedicines.length} found)
              </Typography>
            )}

            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">Select</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Code</TableCell>
                    {/* <TableCell>Price</TableCell> */}
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredMedicines.map(medicine => (
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
                      {/* <TableCell>${parseFloat(medicine.price).toFixed(2)}</TableCell> */}
                      <TableCell>{medicine.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {filteredMedicines.length === 0 && !loading && (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  {searchQuery ? 'No medicines match your search.' : 'No medicines available'}
                </Typography>
                {searchQuery && (
                  <Button variant="text" onClick={handleClearSearch} sx={{ mt: 2 }}>
                    Clear search
                  </Button>
                )}
              </Box>
            )}
          </Paper>
        </Box>

        {/* Right side: Selected medicines cart */}
        <Box sx={{ width: { xs: '100%', lg: '35%' } }}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mb: 3 }}
            >
              <Typography variant="h6" fontWeight="bold">
                Selected Medicines
              </Typography>
              {selectedMedicines.length > 0 && (
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              )}
            </Stack>

            {selectedMedicines.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  Select medicines from the list to add them to your order
                </Typography>
              </Box>
            ) : (
              <>
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      {selectedMedicines.length} medicine(s) selected
                    </Typography>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Items: {selectedMedicines.reduce((sum, item) => sum + item.quantity, 0)}
                    </Typography>
                  </Stack>

                  <Box sx={{ maxHeight: 400, overflowY: 'auto', pr: 1 }}>
                    {selectedMedicines.map(medicine => {
                      // const subtotal = parseFloat(medicine.price) * medicine.quantity;
                      return (
                        <Card
                          key={medicine.id}
                          variant="outlined"
                          sx={{
                            mb: 2,
                            borderColor: 'primary.main',
                          }}
                        >
                          <CardContent sx={{ py: 2, px: 2 }}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                            >
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {medicine.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  Code: {medicine.default_code}
                                </Typography>
                                {/* <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                                  ${parseFloat(medicine.price).toFixed(2)} × {medicine.quantity} = $
                                  {subtotal.toFixed(2)}
                                </Typography> */}
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
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
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveMedicine(medicine.id)}
                                  sx={{ ml: 1 }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                </Box>

                {/* Order summary */}
                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
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
                    sx={{ py: 1.5 }}
                  >
                    {submitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      `Submit Order (${selectedMedicines.length} items)`
                    )}
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Box>
      </Box>
      <ToastContainer />
    </Container>
  );
};

export default PharmacyMedicinesOrder;
