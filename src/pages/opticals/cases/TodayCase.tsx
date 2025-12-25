import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  CircularProgress,
  TablePagination,
  Tooltip,
  IconButton,
  Chip,
} from '@mui/material';
import { Visibility, Search } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LaboratoryService } from '../../../shared/api/services/laboratory.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GlassPrescriptionDetailModal from '../GlassPrescriptionDetailModal';

// Type definitions based on your API response
interface PharmacyPatient {
  id: string;
  title: string;
  full_name: string;
  emr_number: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  email: string;
  address: {
    city: string;
    kifle_ketema: string;
    wereda: string;
  };
  age: number;
  blood_type: string;
  national_id: string;
  passport_number: string | null;
  medical_history: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  occupation: string | null;
  marital_status: string | null;
  patient_category: string;
  payment_type: string | null;
  patient_picture_url: string | null;
  id_card_picture_url: string | null;
  is_card_expired: boolean;
  current_assigned_doctor: string | null;
  visit_status: string;
}

// API Response interfaces for getPharmacyMedicinesOrder
// interface PharmacyOrderItemResponse {
//   id: string;
//   quantity: string;
//   note: string | null;
//   frequency: string | null;
//   is_payment_completed: string;
//   medicine_id: string;
//   visit_id: string;
//   created_by: string;
//   created_at: string;
//   updated_at: string;
//   medicine: {
//     id: string;
//     name: string;
//     price: string;
//     description: string;
//     default_code: string;
//     status: string;
//     created_at: string;
//   };
// }

interface PharmacyOrder {
  id: string;
  patient_id: string;
  patient_name: string;
  order_number: string;
  total_amount: string;
  status: string;
  created_at: string;
  items: OrderItem[];
  notes?: string;
}

interface OrderItem {
  id: string;
  medicine_id: string;
  name: string;
  quantity: number;
  price: string;
  total_price: string;
}

interface PaginationState {
  page: number;
  per_page: number;
  last_page: number;
  total: number;
}

interface Filters {
  page: number;
  per_page: number;
  search: string;
  gender: string;
  patient_category: string;
  age_min: string;
  age_max: string;
  sort_by: string;
  sort_order: string;
}

