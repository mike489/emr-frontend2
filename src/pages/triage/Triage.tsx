import React, { useEffect } from 'react';
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
  Grid,
  Button,
  Divider,
  CircularProgress,
  TablePagination,
} from '@mui/material';

import { Search, ArrowDropDown } from '@mui/icons-material';
import AppLayout from '../../layouts/AppLayout';
import { useNavigate } from 'react-router-dom';
import { PatientService } from '../../shared/api/services/patient.service';
import { toast } from 'react-toastify';
import { DepartmentsService } from '../../shared/api/services/departments.service';
import { PatientCategoryService } from '../../shared/api/services/patientCatagory.service';
import { PatientSummaryService } from '../../shared/api/services/patientsSummary.service';
import { doctorsService } from '../../shared/api/services/Doctor.service';
import {
  sendToDepartmentService,
  sendToTriageService,
  UploadService,
} from '../../shared/api/services/sendTo.service';
import SendModal from '../../features/triage/components/sendModal';
import AttachmentsModal from '../../features/triage/components/AttachmentsModal';

// Updated Type definitions to match your API response
interface Patient {
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
  blood_type: string;
  height: string;
  weight: string;
  national_id: string;
  constultation_id: string;
  passport_number: string;
  medical_history: string | null;
  allergies: string | null;
  medical_conditions: string | null;
  created_by: string;
  patient_category_id: string;
  patient_category: {
    id: string;
    name: string;
    description: string;
    color: string;
  };
  status: string;
  age: number;
  is_card_expired: boolean;
  current_doctor: string | { id?: string; name?: string } | null;
  attachments: Attachment[];
}

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

