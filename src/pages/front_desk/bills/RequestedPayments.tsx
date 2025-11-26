import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  TablePagination,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  // Select,
  Tooltip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Search, ArrowDropDown, Payment } from '@mui/icons-material';
// import { PatientService } from '../../shared/api/services/patient.service';
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../../shared/api/types/patient.types';
import { DepartmentsService } from '../../../shared/api/services/departments.service';
import { PatientCategoryService } from '../../../shared/api/services/patientCatagory.service';
import { doctorsService } from '../../../shared/api/services/Doctor.service';
import AttachmentsModal from '../../../features/triage/components/AttachmentsModal';
// import PatientDetailsModal from '../../../features/patients/PatientDetailsModal';
import { LaboratoryService } from '../../../shared/api/services/laboratory.service';
import { Eye, FileUp } from 'lucide-react';
import LaboratoriesPaymentModal from '../../../features/case/LaboratoriesPaymentModal';

// Updated Type definitions to match your API response
interface PaginationState {
  page: number;
  per_page: number;
  last_page: number;
  total: number;
}

interface Attachment {
  name: string;
  mime_type: string;
  size: string;
  url: string;
}

const RequestedPayments: React.FC = () => {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [_loading, setLoading] = React.useState<boolean>(false);
  const [_total, setTotal] = React.useState<number>(0);
  const [_error, setError] = React.useState<boolean>(false);
  const [_departments, setDepartments] = React.useState<string[]>([]);
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploadingId, _setUploadingId] = React.useState<string | null>(null);
  const [attachModalOpen, setAttachModalOpen] = React.useState(false);
  const [currentAttachments, _setCurrentAttachments] = React.useState<Attachment[]>([]);
  // const [openTriageModal, _setOpenTriageModal] = useState(false);
  // const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const [patientCategories, setPatientCategories] = React.useState<{ id: string; name: string }[]>(
    []
  );
  const [filters, setFilters] = React.useState({
    page: 1,
    per_page: 25,
    sort_by: 'full_name',
    sort_order: 'asc',
    department: 'Laboratory', // Changed to Laboratory
    search: '',
    gender: '',
    doctor_id: '',
    patient_category_id: '',
    dob_from: '',
    dob_to: '',
    age_min: '',
    age_max: '',
    visit_type: '',
    created_from: '',
    created_to: '',
    sort_dir: 'asc',
  });

  const [pagination, setPagination] = React.useState<PaginationState>({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });

  // const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleOpenPaymentModal = (patient: Patient) => {
    setSelectedPatient({ id: patient.id, name: patient.full_name });
    setPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setPaymentModalOpen(false);
    setSelectedPatient(null);
  };
  // const navigate = useNavigate();

  // const handleViewDetails = (patient: Patient) => {
  //   navigate('/laboratory/patient-details', { state: { patient } });
  // };

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
      sort_by: 'full_name',
      sort_order: 'asc',
      sort_dir: 'asc',
      department: 'Laboratory', // Reset to Laboratory
      search: '',
      gender: '',
      doctor_id: '',
      visit_type: '',
      patient_category_id: '',
      dob_from: '',
      dob_to: '',
      age_min: '',
      age_max: '',
      created_from: '',
      created_to: '',
    });
    fetchPatients();
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await LaboratoryService.getAll();

      const patientsData = res.data?.data?.data || res.data?.data || [];
      const totalItems = res.data?.data?.total || patientsData.length || 0;

      setPatients(patientsData);
      setPagination(prev => ({
        ...prev,
        total: totalItems,
        page: filters.page - 1, // Convert to 0-based for MUI
        per_page: filters.per_page,
      }));
      setError(false);
    } catch (err: any) {
      setError(true);
      toast.error(err.response?.data?.message || 'Failed to fetch patients');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await DepartmentsService.getAll();

      const departmentsData = res.data?.data || [];

      setDepartments(departmentsData);
      setError(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch departments');
      console.error('Error fetching departments:', err);
    }
  };

  const fetchPatientCategories = async () => {
    setLoading(true);
    try {
      const res = await PatientCategoryService.getAll();
      const categories = res.data?.data || [];
      setPatientCategories(categories);
      setTotal(categories.length || 0);
      setError(false);
    } catch (err: any) {
      setError(true);
      toast.error(err.response?.data?.message || 'Failed to fetch patient categories');
      console.error('Error fetching patient categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await doctorsService.getAll();
      const doctorsData = res.data?.data || [];
      setDoctors(doctorsData);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch summary');
      console.error('Error fetching summary:', err);
    }
  };

  const handlePaymentSuccess = () => {
    // Refresh the data or update UI after successful payment
    console.log('Payment successful - refresh data');
    // You can add your data refresh logic here
  };

  useEffect(() => {
    fetchPatients();
    fetchDepartments();
    fetchPatientCategories();
    fetchDoctors();
  }, [filters]);

  return (
    <Box sx={{ px: 3, backgroundColor: '#f5f5f5', mt: -10 }}>
      {/* <Typography variant="h5" sx={{ my: 2 }}>
        Laboratory Patient List
      </Typography> */}

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        {/* Compact Filter Row */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'end' }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search patients..."
            value={filters.search}
            onChange={e => setFilters({ ...filters, search: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 200, flex: 1 }}
          />

          {/* Consultant */}
          <TextField
            size="small"
            select
            value={filters.doctor_id}
            onChange={e => setFilters({ ...filters, doctor_id: e.target.value })}
            placeholder="Consultant"
            SelectProps={{
              IconComponent: ArrowDropDown,
              displayEmpty: true,
              renderValue: selected => {
                if (selected === '') {
                  return 'All Consultants';
                }
                return doctors.find(doctor => doctor.id === selected)?.name || selected;
              },
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Consultants</MenuItem>
            {doctors.map(doctor => (
              <MenuItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Gender */}
          <TextField
            size="small"
            select
            value={filters.gender}
            onChange={e => setFilters({ ...filters, gender: e.target.value })}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected: unknown) => {
                if (selected === '' || !selected) {
                  return <span>All Genders</span>;
                }
                return <span>{selected as string}</span>;
              },
            }}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All Genders</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </TextField>

          {/* Clear Button */}
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

        {/* Secondary Filters */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'end', mt: 1.5 }}>
          {/* Date Range */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: '600', color: '#666', whiteSpace: 'nowrap' }}
            >
              Created:
            </Typography>
            <TextField
              size="small"
              type="date"
              value={filters.created_from}
              onChange={e => setFilters({ ...filters, created_from: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />
            <TextField
              size="small"
              type="date"
              value={filters.created_to}
              onChange={e => setFilters({ ...filters, created_to: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />
          </Box>

          {/* DOB Range */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: '600', color: '#666', whiteSpace: 'nowrap' }}
            >
              DOB:
            </Typography>
            <TextField
              size="small"
              type="date"
              value={filters.dob_from}
              onChange={e => setFilters({ ...filters, dob_from: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />
            <TextField
              size="small"
              type="date"
              value={filters.dob_to}
              onChange={e => setFilters({ ...filters, dob_to: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 140 }}
            />
          </Box>

          {/* Visit Type */}
          <TextField
            size="small"
            select
            value={filters.visit_type}
            onChange={e => setFilters({ ...filters, visit_type: e.target.value })}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected: unknown) => {
                if (selected === '' || !selected) {
                  return <span>All Visit Types</span>;
                }
                return <span>{selected as string}</span>;
              },
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Visit Types</MenuItem>
            <MenuItem value="Follow Up">Follow Up</MenuItem>
            <MenuItem value="New">New</MenuItem>
          </TextField>

          {/* Department */}
          {/* <TextField
            size="small"
            select
            value={filters.department}
            onChange={e => setFilters({ ...filters, department: e.target.value })}
            placeholder="Department"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept, index) => (
              <MenuItem key={index} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField> */}

          {/* Patient Category */}
          <TextField
            size="small"
            select
            value={filters.patient_category_id}
            onChange={e => setFilters({ ...filters, patient_category_id: e.target.value })}
            placeholder="Category"
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected: unknown) => {
                if (selected === '' || !selected) {
                  return 'All Categories';
                }
                const category = patientCategories.find(cat => cat.id === selected);
                return category?.name || (selected as string);
              },
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {patientCategories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* Patient Table */}
      <Paper sx={{ p: 0, borderRadius: '8px', overflow: 'hidden' }}>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple />

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
                  Status
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

                  {/* Status */}
                  <TableCell>
                    <Chip
                      label={patient.status === '1' ? 'Active' : 'Inactive'}
                      color={patient.status === '1' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      {/* View Details */}
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => patient}
                          sx={{
                            bgcolor: '#4caf50',
                            color: '#fff',
                            '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.1)' },
                          }}
                        >
                          <Eye size={20} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Process Laboratory Payment" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenPaymentModal(patient)}
                          sx={{
                            backgroundColor: '#4caf50',
                            color: 'white',
                            '&:hover': { backgroundColor: '#388e3c' },
                          }}
                        >
                          <Payment fontSize="small" />
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
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <LaboratoriesPaymentModal
          open={paymentModalOpen}
          onClose={handleClosePaymentModal}
          patientId={selectedPatient?.id || ''}
          patientName={selectedPatient?.name || ''}
          onPaymentSuccess={handlePaymentSuccess}
        />

        <AttachmentsModal
          open={attachModalOpen}
          onClose={() => setAttachModalOpen(false)}
          attachments={currentAttachments}
        />

        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.per_page}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Modals */}
      {/* <PatientDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        patient={selectedPatient}
      /> */}
    </Box>
  );
};

export default RequestedPayments;