const OpticalTodayCases: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PharmacyPatient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [_summaryLoading, setSummaryLoading] = useState<boolean>(false);

  // Modal states
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [_selectedOrder, setSelectedOrder] = useState<PharmacyOrder | null>(null);
  const [_orderLoading, _setOrderLoading] = useState<boolean>(false);
  const [_orderError, setOrderError] = useState<string | null>(null);
  const [_currentPatient, setCurrentPatient] = useState<PharmacyPatient | null>(null);

  const [filters, setFilters] = useState<Filters>({
    page: 1,
    per_page: 25,
    search: '',
    gender: '',
    patient_category: '',
    age_min: '',
    age_max: '',
    sort_by: '',
    sort_order: '',
  });

  const [pagination, setPagination] = useState<PaginationState>({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });

  // Summary statistics
  const [_summary, setSummary] = useState({
    total: 0,
    byGender: {
      male: 0,
      female: 0,
    },
    byStatus: {
      active: 0,
      discharged: 0,
    },
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPerPage = parseInt(event.target.value, 10);
    setFilters(prev => ({ ...prev, per_page: newPerPage, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      per_page: 25,
      search: '',
      gender: '',
      patient_category: '',
      age_min: '',
      age_max: '',
      sort_by: '',
      sort_order: '',
    });
    fetchPharmacyPatients();
  };

  const fetchPharmacyPatients = async () => {
    setLoading(true);
    try {
      const res = await LaboratoryService.getGlassPrescriptions();

      // Based on your API response structure
      const responseData = res.data?.data;
      const patientsData = responseData?.data || [];
      const paginationData = responseData;

      setPatients(patientsData);
      setPagination(prev => ({
        ...prev,
        total: paginationData?.total || 0,
        page: (paginationData?.current_page || 1) - 1,
        per_page: paginationData?.per_page || filters.per_page,
        last_page: paginationData?.last_page || 1,
      }));

      // Calculate summary statistics
      calculateSummary(patientsData);

      setError(false);
    } catch (err: any) {
      setError(true);
      toast.error(err.response?.data?.message || 'Failed to fetch pharmacy patients');
      console.error('Error fetching pharmacy patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data: PharmacyPatient[]) => {
    const maleCount = data.filter(patient => patient.gender === 'Male').length;
    const femaleCount = data.filter(patient => patient.gender === 'Female').length;
    const activeCount = data.filter(patient => patient.visit_status === 'In Progress').length;
    const dischargedCount = data.filter(patient => patient.visit_status === 'Discharged').length;

    setSummary({
      total: data.length,
      byGender: {
        male: maleCount,
        female: femaleCount,
      },
      byStatus: {
        active: activeCount,
        discharged: dischargedCount,
      },
    });
  };

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await LaboratoryService.getPharmacyMedicinesPatientOrders();
      const responseData = res.data?.data;
      const data = responseData?.data || [];
      calculateSummary(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch summary');
      console.error('Error fetching summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Transform API response to PharmacyOrder format
  // const transformOrderResponse = (
  //   patient: PharmacyPatient,
  //   orderItems: PharmacyOrderItemResponse[]
  // ): PharmacyOrder => {
  //   // Calculate total amount
  //   const totalAmount = orderItems.reduce((total, item) => {
  //     const quantity = parseInt(item.quantity) || 0;
  //     const price = parseFloat(item.medicine.price) || 0;
  //     return total + quantity * price;
  //   }, 0);

  //   // Transform items
  //   const items: OrderItem[] = orderItems.map(item => ({
  //     id: item.id,
  //     medicine_id: item.medicine_id,
  //     name: item.medicine.name,
  //     quantity: parseInt(item.quantity) || 0,
  //     price: item.medicine.price,
  //     total_price: (
  //       (parseInt(item.quantity) || 0) * (parseFloat(item.medicine.price) || 0)
  //     ).toFixed(2),
  //   }));

  //   // Get the most recent order date
  //   const latestDate =
  //     orderItems.length > 0
  //       ? orderItems.reduce((latest, item) => {
  //           const itemDate = new Date(item.created_at);
  //           return itemDate > latest ? itemDate : latest;
  //         }, new Date(0))
  //       : new Date();

  //   return {
  //     id: `order-${patient.id}`,
  //     patient_id: patient.id,
  //     patient_name: patient.full_name,
  //     order_number: `ORD-${patient.emr_number}`,
  //     total_amount: totalAmount.toFixed(2),
  //     status: orderItems.some(item => item.is_payment_completed === '1')
  //       ? 'completed'
  //       : orderItems.length > 0
  //         ? 'pending'
  //         : 'no orders',
  //     created_at: latestDate.toISOString(),
  //     items: items,
  //     notes:
  //       orderItems.length > 0
  //         ? `${orderItems.length} medicine${orderItems.length > 1 ? 's' : ''} ordered`
  //         : 'No orders placed yet',
  //   };
  // };

  // Fetch order details for a specific patient
  // const fetchPatientOrderDetails = async (patient: PharmacyPatient) => {
  //   setOrderLoading(true);
  //   setOrderError(null);
  //   setCurrentPatient(patient);

  //   try {
  //     const res = await LaboratoryService.getPharmacyMedicinesOrder(patient.id);

  //     // Extract order items from API response
  //     const orderItems: PharmacyOrderItemResponse[] = res.data?.data?.data || [];

  //     if (orderItems.length > 0) {
  //       // Transform the API response to match the PharmacyOrder interface
  //       const transformedOrder = transformOrderResponse(patient, orderItems);
  //       setSelectedOrder(transformedOrder);
  //     } else {
  //       // No orders found for this patient
  //       const emptyOrder: PharmacyOrder = {
  //         id: `order-${patient.id}`,
  //         patient_id: patient.id,
  //         patient_name: patient.full_name,
  //         order_number: `ORD-${patient.emr_number}`,
  //         total_amount: '0.00',
  //         status: 'no orders',
  //         created_at: new Date().toISOString(),
  //         items: [],
  //         notes: 'No pharmacy orders found for this patient.',
  //       };
  //       setSelectedOrder(emptyOrder);
  //     }
  //   } catch (err: any) {
  //     setOrderError(err.response?.data?.message || 'Failed to fetch order details');
  //     console.error('Error fetching order details:', err);

  //     // Create a basic order structure even on error
  //     const errorOrder: PharmacyOrder = {
  //       id: `order-${patient.id}`,
  //       patient_id: patient.id,
  //       patient_name: patient.full_name,
  //       order_number: `ORD-${patient.emr_number}`,

  //       total_amount: '0.00',
  //       status: 'error',
  //       created_at: new Date().toISOString(),
  //       items: [],
  //       notes: 'Unable to load order details. Please try again.',
  //     };
  //     setSelectedOrder(errorOrder);
  //   } finally {
  //     setOrderLoading(false);
  //   }
  // };

  // Handle viewing patient orders
  const handleViewPatientOrders = async (patient: PharmacyPatient) => {
    navigate('/optical/details', {
      state: {
        patientId: patient.id,
        index: 0,
        patient: patient,
      },
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
    setOrderError(null);
    setCurrentPatient(null);
  };

  useEffect(() => {
    fetchPharmacyPatients();
  }, [filters.page, filters.per_page]);

  useEffect(() => {
    fetchSummary();
  }, []);

  // Get patient category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Non Paying': '#d32f2f',
      Emergency: '#1976d2',
      ICU: '#7b1fa2',
      Pediatric: '#00796b',
      Maternity: '#e91e63',
      Surgical: '#f57c00',
      General: '#1976d2',
    };
    return colors[category] || '#757575';
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', mt: -16 }}>
      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'end' }}>
          <Button
            onClick={() => navigate('/clinics')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.25,
              textTransform: 'none',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.75rem',
              px: 1,
              py: 0.5,
              borderRadius: '6px',
              minWidth: 'auto',
              bgcolor: '#1976d2',
              border: '1px solid #1565c0',
              '&:hover': { bgcolor: '#1565c0' },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption" sx={{ fontWeight: 500, color: 'white' }}>
              Back
            </Typography>
          </Button>

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search patients..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value, page: 1 })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200, flex: 1 }}
          />

          {/* Gender Filter */}
          <TextField
            size="small"
            select
            value={filters.gender}
            onChange={e => setFilters({ ...filters, gender: e.target.value, page: 1 })}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected: unknown) => {
                if (selected === '' || !selected) {
                  return 'All Genders';
                }
                return selected as string;
              },
            }}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All Genders</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>

          {/* Patient Category Filter */}
          <TextField
            size="small"
            select
            value={filters.patient_category}
            onChange={e => setFilters({ ...filters, patient_category: e.target.value, page: 1 })}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected: unknown) => {
                if (selected === '' || !selected) {
                  return 'All Categories';
                }
                return selected as string;
              },
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Non Paying">Non Paying</MenuItem>
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="Emergency">Emergency</MenuItem>
            <MenuItem value="ICU">ICU</MenuItem>
            <MenuItem value="Pediatric">Pediatric</MenuItem>
            <MenuItem value="Maternity">Maternity</MenuItem>
            <MenuItem value="Surgical">Surgical</MenuItem>
          </TextField>

          {/* Age Range */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: '600', color: '#666' }}>
              Age:
            </Typography>
            <TextField
              size="small"
              type="number"
              placeholder="Min"
              value={filters.age_min}
              onChange={e => setFilters({ ...filters, age_min: e.target.value, page: 1 })}
              sx={{ width: 80 }}
              inputProps={{ min: 0, max: 120 }}
            />
            <Typography variant="caption" sx={{ color: '#666' }}>
              to
            </Typography>
            <TextField
              size="small"
              type="number"
              placeholder="Max"
              value={filters.age_max}
              onChange={e => setFilters({ ...filters, age_max: e.target.value, page: 1 })}
              sx={{ width: 80 }}
              inputProps={{ min: 0, max: 120 }}
            />
          </Box>

          {/* Clear Filters Button */}
          <Button
            variant="outlined"
            onClick={clearFilters}
            sx={{
              height: '40px',
              borderColor: '#d32f2f',
              color: '#d32f2f',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}
          >
            Clear Filters
          </Button>
        </Box>
      </Paper>

      {/* Pharmacy Patients Table */}
      <Paper sx={{ p: 0 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
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
                  }}
                >
                  Category
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    width: 140,
                    fontSize: '0.8rem',
                    py: 1.5,
                  }}
                >
                  Patient Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    width: 100,
                    fontSize: '0.8rem',
                    py: 1.5,
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
                  }}
                >
                  Address
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    width: 100,
                    fontSize: '0.8rem',
                    py: 1.5,
                  }}
                >
                  Blood Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    width: 80,
                    fontSize: '0.8rem',
                    py: 1.5,
                    textAlign: 'center',
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} sx={{ color: '#1e3c72' }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                      Loading pharmacy patients...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="error">
                      Error loading pharmacy patients. Please try again.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : patients.length > 0 ? (
                patients.map((patient, index) => {
                  const categoryColor = getCategoryColor(patient.patient_category);

                  return (
                    <TableRow
                      key={patient.id || index}
                      onClick={() => handleViewPatientOrders(patient)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <TableCell>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '4px',
                            backgroundColor: categoryColor,
                            display: 'inline-block',
                            mr: 1,
                            border: '1px solid #e0e0e0',
                          }}
                          title={patient.patient_category}
                        />
                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                          {patient.patient_category}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {patient.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {patient.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {patient.emr_number}
                        </Typography>
                      </TableCell>
                      <TableCell>{patient.age} years</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{patient.address?.city}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient.address?.kifle_ketema}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={patient.blood_type || 'N/A'}
                          size="small"
                          sx={{
                            backgroundColor: patient.blood_type ? '#ffebee' : '#f5f5f5',
                            color: patient.blood_type ? '#c62828' : '#757575',
                            fontWeight: '600',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title="View Patient Orders" arrow>
                          <IconButton
                            size="small"
                            onClick={e => {
                              e.stopPropagation();
                              handleViewPatientOrders(patient);
                            }}
                            sx={{
                              backgroundColor: '#1976d2',
                              color: 'white',
                              '&:hover': { backgroundColor: '#1565c0' },
                            }}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No pharmacy patients found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.per_page}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
        />
      </Paper>

      {/* Pharmacy Order Detail Modal */}
      <GlassPrescriptionDetailModal
        open={modalOpen}
        onClose={handleCloseModal}
        patientId={_currentPatient?.id || null}
        patientInfo={
          _currentPatient
            ? {
                id: _currentPatient.id,
                name: (_currentPatient as any).patient_name || _currentPatient.full_name,
                emr_number: _currentPatient.emr_number,
                age: _currentPatient.age,
                gender: _currentPatient.gender,
                phone: _currentPatient.phone,
              }
            : undefined
        }
      />

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default OpticalTodayCases;
