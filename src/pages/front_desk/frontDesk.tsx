import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
  CircularProgress,
  TablePagination,
  Chip,
} from '@mui/material';
import { Search, ArrowDropDown } from '@mui/icons-material';
import { PatientService } from '../../shared/api/services/patient.service';
import { toast } from 'react-toastify';
import { DepartmentsService } from '../../shared/api/services/departments.service';
import { PatientCategoryService } from '../../shared/api/services/patientCatagory.service';
import { PatientSummaryService } from '../../shared/api/services/patientsSummary.service';
import { doctorsService } from '../../shared/api/services/Doctor.service';
import { sendToTriageService, UploadService } from '../../shared/api/services/sendTo.service';
import AttachmentsModal from '../../features/triage/components/AttachmentsModal';
import PatientDetailsModal from '../../features/patients/PatientDetailsModal';
import TriageSelectModal from '../../features/patients/TriageSelectModal';
import PatientTable from '../../features/patients/PatientTable';
import { BillsService } from '../../shared/api/services/bills.service';
// import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../shared/api/types/patient.types';

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

const FrontDesk: React.FC = () => {
  const [patients, setPatients] = React.useState<Patient[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [_total, setTotal] = React.useState<number>(0);
  const [_error, setError] = React.useState<boolean>(false);
  const [departments, setDepartments] = React.useState<string[]>([]);
  const [summary, setSummary] = React.useState<any[]>([]);
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [uploadingId, setUploadingId] = React.useState<string | null>(null);
  const [attachModalOpen, setAttachModalOpen] = React.useState(false);
  const [summaryLoading, setSummaryLoading] = React.useState<boolean>(false);
  const [currentAttachments, setCurrentAttachments] = React.useState<Attachment[]>([]);
  const [openTriageModal, setOpenTriageModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const [patientCategories, setPatientCategories] = React.useState<{ id: string; name: string }[]>(
    []
  );
  const [filters, setFilters] = React.useState({
    page: 1,
    per_page: 25,
    sort_by: '',
    sort_order: '',
    department: 'Reception',
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
    sort_dir: '',
  });

  const [pagination, setPagination] = React.useState<PaginationState>({
    page: 0,
    per_page: 10,
    last_page: 0,
    total: 0,
  });
  const [selectedPatient, _setSelectedPatient] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  // const navigate = useNavigate();

  // const handleViewDetails = (patient: Patient) => {
  //   navigate('/front-desk/patient-details', { state: { patient } });
  // };
  const handleViewDetails = (patient: Patient) => {
    _setSelectedPatient(patient);
    setDetailsOpen(true);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPerPage = parseInt(event.target.value, 10);
    setFilters(prev => ({ ...prev, per_page: newPerPage, page: 1 }));
  };

  const openAttachModal = (attachments: Attachment[]) => {
    setCurrentAttachments(attachments);
    setAttachModalOpen(true);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      per_page: 25,
      sort_by: 'full_name',
      sort_order: 'asc',
      sort_dir: 'asc',
      department: 'Reception',
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

  const fetchSummary = async () => {
    setSummaryLoading(true);
    try {
      const res = await PatientSummaryService.getAll('Reception');
      const summaryData = res.data?.data?.patient_categories || [];
      setSummary(summaryData);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch summary');
      console.error('Error fetching summary:', err);
    } finally {
      setSummaryLoading(false);
    }
  };
  useEffect(() => {
    fetchSummary();
  }, []);

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

  const handleTriageSelect = async (
    id: string,
    triageRoom: string | { name: string; count?: number }
  ) => {
    try {
      const triageName = typeof triageRoom === 'string' ? triageRoom : triageRoom.name;
      await sendToTriageService.sendToTriage(id, { to: triageName });

      toast.success(`Patient sent to ${triageName} successfully`);
      fetchPatients();
      setOpenTriageModal(false);
    } catch (err: any) {
      console.error('Error sending patient to triage:', err);
      toast.error(err?.response?.data?.data?.message || 'Failed to send patient to triage');
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchDepartments();
    fetchPatientCategories();
    fetchDoctors();
  }, [filters]);
  const handleOpenTriageModal = (patient: Patient) => {
    setSelectedPatientId(patient.id); // store patient ID
    setOpenTriageModal(true); // open the modal
  };

  const handleFileChange = async (patientId: string, files: FileList | null) => {
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

  const handleCheckout = async (patient: Patient) => {
    try {
      setLoading(true);
      // Example data payload for checkout, adjust as needed
      const payload = { checkout_time: new Date().toISOString() };
      await PatientService.checkout(patient.id, payload);
      toast.success(`${patient.full_name} checked out successfully.`);
      // Refresh patients list
      fetchPatients();
    } catch (err: any) {
      console.error('Checkout error:', err);
      toast.error(err.response?.data?.data.message || 'Failed to checkout patient');
    } finally {
      setLoading(false);
    }
  };

  // Pay for a patient bill
  const handlePay = async (patient: Patient) => {
    try {
      setLoading(true);
      // Example payload, adjust if your API requires more
      const payload = { paid_at: new Date().toISOString(), method: 'cash' };
      await BillsService.pay(patient.id, payload);
      toast.success(`${patient.full_name} payment successful.`);
      // Refresh patients list
      fetchPatients();
    } catch (err: any) {
      console.error('Payment error:', err);
      toast.error(err.response?.data?.data.message || 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ px: 3, backgroundColor: '#f5f5f5', mt: -10 }}>
      {/* Search and Filter Section */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        {/* Header with Back Button and Summary Stats */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 3,
          }}
        >
          {/* Summary Stats */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip
                label={`Total Check-ins: ${summary.reduce((acc, cat: any) => acc + Number(cat.patient_count), 0)}`}
                sx={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                }}
              />
              <Chip
                label="Total Checkouts: 0"
                sx={{
                  backgroundColor: '#757575',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, p: 2, flexWrap: 'wrap' }}>
          {summaryLoading ? (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={30} sx={{ color: 'primary.main' }} />
            </Box>
          ) : (
            summary.map((category: any) => (
              <Box
                key={category.category_id}
                sx={{
                  flex: '1 1 220px',
                  minWidth: 220,
                  backgroundColor: '#fff',
                  borderRadius: 3,
                  p: 2,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  border: '1px solid #ededed',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: 120,
                }}
              >
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                  {category.category_name}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      fontWeight: 700,
                      color: '#1a1a1a',
                    }}
                  >
                    {category.patient_count}
                  </Typography>

                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '10%',
                      backgroundColor: `${category.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '10%',
                        backgroundColor: category.color,
                      }}
                    />
                  </Box>
                </Box>

                <Typography sx={{ fontSize: '0.8rem', mt: 1, color: '#888' }}>
                  {category.percentage_text}
                </Typography>
              </Box>
            ))
          )}
        </Box>
      </Paper>

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
            {/* <MenuItem value="Emergency">Emergency</MenuItem> */}
            <MenuItem value="New">New</MenuItem>
          </TextField>
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
      <Paper sx={{ p: 0, borderRadius: '8px', overflow: 'hidden' }}>
        <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple />

        <PatientTable
          patients={patients}
          loading={loading}
          uploadingId={uploadingId}
          onViewDetails={handleViewDetails}
          onCheckout={handleCheckout}
          onPay={handlePay}
          onSendToTriage={handleOpenTriageModal}
          // onAttachFiles={handleFileChange}
          onViewAttachments={openAttachModal}
          onAttachFiles={handleFileChange}
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
      {/* Modal */}
      <PatientDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        patient={selectedPatient}
      />
      <TriageSelectModal
        open={openTriageModal}
        onClose={() => setOpenTriageModal(false)}
        onSelect={triageRoom => {
          if (selectedPatientId) {
            handleTriageSelect(selectedPatientId, triageRoom);
          }
        }}
      />
    </Box>
  );
};

export default FrontDesk;
