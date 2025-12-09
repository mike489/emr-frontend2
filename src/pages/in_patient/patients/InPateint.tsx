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
import { BedAndWardService } from '../../../shared/api/services/BedandWard.service';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Type definitions for InPatients based on your API response
interface InPatient {
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

const InPatients: React.FC = () => {
  const navigate = useNavigate();
  const [inpatients, setInpatients] = useState<InPatient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);

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
  const [summary, setSummary] = useState({
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
    fetchInPatients();
  };

  const fetchInPatients = async () => {
    setLoading(true);
    try {
      const res = await BedAndWardService.getAllInpatients();

      const inpatientsData = res.data?.data?.data || [];
      const totalItems = res.data?.data?.total || inpatientsData.length || 0;

      setInpatients(inpatientsData);
      setPagination(prev => ({
        ...prev,
        total: totalItems,
        page: filters.page - 1,
        per_page: filters.per_page,
      }));

      // Calculate summary statistics
      calculateSummary(inpatientsData);

      setError(false);
    } catch (err: any) {
      setError(true);
      toast.error(err.response?.data?.message || 'Failed to fetch inpatients');
      console.error('Error fetching inpatients:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data: InPatient[]) => {
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
      // You might want to create a separate summary endpoint or use existing data
      const res = await BedAndWardService.getAllInpatients();
      const data = res.data?.data?.data || [];
      calculateSummary(data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch summary');
      console.error('Error fetching summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  useEffect(() => {
    fetchInPatients();
  }, [filters]);

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleRowClick = (patient: InPatient) => {
    navigate(`/inpatients/patient-details/${patient.id}`, {
      state: {
        patient: patient,
      },
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return { bg: '#e8f5e8', color: '#2e7d32' };
      case 'Discharged':
        return { bg: '#e3f2fd', color: '#1976d2' };
      case 'Admitted':
        return { bg: '#fff3e0', color: '#f57c00' };
      default:
        return { bg: '#f5f5f5', color: '#757575' };
    }
  };

  // Get patient category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      General: '#1976d2',
      Emergency: '#d32f2f',
      ICU: '#7b1fa2',
      Pediatric: '#00796b',
      Maternity: '#e91e63',
      Surgical: '#f57c00',
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
            placeholder="Search inpatients..."
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
          {/* <TextField
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
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="Emergency">Emergency</MenuItem>
            <MenuItem value="ICU">ICU</MenuItem>
            <MenuItem value="Pediatric">Pediatric</MenuItem>
            <MenuItem value="Maternity">Maternity</MenuItem>
            <MenuItem value="Surgical">Surgical</MenuItem>
          </TextField> */}

          {/* Age Range */}
          {/* <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
            />
          </Box> */}

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

      {/* InPatients Table */}
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
                    width: 140,
                    fontSize: '0.8rem',
                    py: 1.5,
                  }}
                >
                  Assigned Doctor
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
                  Status
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
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} sx={{ color: '#1e3c72' }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                      Loading inpatients...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="error">
                      Error loading inpatients. Please try again.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : inpatients.length > 0 ? (
                inpatients.map((patient, index) => {
                  const statusColor = getStatusColor(patient.visit_status);
                  const categoryColor = getCategoryColor(patient.patient_category);

                  return (
                    <TableRow
                      key={patient.id || index}
                      onClick={() => handleRowClick(patient)}
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
                          label={patient.blood_type}
                          size="small"
                          sx={{
                            backgroundColor: patient.blood_type === 'N/A' ? '#f5f5f5' : '#ffebee',
                            color: patient.blood_type === 'N/A' ? '#757575' : '#c62828',
                            fontWeight: '600',
                          }}
                        />
                      </TableCell>
                      <TableCell>{patient.current_assigned_doctor || 'Not Assigned'}</TableCell>
                      <TableCell>
                        <Chip
                          label={patient.visit_status}
                          size="small"
                          sx={{
                            backgroundColor: statusColor.bg,
                            color: statusColor.color,
                            fontWeight: '600',
                            fontSize: '0.75rem',
                          }}
                        />
                        {patient.is_card_expired && (
                          <Typography
                            variant="caption"
                            color="error"
                            sx={{ ml: 1, fontSize: '0.7rem' }}
                          >
                            Card Expired
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title="View Patient Details" arrow>
                          <IconButton
                            size="small"
                            onClick={e => {
                              e.stopPropagation();
                              handleRowClick(patient);
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
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No inpatients found.
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

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default InPatients;