const Triage: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState<number>(0);
  const [error, setError] = React.useState<boolean>(false);
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [summary, setSummary] = React.useState<any[]>([]);
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploadingId, setUploadingId] = React.useState<string | null>(null);
  const [sendModalOpen, setSendModalOpen] = React.useState(false);
  const [currentPatientId, setCurrentPatientId] = React.useState<string | null>(null);
  const [attachModalOpen, setAttachModalOpen] = React.useState(false);
  const [currentAttachments, setCurrentAttachments] = React.useState<Attachment[]>([]);

  const [patientCategories, setPatientCategories] = React.useState<{ id: string; name: string }[]>(
    []
  );
  const [filters, setFilters] = React.useState({
    page: 1,
    per_page: 25,
    sort_by: 'full_name',
    sort_order: 'asc',
    department: 'Triage',
    search: '',
    gender: '',
    doctor_id: '',
    patient_category_id: '',
    dob_from: '',
    dob_to: '',
    age_min: '',
    age_max: '',
    created_from: '',
    created_to: '',
  });

  const [pagination, setPagination] = React.useState<PaginationState>({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });

  const handleChangePage = (_event: unknown, newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  };
  const openAttachModal = (attachments: Attachment[]) => {
    setCurrentAttachments(attachments);
    setAttachModalOpen(true);
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
      department: '',
      search: '',
      gender: '',
      doctor_id: '',
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
      const res = await PatientService.getList(filters);

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
      // Based on your API response structure, the data is at res.data.data
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

  // Wrapper function with hardcoded department for this page
  const getFrontDeskSummary = () => PatientSummaryService.getAll('Triage');

  // Then use it
  const fetchSummary = async () => {
    try {
      const res = await getFrontDeskSummary();
      const summaryData = res.data?.data?.patient_categories || [];
      setSummary(summaryData);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch summary');
      console.error('Error fetching summary:', err);
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

  useEffect(() => {
    fetchPatients();
    fetchDepartments();
    fetchPatientCategories();
    fetchSummary();
    fetchDoctors();
  }, [filters]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    patientId: string
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingId(patientId);
      await UploadService.uploadFiles(patientId, Array.from(files));
      toast.success('Files uploaded successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload files');
    } finally {
      setUploadingId(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <AppLayout>
      <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#333' }}
            >
              Triage Dashboard
            </Typography>
            {/* <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              Real-time patient flow and management - Total: {total}
            </Typography> */}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/new-patient')}
            sx={{ textTransform: 'none', borderRadius: '20px', px: 3, height: '40px' }}
          >
            + New Patient
          </Button>
        </Box>

        {/* Search and Filter Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
              sx={{
                textTransform: 'none',
                borderRadius: '20px',

                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  borderColor: '#1976d2',
                },
              }}
            >
              ← Back
            </Button>
          </Box>
          {/* Patient Category Summary Cards */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 3,
              flexWrap: 'wrap',
              backgroundColor: '#e0e0e0',
              p: 1.5,
              borderRadius: 1,
              mb: 4,
            }}
          >
            {summary.map((category: any) => (
              <Box
                key={category.category_id}
                sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: category.color,
                    color: '#000000',
                    textTransform: 'none',
                    borderRadius: '20px',
                    px: 3,
                    '&:hover': {
                      backgroundColor: category.color,
                    },
                  }}
                >
                  {category.category_name}
                </Button>
                <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                  {category.patient_count}
                </Typography>
              </Box>
            ))}

            {/* Total Check-ins */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#3f97fc',
                  color: '#fff',
                  textTransform: 'none',
                  borderRadius: '20px',
                  px: 3,
                  '&:hover': { backgroundColor: '#559ff3' },
                }}
              >
                Total Check-ins
              </Button>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                {summary.reduce((acc, cat: any) => acc + Number(cat.patient_count), 0)}
              </Typography>
            </Box>

            {/* Total Checkouts (replace with actual backend value if available) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#3f97fc',
                  color: '#fff',
                  textTransform: 'none',
                  borderRadius: '20px',
                  px: 3,
                  '&:hover': { backgroundColor: '#559ff3' },
                }}
              >
                Total Checkouts
              </Button>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                {/* Replace 0 with actual total checkouts from backend */}0
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid size={{ xs: 12, sm: 6, md: 5 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                Search
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Search"
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    height: '32px',
                    fontSize: '0.8rem',
                  },
                  '& .MuiInputBase-input': {
                    py: 0.5,
                  },
                }}
              />
            </Grid>

            {/* Select Consultant */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                Select Consultant
              </Typography>
              <TextField
                fullWidth
                size="small"
                select
                value={filters.doctor_id}
                onChange={e => setFilters({ ...filters, doctor_id: e.target.value })}
                SelectProps={{
                  IconComponent: ArrowDropDown,
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    height: '32px',
                    fontSize: '0.8rem',
                  },
                  '& .MuiInputBase-input': {
                    py: 0.5,
                  },
                }}
              >
                <MenuItem value="">Select Consultant</MenuItem>
                {doctors.map(doctor => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {/* Second row of filters */}
          <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
            {/* Created From */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                Created From
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={filters.created_from}
                onChange={e => setFilters({ ...filters, created_from: e.target.value })}
                sx={{
                  '& .MuiInputBase-root': { height: '32px', fontSize: '0.8rem' },
                  '& .MuiInputBase-input': { py: 0.5 },
                }}
              />
            </Grid>

            {/* Created To */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                Created To
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={filters.created_to}
                onChange={e => setFilters({ ...filters, created_to: e.target.value })}
                sx={{
                  '& .MuiInputBase-root': { height: '32px', fontSize: '0.8rem' },
                  '& .MuiInputBase-input': { py: 0.5 },
                }}
              />
            </Grid>

            {/* DOB From */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                DOB From
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={filters.dob_from}
                onChange={e => setFilters({ ...filters, dob_from: e.target.value })}
                sx={{
                  '& .MuiInputBase-root': { height: '32px', fontSize: '0.8rem' },
                  '& .MuiInputBase-input': { py: 0.5 },
                }}
              />
            </Grid>

            {/* DOB To */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                DOB To
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={filters.dob_to}
                onChange={e => setFilters({ ...filters, dob_to: e.target.value })}
                sx={{
                  '& .MuiInputBase-root': { height: '32px', fontSize: '0.8rem' },
                  '& .MuiInputBase-input': { py: 0.5 },
                }}
              />
            </Grid>

            {/* Gender */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                Gender
              </Typography>
              <TextField
                fullWidth
                size="small"
                select
                value={filters.gender}
                onChange={e => setFilters({ ...filters, gender: e.target.value })}
                SelectProps={{ IconComponent: ArrowDropDown }}
                sx={{
                  '& .MuiInputBase-root': { height: '32px', fontSize: '0.8rem' },
                  '& .MuiInputBase-input': { py: 0.5 },
                }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>
            </Grid>

            {/* Department dropdown */}
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                Department
              </Typography>
              <TextField
                fullWidth
                size="small"
                select
                value={filters.department}
                onChange={e => setFilters({ ...filters, department: e.target.value })}
                SelectProps={{ IconComponent: ArrowDropDown, displayEmpty: true }}
                sx={{
                  '& .MuiInputBase-root': { height: '32px', fontSize: '0.8rem' },
                  '& .MuiInputBase-input': { py: 0.5 },
                }}
              >
                {departments.map((dept, index) => (
                  <MenuItem key={index} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
                Patient Category
              </Typography>
              <TextField
                fullWidth
                size="small"
                select
                value={filters.patient_category_id}
                onChange={e => setFilters({ ...filters, patient_category_id: e.target.value })}
                SelectProps={{ IconComponent: ArrowDropDown, displayEmpty: true }}
                sx={{
                  '& .MuiInputBase-root': { height: '32px', fontSize: '0.8rem' },
                  '& .MuiInputBase-input': { py: 0.5 },
                }}
              >
                {patientCategories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 1 }}>
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2.5, borderColor: '#d32f2f', color: '#d32f2f' }}
                onClick={clearFilters}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Patient Table */}
        <Paper sx={{ p: 0 }}>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Patient Name</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>MR Number</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>City</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Blood Type</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Consultant</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#333' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        Loading patients...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="error">
                        Error loading patients. Please try again.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <TableRow key={patient.id || index}>
                      <TableCell>
                        {' '}
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '10%',
                            backgroundColor: patient.patient_category?.color || '#ccc',
                            display: 'inline-block',
                            mr: 1,
                            border: '1px solid #e0e0e0',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {patient.patient_category.name}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {patient.full_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {patient.title}
                        </Typography>
                      </TableCell>
                      <TableCell>{patient.emr_number}</TableCell>
                      <TableCell>{patient.age} years</TableCell>
                      <TableCell>{patient.gender}</TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>{patient.address?.city}</TableCell>
                      <TableCell>{patient.blood_type}</TableCell>
                      <TableCell>
                        {patient.current_doctor && typeof patient.current_doctor === 'object'
                          ? patient.current_doctor.name
                          : patient.current_doctor || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: 'inline-block',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor: patient.status === '1' ? '#e8f5e8' : '#fff3e0',
                            color: patient.status === '1' ? '#2e7d32' : '#f57c00',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {patient.status === '1' ? 'Active' : 'Inactive'}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ gap: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => {
                              setCurrentPatientId(patient.id);
                              setSendModalOpen(true);
                            }}
                            sx={{
                              textTransform: 'none',
                              borderRadius: '16px',
                              px: 0.8,
                              py: 0.4,
                              minWidth: 70,
                              fontSize: '0.7rem',
                              backgroundColor: '#1976d2',
                              '&:hover': { backgroundColor: '#1565c0' },
                            }}
                          >
                            Send to
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            disabled={uploadingId === patient.id}
                            onClick={() => {
                              if (fileInputRef.current) {
                                fileInputRef.current.onchange = (e: any) =>
                                  handleFileChange(e, patient.id);
                                fileInputRef.current.click();
                              }
                            }}
                            sx={{
                              textTransform: 'none',
                              borderRadius: '16px',
                              px: 0.8,
                              py: 0.4,
                              minWidth: 70,
                              fontSize: '0.7rem',
                              backgroundColor: '#626568',
                              '&:hover': { backgroundColor: '#000000' },
                            }}
                          >
                            {uploadingId === patient.id ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              'Attach Files'
                            )}
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => openAttachModal(patient.attachments)}
                            sx={{
                              textTransform: 'none',
                              borderRadius: '16px',
                              px: 0.8,
                              py: 0.4,
                              minWidth: 90,
                              fontSize: '0.7rem',
                              backgroundColor: '#fff',
                              borderColor: '#1976d2',
                              color: '#1976d2',
                              '&:hover': { backgroundColor: '#e3f2fd' },
                            }}
                          >
                            View / Download
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        No patients found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <SendModal
            open={sendModalOpen}
            onClose={() => setSendModalOpen(false)}
            onSend={(department, doctor_id) => {
              if (currentPatientId) {
                const patientToSend = patients.find(p => p.id === currentPatientId);
                if (!patientToSend) return;

                sendToDepartmentService
                  .sendToDepartment(currentPatientId, {
                    department,
                    doctor_id,
                    from: patientToSend.constultation_id,
                  })
                  .then(() => {
                    toast.success('Patient sent to department successfully');
                    fetchPatients();
                  })
                  .catch((err: any) => {
                    toast.error(err.response?.data?.message || 'Failed to send patient');
                  });
              }
            }}
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
      </Box>
    </AppLayout>
  );
};

export default Triage;
