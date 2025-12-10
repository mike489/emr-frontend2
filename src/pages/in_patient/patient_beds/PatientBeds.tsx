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
  Button,
  Chip,
  TablePagination,
  TextField,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Alert,
} from '@mui/material';
import { Search, ArrowDropDown, Person, PersonOutline } from '@mui/icons-material';
import { toast, ToastContainer } from 'react-toastify';
import { DotMenu } from '../../../features/shared/ui-component/menu/DotMenu';
import { BedAndWardService } from '../../../shared/api/services/BedandWard.service';
import CreateBedModal from '../../../features/ward_bed/CreateBed';
import AssignPatientModal from '../../../features/ward_bed/AssignPatientModal';
import ReleasePatientModal from '../../../features/ward_bed/ReleasePatientModal';

// Updated types based on your backend response
interface Patient {
  id: string;
  full_name: string;
  emr_number: string;
}

interface Ward {
  id: string;
  name: string;
}

interface Bed {
  id: string;
  bed_id: string;
  bed_number: string;
  ward: Ward;
  patient: Patient | null;
  assigned_at: string;
  released_at: string | null;
  status?: 'available' | 'occupied';
}

// Helper function to determine bed status
const getBedStatus = (bed: Bed): 'available' | 'occupied' => {
  return bed.patient && !bed.released_at ? 'occupied' : 'available';
};

interface ApiResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    current_page: number;
    first_page_url: string;
    from: number;
    data: Bed[];
    // ... other pagination properties
  };
}

