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
  Button,
  CircularProgress,
  TablePagination,
  Tooltip,
  IconButton,
} from '@mui/material';
import { Send, Eye, FileUp, FileSearch } from 'lucide-react';
import { Search, ArrowDropDown } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PatientService } from '../../shared/api/services/patient.service';
import { toast } from 'react-toastify';
import { DepartmentsService } from '../../shared/api/services/departments.service';
import { PatientCategoryService } from '../../shared/api/services/patientCatagory.service';
import { doctorsService } from '../../shared/api/services/Doctor.service';
import { sendToDepartmentService, UploadService } from '../../shared/api/services/sendTo.service';
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
  visit_type: string;
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

const FollowUpPatients: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [_total, setTotal] = React.useState<number>(0);
  const [error, setError] = React.useState<boolean>(false);
  const [departments, setDepartments] = React.useState<string[]>([]);

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
    department: 'Triage 1',
    search: '',
    visit_type:'Follow Up',
    gender: '',
    doctor_id: '',
    patient_category_id: '',
    dob_from: '',
    dob_to: '',
    age_min: '',
    age_max: '',
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
      department: 'Triage 1',
      visit_type:'Follow Up',
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
      sort_dir: 'asc',
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
      toast.error(err.response?.data?.data?.message || 'Failed to fetch departments');
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
      toast.error(err.response?.data?.data?.message || 'Failed to fetch patient categories');
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
      toast.error(err.response?.data?.data?.message || 'Failed to fetch summary');
      console.error('Error fetching summary:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchDepartments();
    fetchPatientCategories();

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

  const handleSortByName = () => {
    setFilters(prev => ({
      ...prev,
      sort_by: 'full_name',
      sort_dir: prev.sort_dir === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', mt: 0 }}>
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
              displayEmpty: true, // Add this
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

          {/* Department */}
          <TextField
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
          </TextField>

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
      <Paper sx={{ p: 0 }}>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} />

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
                  onClick={handleSortByName}
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
                    width: 100,
                    fontSize: '0.8rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
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
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  Consultant
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    width: 100,
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
                    width: 200,
                    fontSize: '0.8rem',
                    py: 1.5,
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
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} sx={{ color: '#1e3c72' }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
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
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {/* -------------------- SEND TO -------------------- */}
                        <Tooltip title="Send to doctor or department" arrow>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setCurrentPatientId(patient.id);
                              setSendModalOpen(true);
                            }}
                            sx={{
                              backgroundColor: '#1976d2',
                              color: 'white',
                              '&:hover': { backgroundColor: '#1565c0' },
                            }}
                          >
                            <Send size={18} />
                          </IconButton>
                        </Tooltip>

                        {/* -------------------- EXAMINATIONS  and FOLLOW-UP -------------------- */}

                          <Tooltip title="Open Follow-Up Form" arrow>
                            <IconButton
                              size="small"
                               onClick={() => navigate('/triage/follow-up', {
                                  state: { patientId: patient.id, consultantId: patient.constultation_id },
                                })}
                              sx={{
                                backgroundColor: '#1b5e20', 
                                color: 'white',
                                '&:hover': { backgroundColor: '#2e7d32' },
                              }}
                            >
                              <Eye size={18} />
                            </IconButton>
                          </Tooltip>
                        {/* -------------------- ATTACH FILES -------------------- */}
                        <Tooltip title="Attach files for this patient" arrow>
                          <span>
                            <IconButton
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

                        {/* -------------------- VIEW / DOWNLOAD -------------------- */}
                        <Tooltip title="View or download attachments" arrow>
                          <IconButton
                            size="small"
                            onClick={() => openAttachModal(patient.attachments)}
                            sx={{
                              border: '1px solid #1976d2',
                              color: '#1976d2',
                              backgroundColor: '#fff',
                              '&:hover': { backgroundColor: '#e3f2fd' },
                            }}
                          >
                            <FileSearch size={18} />
                          </IconButton>
                        </Tooltip>

                        {/* Hidden File Input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          style={{ display: 'none' }}
                          accept="*/*"
                        />
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
  );
};

export default FollowUpPatients;
