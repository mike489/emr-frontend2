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
  InputAdornment,
  Button,
  CircularProgress,
  TablePagination,
  Tooltip,
  IconButton,
  MenuItem,
  Chip,
} from '@mui/material';
import { Edit, Trash2 } from 'lucide-react';
import { Search, ArrowDropDown } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { usersService } from '../../shared/api/services/users.services';

// User Type definition
interface Role {
  uuid: string;
  name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  status: string;
  created_at: string;
  roles: Role[];
  profile_photo_url?: string;
}

interface PaginationState {
  page: number;
  per_page: number;
  last_page: number;
  total: number;
}

interface FilterState {
  role: string;
  status: string;
  created_from: string;
  created_to: string;
}

const Management: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');

  const [pagination, setPagination] = React.useState<PaginationState>({
    page: 0,
    per_page: 10,
    last_page: 1,
    total: 0,
  });

  const [filters, setFilters] = React.useState<FilterState>({
    role: '',
    status: '',
    created_from: '',
    created_to: '',
  });

  const [roles] = React.useState<string[]>([
    'Doctor',
    'Laboratory',
    'Radiologist',
    'Admin',
    'Reception',
    'Triage',
  ]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    fetchUsers(newPage + 1, pagination.per_page);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPerPage = parseInt(event.target.value, 10);
    fetchUsers(1, newPerPage);
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({
      role: '',
      status: '',
      created_from: '',
      created_to: '',
    });
    fetchUsers(1, pagination.per_page);
  };

  const fetchUsers = async (page: number = 1, perPage: number = 10) => {
    setLoading(true);
    try {
      // Build query parameters
      const params: any = {
        page,
        per_page: perPage,
      };

      // Add search if present
      if (search.trim()) {
        params.search = search.trim();
      }

      // Add role filter if selected
      if (filters.role) {
        params.role = filters.role;
      }

      // Add status filter if selected
      if (filters.status) {
        params.status = filters.status;
      }

      // Add date filters if present
      if (filters.created_from) {
        params.created_from = filters.created_from;
      }
      if (filters.created_to) {
        params.created_to = filters.created_to;
      }

      const res = await usersService.getAll(params);
      const usersData = res.data?.data?.data || [];
      const total = res.data?.data?.total || 0;
      const lastPage = res.data?.data?.last_page || 1;

      setUsers(usersData);
      setPagination({
        page: page - 1, // Convert to 0-based for MUI
        per_page: perPage,
        last_page: lastPage,
        total: total,
      });
      setError(false);
    } catch (err: any) {
      setError(true);
      toast.error(err.response?.data?.data?.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Refetch users when search or filters change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1, pagination.per_page);
    }, 500); // Debounce search by 500ms

    return () => clearTimeout(delayDebounceFn);
  }, [search, filters.role, filters.status, filters.created_from, filters.created_to]);

  return (
    <Box sx={{ p: 1, backgroundColor: '#f5f5f5', minHeight: '10vh', mt: -16 }}>
      {/* Header Section */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e3c72' }}>
            User Management
          </Typography>
          {/* <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              '&:hover': { backgroundColor: '#1565c0' },
            }}
            >
            Create User
          </Button> */}
        </Box>
      </Paper>

      {/* Stats Section */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        {/* Summary Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Chip
            label={`Total Users: ${pagination.total || 0}`}
            sx={{
              backgroundColor: '#1976d2',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          />
          <Chip
            label={`Active: ${users.filter(u => u.status === 'Active').length}`}
            sx={{
              backgroundColor: '#4caf50',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          />
          <Chip
            label={`Inactive: ${users.filter(u => u.status !== 'Active').length}`}
            sx={{
              backgroundColor: '#757575',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          />
        </Box>

        {/* Role Cards */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {loading ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 4,
              }}
            >
              <CircularProgress size={28} sx={{ color: '#1e3c72' }} />
              <Typography sx={{ ml: 2, color: '#555' }}>Loading users...</Typography>
            </Box>
          ) : (
            roles.map((role, index) => {
              const roleCount = users.filter(u => u.roles.some(r => r.name === role)).length;
              const colors = ['#e53935', '#ffa726', '#1976d2', '#9c27b0', '#4caf50', '#00acc1'];

              return (
                <Box
                  key={index}
                  sx={{
                    flex: '1 1 180px',
                    minWidth: 180,
                    maxWidth: 200,
                    backgroundColor: '#fff',
                    borderRadius: 2,
                    p: 2.5,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    border: '1px solid #e0e0e0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                  }}
                >
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#666' }}>
                    {role}
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        color: '#000',
                      }}
                    >
                      {roleCount}
                    </Typography>

                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '3px',
                        backgroundColor: colors[index % colors.length],
                      }}
                    />
                  </Box>
                </Box>
              );
            })
          )}
        </Box>
      </Paper>

      {/* Search Section */}
      <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'end' }}>
          <TextField
            size="small"
            placeholder="Search users by name, email, or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300, flex: 1 }}
          />

          {/* Role Filter */}
          <TextField
            size="small"
            select
            value={filters.role}
            onChange={e => setFilters({ ...filters, role: e.target.value })}
            placeholder="Role"
            SelectProps={{
              IconComponent: ArrowDropDown,
              displayEmpty: true,
              renderValue: (selected: unknown) => {
                if (selected === '' || !selected) {
                  return 'All Roles';
                }
                return selected as string;
              },
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Roles</MenuItem>
            {roles.map(role => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          {/* Status Filter */}
          <TextField
            size="small"
            select
            value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            SelectProps={{
              displayEmpty: true,
              renderValue: (selected: unknown) => {
                if (selected === '' || !selected) {
                  return <span>All Statuses</span>;
                }
                return <span>{selected as string}</span>;
              },
            }}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
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
      </Paper>

      {/* Users Table */}
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
                    fontSize: '0.85rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '0.85rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '0.85rem',
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
                    fontSize: '0.85rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  Role
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '0.85rem',
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
                    fontSize: '0.85rem',
                    py: 1.5,
                    borderRight: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  Created Date
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '0.85rem',
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
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={24} sx={{ color: '#1e3c72' }} />
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                      Loading users...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="error">
                      Error loading users. Please try again.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user: User) => (
                  <TableRow key={user.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {user.profile_photo_url ? (
                          <img
                            src={user.profile_photo_url}
                            alt={user.name}
                            style={{ width: 32, height: 32, borderRadius: '50%' }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: '#e0e0e0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 'bold',
                              color: '#666',
                            }}
                          >
                            {user.name.charAt(0)}
                          </Box>
                        )}
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {user.roles.map(r => (
                        <Chip
                          key={r.uuid}
                          label={r.name}
                          size="small"
                          sx={{ mr: 0.5, fontSize: '0.7rem' }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          backgroundColor: user.status === 'Active' ? '#e8f5e8' : '#fff3e0',
                          color: user.status === 'Active' ? '#2e7d32' : '#f57c00',
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {user.status}
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit user" arrow>
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: '#1976d2',
                              color: 'white',
                              '&:hover': { backgroundColor: '#1565c0' },
                            }}
                          >
                            <Edit size={16} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete user" arrow>
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: '#d32f2f',
                              color: 'white',
                              '&:hover': { backgroundColor: '#c62828' },
                            }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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

export default Management;