const PatientBeds: React.FC = () => {
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bedToDelete, setBedToDelete] = useState<Bed | null>(null);
  const [createBedModalOpen, setCreateBedModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    ward: '',
  });

  // Get unique wards for filter
  const [wards, setWards] = useState<Ward[]>([]);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    total: 0,
  });

  // Fetch beds data
  const fetchBeds = async () => {
    setLoading(true);
    try {
      const axiosResponse = await BedAndWardService.getPatientBeds();
      const response: ApiResponse = axiosResponse.data;

      if (response.success && response.data.data) {
        const bedsData = response.data.data;
        setBeds(bedsData);
        setPagination(prev => ({
          ...prev,
          total: bedsData.length,
        }));

        // Extract unique wards for filter
        const uniqueWards = Array.from(
          new Map(bedsData.map(bed => [bed.ward.id, bed.ward])).values()
        );
        setWards(uniqueWards);

        setError(false);
      } else {
        setError(true);
        toast.error('Failed to fetch beds data');
      }
    } catch (err: any) {
      setError(true);
      toast.error(err.response?.data?.message || 'Failed to fetch beds');
      console.error('Error fetching beds:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  // Handle delete bed
  const handleDeleteBed = async () => {
    if (!bedToDelete) return;

    try {
      await BedAndWardService.deleteBed(bedToDelete.id);
      toast.success(`Bed "${bedToDelete.bed_number}" deleted successfully`);
      fetchBeds(); // Refresh data
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete bed');
    } finally {
      setDeleteDialogOpen(false);
      setBedToDelete(null);
    }
  };

  // Handle edit bed
  const handleEditBed = (bed: Bed) => {
    toast.info(`Edit bed: ${bed.bed_number}`);
    console.log('Edit bed:', bed);
  };

  // Handle view bed details
  // const handleViewBed = (bed: Bed) => {
  //   toast.info(`View bed: ${bed.bed_number}`);
  //   console.log('View bed:', bed);
  // };

  // Handle assign patient to bed
  const handleAssignPatient = (bed: Bed) => {
    setSelectedBed(bed);
    setAssignModalOpen(true);
  };

  // Handle release patient from bed
  const handleReleasePatient = (bed: Bed) => {
    setSelectedBed(bed);
    setReleaseModalOpen(true);
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (bed: Bed) => {
    setBedToDelete(bed);
    setDeleteDialogOpen(true);
  };

  // Handle successful assign
  const handleAssignSuccess = () => {
    fetchBeds();
    setAssignModalOpen(false);
    setSelectedBed(null);
  };

  // Handle successful release
  const handleReleaseSuccess = () => {
    fetchBeds();
    setReleaseModalOpen(false);
    setSelectedBed(null);
  };

  // Filter beds based on filters
  const filteredBeds = beds.filter(bed => {
    const bedStatus = getBedStatus(bed);
    // const hasPatient = bed.patient && !bed.released_at;

    const matchesSearch =
      bed.bed_number.includes(filters.search) ||
      bed.ward.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (bed.patient?.full_name.toLowerCase().includes(filters.search.toLowerCase()) ?? false) ||
      (bed.patient?.emr_number.toLowerCase().includes(filters.search.toLowerCase()) ?? false);

    const matchesStatus = !filters.status || bedStatus === filters.status;
    const matchesWard = !filters.ward || bed.ward.id === filters.ward;

    return matchesSearch && matchesStatus && matchesWard;
  });

  // Handle page change
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPagination(prev => ({
      ...prev,
      per_page: parseInt(event.target.value, 10),
      page: 0,
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      ward: '',
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  // Get paginated beds
  const paginatedBeds = filteredBeds.slice(
    pagination.page * pagination.per_page,
    (pagination.page + 1) * pagination.per_page
  );

  return (
    <Box sx={{ px: 3, backgroundColor: '#f5f5f5', mt: -10 }}>
      <Typography variant="h5" sx={{ my: 2 }}>
        Patient Beds Management
      </Typography>

      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'end' }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search beds, ward, patient, or EMR..."
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

          {/* Status Filter */}
          <TextField
            size="small"
            select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            SelectProps={{
              IconComponent: ArrowDropDown,
              displayEmpty: true,
              renderValue: (selected: unknown) => {
                if (selected === '') {
                  return 'All Status';
                }
                return selected === 'available' ? 'Available' : 'Occupied';
              },
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="occupied">Occupied</MenuItem>
          </TextField>

          {/* Ward Filter */}
          <TextField
            size="small"
            select
            value={filters.ward}
            onChange={e => setFilters({ ...filters, ward: e.target.value })}
            SelectProps={{
              IconComponent: ArrowDropDown,
              displayEmpty: true,
              renderValue: (selected: unknown) => {
                const value = selected as string;
                if (value === '') {
                  return 'All Wards';
                }
                return wards.find(ward => ward.id === value)?.name || value;
              },
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Wards</MenuItem>
            {wards.map(ward => (
              <MenuItem key={ward.id} value={ward.id}>
                {ward.name}
              </MenuItem>
            ))}
          </TextField>

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

          {/* Add New Bed Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              height: '40px',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              ml: 'auto',
            }}
            onClick={() => setCreateBedModalOpen(true)}
          >
            Add New Bed
          </Button>
        </Box>
      </Paper>

      {/* Beds Table */}
      <Paper sx={{ p: 0, borderRadius: '8px', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Bed Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Ward</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>EMR Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Assigned At</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', width: '80px' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Loading beds...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="error">Error loading beds. Please try again.</Typography>
                    <Button variant="outlined" onClick={fetchBeds} sx={{ mt: 1 }}>
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ) : paginatedBeds.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">No beds found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBeds.map(bed => {
                  const isOccupied = getBedStatus(bed) === 'occupied';
                  const hasPatient = bed.patient && !bed.released_at;

                  return (
                    <TableRow key={bed.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" fontWeight="medium" fontSize={16}>
                            {bed.bed_number}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={bed.ward.name}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        {hasPatient ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                              <Person fontSize="small" />
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {bed.patient!.full_name}
                              </Typography>
                            </Box>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.300' }}>
                              <PersonOutline fontSize="small" />
                            </Avatar>
                            <Typography variant="body2" color="textSecondary">
                              No patient assigned
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasPatient ? (
                          <Typography variant="body2" fontWeight="medium">
                            {bed.patient!.emr_number}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {hasPatient ? (
                          <Typography variant="body2">{formatDate(bed.assigned_at)}</Typography>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isOccupied ? 'Occupied' : 'Available'}
                          color={isOccupied ? 'warning' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <DotMenu
                          onEdit={() => handleEditBed(bed)}
                          onDelete={() => openDeleteDialog(bed)}
                          // onView={() => handleViewBed(bed)}
                          onAssign={!isOccupied ? () => handleAssignPatient(bed) : undefined}
                          onRelease={isOccupied ? () => handleReleasePatient(bed) : undefined}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredBeds.length}
          page={pagination.page}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.per_page}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Modals */}
      <CreateBedModal
        open={createBedModalOpen}
        onClose={() => setCreateBedModalOpen(false)}
        onSuccess={fetchBeds}
      />

      {selectedBed && (
        <>
          <AssignPatientModal
            open={assignModalOpen}
            onClose={() => {
              setAssignModalOpen(false);
              setSelectedBed(null);
            }}
            bed={selectedBed}
            onSuccess={handleAssignSuccess}
          />

          <ReleasePatientModal
            open={releaseModalOpen}
            onClose={() => {
              setReleaseModalOpen(false);
              setSelectedBed(null);
            }}
            bed={{
              id: selectedBed.id,
              bed_number: selectedBed.bed_number,
              ward: { name: selectedBed.ward.name },
              current_patient: selectedBed.patient
                ? {
                    id: selectedBed.patient.id,
                    full_name: selectedBed.patient.full_name,
                    assigned_at: selectedBed.assigned_at,
                  }
                : null,
            }}
            onSuccess={handleReleaseSuccess}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Bed</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete bed "{bedToDelete?.bed_number}"? This action cannot be
            undone.
          </Typography>
          {bedToDelete && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Ward:</strong> {bedToDelete.ward.name}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong>{' '}
                {getBedStatus(bedToDelete) === 'occupied' ? 'Occupied' : 'Available'}
              </Typography>
              {bedToDelete.patient && !bedToDelete.released_at && (
                <Box>
                  <Typography variant="body2">
                    <strong>Patient:</strong> {bedToDelete.patient.full_name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>EMR Number:</strong> {bedToDelete.patient.emr_number}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
          {bedToDelete && getBedStatus(bedToDelete) === 'occupied' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                This bed is currently occupied. Deleting it may affect patient assignments.
              </Typography>
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteBed}
            color="error"
            variant="contained"
            disabled={!!bedToDelete && getBedStatus(bedToDelete) === 'occupied'}
          >
            {bedToDelete && getBedStatus(bedToDelete) === 'occupied'
              ? 'Cannot Delete Occupied Bed'
              : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </Box>
  );
};

export default PatientBeds;
