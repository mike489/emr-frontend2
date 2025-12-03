import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Container,
} from '@mui/material';
import { toast } from 'react-toastify';
import { usersService } from '../../shared/api/services/users.services';
import { rolesService } from '../../shared/api/services/roles.service';
import { doctorsService, nursesService } from '../../shared/api/services/Doctor.service';

interface Role {
  uuid: string;
  name: string;
}

interface Speciality {
  uuid?: string;
  id?: string | number;
  name: string;
}

type UserType = 'User' | 'Nurse' | 'Doctor';

const Createusers: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [specialitiesLoading, setSpecialitiesLoading] = useState(true);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [availableSpecialities, setAvailableSpecialities] = useState<Speciality[]>([]);
  const [userType, setUserType] = useState<UserType>('User');
  
  // Form data for User/Nurse
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    roles: [] as string[],
    department: '',
  });

  // Form data for Doctor
  const [doctorFormData, setDoctorFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    speciality: '',
  });

  // Fetch available roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await rolesService.getAll();
        const rolesData = res.data?.data || [];
        setAvailableRoles(rolesData);
        
        // Auto-select nurse role if user type is Nurse
        if (userType === 'Nurse') {
          const nurseRole = rolesData.find((role: Role) => 
            role.name.toLowerCase() === 'nurse'
          );
          if (nurseRole) {
            setFormData(prev => ({
              ...prev,
              roles: [nurseRole.uuid],
            }));
          }
        }
      } catch (err: any) {
        toast.error('Failed to load roles');
      } finally {
        setRolesLoading(false);
      }
    };

    if (userType !== 'Doctor') {
      fetchRoles();
    }
  }, [userType]);

  // Fetch available specialities for doctors
  useEffect(() => {
    const fetchSpecialities = async () => {
      try {
        const res = await doctorsService.getSpecialities();
        // Handle both nested data structure and direct array
        const specialitiesData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setAvailableSpecialities(specialitiesData);
      } catch (err: any) {
        toast.error('Failed to load specialities');
      } finally {
        setSpecialitiesLoading(false);
      }
    };

    if (userType === 'Doctor') {
      fetchSpecialities();
    }
  }, [userType]);

  // Input Change Handler for User/Nurse
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Input Change Handler for Doctor
  const handleDoctorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctorFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Roles Change Handler
  const handleRoleChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      roles: e.target.value,
    }));
  };

  // Speciality Change Handler
  const handleSpecialityChange = (e: any) => {
    setDoctorFormData(prev => ({
      ...prev,
      speciality: e.target.value,
    }));
  };

  // Department Change Handler
  const handleDepartmentChange = (e: any) => {
    setFormData(prev => ({
      ...prev,
      department: e.target.value,
    }));
  };

  // User Type Change Handler
  const handleUserTypeChange = (e: any) => {
    const newType = e.target.value as UserType;
    setUserType(newType);
    
    // Reset forms when switching types
    setFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      roles: [],
      department: '',
    });
    setDoctorFormData({
      name: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      speciality: '',
    });
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (userType === 'Doctor') {
      // Validate doctor form
      if (!doctorFormData.name || !doctorFormData.email || !doctorFormData.username || 
          !doctorFormData.password || !doctorFormData.speciality) {
        toast.error('Please fill in all required fields');
        return;
      }

      setLoading(true);
      try {
        await doctorsService.create(doctorFormData);
        toast.success('Doctor created successfully');
        navigate('/managment');
      } catch (err: any) {
        toast.error(err.response?.data?.data?.message || 'Failed to create doctor');
      } finally {
        setLoading(false);
      }
    } else if (userType === 'Nurse') {
      // Validate nurse form
      if (!formData.name || !formData.email || !formData.username || !formData.password) {
        toast.error('Please fill in all required fields');
        return;
      }

      setLoading(true);
      try {
        // Exclude department from payload
        const { department, ...nursePayload } = formData;
        await nursesService.create(nursePayload);
        toast.success('Nurse created successfully');
        navigate('/managment');
      } catch (err: any) {
        toast.error(err.response?.data?.data?.message || 'Failed to create nurse');
      } finally {
        setLoading(false);
      }
    } else {
      // Validate user form
      if (!formData.name || !formData.email || !formData.username || !formData.password) {
        toast.error('Please fill in all required fields');
        return;
      }

      setLoading(true);
      try {
        // Exclude department from payload
        const { department, ...userPayload } = formData;
        await usersService.create(userPayload);
        toast.success('User created successfully');
        navigate('/managment');
      } catch (err: any) {
        toast.error(err.response?.data?.data?.message || 'Failed to create user');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    navigate('/managment');
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#f5f7fa',
        minHeight: '100vh',
        mt: -16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="md">
        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>
            User Registration
          </Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
            Select user type and register a new {userType.toLowerCase()}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* User Type Selector */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <FormControl fullWidth size="small">
                <InputLabel>User Type</InputLabel>
                <Select
                  value={userType}
                  onChange={handleUserTypeChange}
                  label="User Type"
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="Nurse">Nurse</MenuItem>
                  <MenuItem value="Doctor">Doctor</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="caption" sx={{ color: '#7f8c8d', mt: 1, display: 'block' }}>
                Select the type of user you want to create
              </Typography>
            </Paper>

            {/* Doctor Form */}
            {userType === 'Doctor' && (
              <>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4 }}>
                    {/* Left Column */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 3,
                          fontSize: '1rem',
                        }}
                      >
                        Personal Information
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                          label="Full Name"
                          name="name"
                          value={doctorFormData.name}
                          onChange={handleDoctorInputChange}
                          fullWidth
                          required
                          size="small"
                          placeholder="Enter full name"
                        />

                        <TextField
                          label="Username"
                          name="username"
                          value={doctorFormData.username}
                          onChange={handleDoctorInputChange}
                          fullWidth
                          required
                          size="small"
                          placeholder="Enter username"
                        />

                        <TextField
                          label="Password"
                          name="password"
                          type="password"
                          value={doctorFormData.password}
                          onChange={handleDoctorInputChange}
                          fullWidth
                          required
                          size="small"
                          placeholder="Enter password"
                        />
                      </Box>
                    </Box>

                    {/* Right Column */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 3,
                          fontSize: '1rem',
                        }}
                      >
                        Contact & Specialty
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                          label="Email"
                          name="email"
                          type="email"
                          value={doctorFormData.email}
                          onChange={handleDoctorInputChange}
                          fullWidth
                          required
                          size="small"
                          placeholder="Enter email"
                        />

                        <TextField
                          label="Phone"
                          name="phone"
                          value={doctorFormData.phone}
                          onChange={handleDoctorInputChange}
                          fullWidth
                          size="small"
                          placeholder="Enter phone number"
                        />

                        <FormControl fullWidth size="small" required disabled={specialitiesLoading}>
                          <InputLabel>Specialty</InputLabel>
                          <Select
                            value={doctorFormData.speciality}
                            onChange={handleSpecialityChange}
                            label="Specialty"
                          >
                            {availableSpecialities.map((speciality) => {
                              const value = speciality.uuid || speciality.id;
                              return (
                                <MenuItem key={value} value={value}>
                                  {speciality.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </>
            )}

            {/* User/Nurse Form */}
            {(userType === 'User' || userType === 'Nurse') && (
              <>
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4 }}>
                    {/* Left Column */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 3,
                          fontSize: '1rem',
                        }}
                      >
                        Personal Information
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                          label="Full Name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          size="small"
                          placeholder="Enter full name"
                        />

                        <TextField
                          label="Username"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          size="small"
                          placeholder="Enter username"
                        />

                        <TextField
                          label="Password"
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          size="small"
                          placeholder="Enter password"
                        />
                      </Box>
                    </Box>

                    {/* Right Column */}
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: '#2c3e50',
                          mb: 3,
                          fontSize: '1rem',
                        }}
                      >
                        Contact Information
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        <TextField
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          fullWidth
                          required
                          size="small"
                          placeholder="Enter email"
                        />

                        <TextField
                          label="Phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          fullWidth
                          size="small"
                          placeholder="Enter phone number"
                        />

                        {/* Department Dropdown for Nurses */}
                        {userType === 'Nurse' && (
                          <FormControl fullWidth size="small">
                            <InputLabel>Department</InputLabel>
                            <Select
                              value={formData.department}
                              onChange={handleDepartmentChange}
                              label="Department"
                            >
                              <MenuItem value="triage1">Triage 1</MenuItem>
                              <MenuItem value="triage2">Triage 2</MenuItem>
                              <MenuItem value="triage3">Triage 3</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* Roles */}
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: '#2c3e50',
                      mb: 3,
                      fontSize: '1rem',
                    }}
                  >
                    Roles & Access
                  </Typography>

                  <FormControl fullWidth size="small" disabled={rolesLoading || userType === 'Nurse'}>
                    <InputLabel>User Roles</InputLabel>
                    <Select
                      multiple
                      value={formData.roles}
                      onChange={handleRoleChange}
                      label="User Roles"
                      renderValue={selected => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map(uuid => {
                            const role = availableRoles.find(r => r.uuid === uuid);
                            return (
                              <Chip key={uuid} label={role?.name || uuid} size="small" />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {availableRoles
                        .filter(role => {
                          // Filter out Doctor and Nurse roles for standard User type
                          if (userType === 'User') {
                            const roleName = role.name.toLowerCase();
                            return roleName !== 'doctor' && roleName !== 'nurse';
                          }
                          return true;
                        })
                        .map(role => (
                          <MenuItem key={role.uuid} value={role.uuid}>
                            {role.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>

                  <Typography variant="caption" sx={{ color: '#7f8c8d', mt: 1, display: 'block' }}>
                    {userType === 'Nurse' 
                      ? 'Nurse role is automatically assigned' 
                      : 'Select one or more roles for this user'}
                  </Typography>
                </Paper>
              </>
            )}

            {/* Buttons */}
            <Paper
              sx={{
                p: 3,
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#2980b9',
                    },
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
                      Saving...
                    </>
                  ) : (
                    `Save ${userType}`
                  )}
                </Button>

                <Button
                  variant="contained"
                  onClick={handleCancel}
                  disabled={loading}
                  sx={{
                    backgroundColor: '#27ae60',
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: '#229954',
                    },
                  }}
                >
                  Cancel
                </Button>
              </Box>
            </Paper>
          </Box>
        </form>
      </Container>
    </Box>
  );
};

export default Createusers;
