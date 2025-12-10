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
} from '@mui/material';
import { Search, ArrowDropDown, Bed } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { BedAndWardService } from '../../../shared/api/services/BedandWard.service';
import { DotMenu } from '../../../features/shared/ui-component/menu/DotMenu';
import CreateWardModal from '../../../features/ward_bed/CreateWard';
import UpdateWardModal from '../../../features/ward_bed/UpdateWard';

// Types based on your backend response
interface Bed {
  id: string;
  bed_number: string;
  status: 'available' | 'occupied';
}

interface Ward {
  id: string;
  name: string;
  description: string;
  capacity: string;
  beds: Bed[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  status: number;
  data: Ward[];
}

const WardManagement: React.FC = () => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [wardToDelete, setWardToDelete] = useState<Ward | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); // Add edit modal state
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null); // Add selected ward state

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: '',
  });

  // Pagination
  const [pagination, setPagination] = useState({
    page: 0,
    per_page: 10,
    total: 0,
  });

  // Fetch wards data
  const fetchWards = async () => {
    setLoading(true);
    try {
      const axiosResponse = await BedAndWardService.getAll();
      const response: ApiResponse = axiosResponse.data;

      if (response.success && response.data) {
        setWards(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.length,
        }));
        setError(false);
      } else {
        setError(true);
        toast.error('Failed to fetch wards data');
      }
    } catch (err: any) {
      setError(true);
      toast.error(err.response?.data?.message || 'Failed to fetch wards');
      console.error('Error fetching wards:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWards();
  }, []);

  // Handle delete ward
  const handleDeleteWard = async () => {
    if (!wardToDelete) return;

    try {
      await BedAndWardService.delete(wardToDelete.id);
      toast.success(`Ward "${wardToDelete.name}" deleted successfully`);
      fetchWards(); // Refresh data
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete ward');
    } finally {
      setDeleteDialogOpen(false);
      setWardToDelete(null);
    }
  };

  // Handle edit ward - UPDATED
  const handleEditWard = (ward: Ward) => {
    setSelectedWard(ward);
    setEditModalOpen(true);
  };

  // Handle view ward details
  // const handleViewWard = (ward: Ward) => {
  //   // Navigate to view page or open view modal
  //   toast.info(`View ward: ${ward.name}`);
  //   console.log('View ward:', ward);
  // };

  // Open delete confirmation dialog
  const openDeleteDialog = (ward: Ward) => {
    setWardToDelete(ward);
    setDeleteDialogOpen(true);
  };

  // Handle successful update
  const handleUpdateSuccess = () => {
    fetchWards(); // Refresh data
    setEditModalOpen(false);
    setSelectedWard(null);
  };

  // Calculate available beds
  const getAvailableBeds = (beds: Bed[]) => {
    return beds.filter(bed => bed.status === 'available').length;
  };

  // Calculate occupied beds
  const getOccupiedBeds = (beds: Bed[]) => {
    return beds.filter(bed => bed.status === 'occupied').length;
  };

  // Filter wards based on search
  const filteredWards = wards.filter(ward => {
    const matchesSearch =
      ward.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      ward.description.toLowerCase().includes(filters.search.toLowerCase());

    if (filters.status === 'available') {
      return matchesSearch && getAvailableBeds(ward.beds) > 0;
    } else if (filters.status === 'full') {
      return matchesSearch && getAvailableBeds(ward.beds) === 0;
    }

    return matchesSearch;
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
    });
  };

  // Get paginated wards
  const paginatedWards = filteredWards.slice(
    pagination.page * pagination.per_page,
    (pagination.page + 1) * pagination.per_page
  );

  return (
    <Box sx={{ px: 3, backgroundColor: '#f5f5f5', mt: -10 }}>
      <Typography variant="h5" sx={{ my: 2 }}>
        Ward Management
      </Typography>

      {/* Filters Section */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'end' }}>
          {/* Search */}
          <TextField
            size="small"
            placeholder="Search wards..."
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
              renderValue: selected => {
                if (selected === '') {
                  return 'All Status';
                }
                return selected === 'available' ? 'Has Available Beds' : 'Full';
              },
            }}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="available">Has Available Beds</MenuItem>
            <MenuItem value="full">Full</MenuItem>
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

          {/* Add New Ward Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{
              height: '40px',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
              ml: 'auto',
            }}
            onClick={() => setCreateModalOpen(true)}
          >
            Add New Ward
          </Button>
        </Box>
      </Paper>

      {/* Wards Table */}
      <Paper sx={{ p: 0, borderRadius: '8px', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Ward Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Available Beds</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Occupied Beds</TableCell>
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
                      Loading wards...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="error">Error loading wards. Please try again.</Typography>
                    <Button variant="outlined" onClick={fetchWards} sx={{ mt: 1 }}>
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ) : paginatedWards.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography color="textSecondary">No wards found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedWards.map(ward => {
                  const availableBeds = getAvailableBeds(ward.beds);
                  const occupiedBeds = getOccupiedBeds(ward.beds);
                  const totalBeds = ward.beds.length;
                  const capacityPercentage = (occupiedBeds / totalBeds) * 100;

                  return (
                    <TableRow key={ward.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Bed color="primary" fontSize="small" />
                          <Typography variant="body2" fontWeight="medium">
                            {ward.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {ward.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{totalBeds} beds</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${availableBeds} available`}
                          color="success"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${occupiedBeds} occupied`}
                          color="warning"
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={availableBeds > 0 ? 'Available' : 'Full'}
                          color={availableBeds > 0 ? 'success' : 'error'}
                          size="small"
                        />
                        <Typography variant="caption" display="block" color="textSecondary">
                          {Math.round(capacityPercentage)}% occupied
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <DotMenu
                          onEdit={() => handleEditWard(ward)}
                          onDelete={() => openDeleteDialog(ward)}
                          // onView={() => handleViewWard(ward)}
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
          count={filteredWards.length}
          page={pagination.page}
          onPageChange={handleChangePage}
          rowsPerPage={pagination.per_page}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Create Ward Modal */}
      <CreateWardModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchWards}
      />

      {/* Edit Ward Modal */}
      {selectedWard && (
        <UpdateWardModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedWard(null);
          }}
          onSuccess={handleUpdateSuccess}
          ward={selectedWard}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Ward</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete ward "{wardToDelete?.name}"? This action cannot be
            undone.
          </Typography>
          {wardToDelete && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Capacity:</strong> {wardToDelete.beds.length} beds
              </Typography>
              <Typography variant="body2">
                <strong>Description:</strong> {wardToDelete.description}
              </Typography>
              <Typography variant="body2">
                <strong>Current Status:</strong>{' '}
                {getAvailableBeds(wardToDelete.beds) > 0 ? 'Has available beds' : 'Full'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteWard} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WardManagement;
