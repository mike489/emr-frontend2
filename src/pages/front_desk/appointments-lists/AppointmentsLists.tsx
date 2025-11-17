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
  Grid,
  Button,
  Divider,
  CircularProgress,
  TablePagination,
  Tooltip,
  IconButton,
  DialogContent,
  Dialog,
  DialogTitle,
} from '@mui/material';
import { Calendar, X } from 'lucide-react';

import { Search, ArrowDropDown } from '@mui/icons-material';

import { toast } from 'react-toastify';
import AttachmentsModal from '../../../features/triage/components/AttachmentsModal';
import { DepartmentsService } from '../../../shared/api/services/departments.service';
import { doctorsService } from '../../../shared/api/services/Doctor.service';

import { PatientCategoryService } from '../../../shared/api/services/patientCatagory.service';
import { PatientSummaryService } from '../../../shared/api/services/patientsSummary.service';
import { AppointmentsService } from '../../../shared/api/services/appointments.services';
import Fallbacks from '../../../features/shared/components/Fallbacks';
import ErrorPrompt from '../../../features/shared/components/ErrorPrompt';
import RescheduleAppointment from './Reschedule';

// Updated Type definitions to match your API response
interface Appointment {
  id: string;
  visit_id: string | null;
  patient_name: string;
  phone_number: string;
  email: string;
  age: number;
  gender: string;
  doctor_id: string;
  appointment_date: string;
  time: string;
  source: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  doctor: {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    phone: string;
    username: string;
    email: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      username: string;
      status: string;
      profile_photo_path: string | null;
      created_at: string;
      updated_at: string;
      profile_photo_url: string;
    };
  };
  attachments?: Attachment[];
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
const sources = [
  { id: 'Website', name: 'Website' },
  { id: 'Call Center', name: 'Call Center' },
  { id: 'In Person', name: 'In Person' },
];

const AppointmentsLists: React.FC = () => {
  const [patients, setPatients] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [_total, setTotal] = React.useState<number>(0);
  const [error, setError] = React.useState<boolean>(false);
  const [_departments, setDepartments] = React.useState<string[]>([]);
  const [_summary, setSummary] = React.useState<any[]>([]);
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [_uploadingId, _setUploadingId] = React.useState<string | null>(null);
  const [attachModalOpen, setAttachModalOpen] = React.useState(false);
  const [currentAttachments, _setCurrentAttachments] = React.useState<Attachment[]>([]);
  const [_patientCategories, setPatientCategories] = React.useState<{ id: string; name: string }[]>(
    []
  );
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Open reschedule modal
  const handleOpenReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleOpen(true);
  };

  // Close reschedule modal
  const handleCloseReschedule = () => {
    setRescheduleOpen(false);
    setSelectedAppointment(null);
  };

  // Handle successful reschedule
  const handleRescheduleSuccess = () => {
    handleCloseReschedule();
    fetchPatients(); // Refresh the list
    toast.success('Appointment rescheduled successfully!');
  };
  const [filters, setFilters] = React.useState({
    page: 1,
    per_page: 25,
    sort_by: 'created_at',
    sort_order: 'asc',
    department: 'Reception',
    search: '',
    gender: '',
    doctor_id: '',
    patient_category_id: '',
    dob_from: '',
    source: '',
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPerPage = parseInt(event.target.value, 10);
    setFilters(prev => ({ ...prev, per_page: newPerPage, page: 1 }));
  };



  const clearFilters = () => {
    setFilters({
      page: 1,
      per_page: 25,
      sort_by: 'created_at',
      sort_order: 'asc',
      department: '',
      search: '',
      gender: '',
      source: '',
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
      const res = await AppointmentsService.getList(filters);

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
      toast.error(err.response?.data?.data?.message || 'Failed to fetch patients');
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

  const fetchSummary = async () => {
    try {
      const res = await PatientSummaryService.getAll('Reception');
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


  return (
    <Box sx={{ px: 3, backgroundColor: '#f5f5f5', mt: -12 }}>
      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Patient Category Summary Cards */}
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
          {/* Select Source */}
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
              Select Source
            </Typography>
            <TextField
              fullWidth
              size="small"
              select
              value={filters.source}
              onChange={e => setFilters({ ...filters, source: e.target.value })}
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
              <MenuItem value="">Select Source</MenuItem>
              {sources.map(source => (
                <MenuItem key={source.id} value={source.id}>
                  {source.name}
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
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple />

        <TableContainer>
          <Table>
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
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: 150,
                  }}
                >
                  Patient Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: 150,
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: 120,
                  }}
                >
                  Phone Number
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: 60,
                  }}
                >
                  Age
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: 80,
                  }}
                >
                  Gender
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: 150,
                  }}
                >
                  Doctor
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: 120,
                  }}
                >
                   Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: 100,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    width: 200,
                    textAlign: 'center',
                  }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <ErrorPrompt
                      title="Error"
                      message="Failed to load appointments. Please try again later."
                    />
                  </TableCell>
                </TableRow>
              ) : patients.length > 0 ? (
                patients.map((appointment, index) => (
                  <TableRow key={appointment.id || index} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {appointment.patient_name}
                      </Typography>
                    </TableCell>
                    <TableCell>{appointment.email}</TableCell>
                    <TableCell>{appointment.phone_number}</TableCell>
                    <TableCell>{appointment.age} years</TableCell>
                    <TableCell>{appointment.gender}</TableCell>
                    <TableCell>{appointment.doctor?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {new Date(appointment.appointment_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {appointment.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor:
                            appointment.status === 'Confirmed'
                              ? '#e8f5e8'
                              : appointment.status === 'Pending'
                                ? '#fff3e0'
                                : appointment.status === 'Cancelled'
                                  ? '#ffebee'
                                  : '#f5f5f5',
                          color:
                            appointment.status === 'Confirmed'
                              ? '#2e7d32'
                              : appointment.status === 'Pending'
                                ? '#f57c00'
                                : appointment.status === 'Cancelled'
                                  ? '#c62828'
                                  : '#757575',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {appointment.status}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 0.5,
                          flexWrap: 'nowrap',
                        }}
                      >
                  
                        <Tooltip title="Reschedule Appointment" arrow placement="top">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenReschedule(appointment)}
                            sx={{
                             backgroundColor: 'primary.main',
                              color: 'white',
                              borderRadius: '50%', 
                              width: 32,
                              height: 32,
                              '&:hover': {
                                backgroundColor: 'primary.dark',
                                transform: 'scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <Calendar size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Fallbacks
                      title="No appointments found."
                      description="Please create new appointments."
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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
      <Dialog
        open={rescheduleOpen}
        onClose={handleCloseReschedule}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e9ecef',
            py: 2,
          }}
        >
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
            Reschedule Appointment
          </Typography>
          <IconButton
            onClick={handleCloseReschedule}
            size="small"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {selectedAppointment && (
            <RescheduleAppointment
              appointmentId={selectedAppointment.id}
              onSuccess={handleRescheduleSuccess}
              onCancel={handleCloseReschedule}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AppointmentsLists;
