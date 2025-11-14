import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  MenuItem,
  Button,
  Grid,
  Divider,
  InputAdornment,
} from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import AppLayout from '../../layouts/AppLayout';
import { PatientService } from '../../shared/api/services/patient.service';
import { toast } from 'react-toastify';
import { PatientCategoryService } from '../../shared/api/services/patientCatagory.service';
import { FRONT_DESK_TABS } from '../../data/data';

const PatientRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    // Personal Information
    title: '',
    full_name: '',
    date_of_birth: '',
    gender: '',
    phone: '',
    email: '',
    occupation: '',
    marital_status: '',
    religion: '',
    education: '',
    blood_type: '',
    height: '',
    weight: '',
    national_id: '',
    passport_number: '',

    // Address (must be an object with specific fields)
    address: {
      city: '',
      kifle_ketema: '',
      wereda: '',
    },

    // Medical Information
    medical_history: [] as string[],
    allergies: [] as string[],
    medical_conditions: [] as string[],

    // Required fields from errors
    patient_category_id: '',
    referral_doctor_name: '',
    payment_method: '',
    visit_type: '',
    appointed_to: '',
    department: '',
    doctor: '',
  });
  const [patientCategories, setPatientCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [_total, setTotal] = useState(0);

  // Fetch patient categories on component mount
  useEffect(() => {
    fetchPatientCategories();
  }, []);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  // const handleArrayInputChange =
  //   (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const value = event.target.value;
  //     const arrayValue = value
  //       .split(',')
  //       .map(item => item.trim())
  //       .filter(item => item);
  //     setFormData(prev => ({
  //       ...prev,
  //       [field]: arrayValue,
  //     }));
  //   };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digits

    // Ensure it starts with 251 and is exactly 12 digits
    if (!value.startsWith('251')) {
      value = '251' + value.replace(/^251/, '');
    }

    // Limit to 12 digits total
    value = value.substring(0, 12);

    setFormData(prev => ({
      ...prev,
      phone: value,
    }));
  };

  const handleNationalIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digits
    value = value.substring(0, 16); // Limit to 16 characters

    setFormData(prev => ({
      ...prev,
      national_id: value,
    }));
  };

  // Options for dropdowns
  const titles = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'N/A'];
  // const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed', 'N/A'];
  // const religions = ['Christian', 'Muslim', 'Jewish', 'Hindu', 'Buddhist', 'Other', 'N/A'];
  // const educationLevels = [
  //   'None',
  //   'Primary',
  //   'Secondary',
  //   'Diploma',
  //   'Bachelor',
  //   'Master',
  //   'PhD',
  //   'N/A',
  // ];
  const genders = ['Male', 'Female'];
  // const paymentMethods = ['Cash', 'Insurance', 'Card', 'Mobile'];
  const visitTypes = ['New', 'Follow-up', 'Emergency', 'Review'];

  const cities = ['Addis Ababa', 'Dire Dawa', 'Hawassa', 'Bahir Dar', 'Mekelle', 'Jimma'];
  const kifleKetemas = ['Kirkos', 'Arada', 'Bole', 'Lideta', 'Yeka', 'Nifas Silk'];
  const weredas = ['Wereda 01', 'Wereda 02', 'Wereda 03', 'Wereda 04', 'Wereda 05'];

  function navigateToPreviousPage() {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  }

  const validateForm = () => {
    const errors = [];

    // Only validate required fields: full_name and email
    if (!formData.full_name.trim()) {
      errors.push('Full name is required');
    }

    if (!formData.email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Email must be a valid email address');
    }

    return errors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      toast.error(`Please fix the following errors: ${validationErrors.join(', ')}`);
      return;
    }

    try {
      // Prepare data for backend with proper formatting - all fields optional except full_name and email
      const submitData = {
        title: formData.title || null,
        full_name: formData.full_name, // Required
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        phone: formData.phone || null,
        email: formData.email, // Required
        occupation: formData.occupation || null,
        marital_status: formData.marital_status || null,
        religion: formData.religion || null,
        education: formData.education || null,
        blood_type: formData.blood_type || null,
        height: formData.height || null,
        weight: formData.weight || null,
        national_id: formData.national_id || null,
        passport_number: formData.passport_number || null,
        address:
          formData.address.city || formData.address.kifle_ketema || formData.address.wereda
            ? formData.address
            : null, // Send null if all address fields are empty
        medical_history: formData.medical_history.length > 0 ? formData.medical_history : null,
        allergies: formData.allergies.length > 0 ? formData.allergies : null,
        medical_conditions:
          formData.medical_conditions.length > 0 ? formData.medical_conditions : null,
        patient_category_id: formData.patient_category_id || null,
        referral_doctor_name: formData.referral_doctor_name || null,
        payment_method: formData.payment_method || null,
        visit_type: formData.visit_type || null,
        appointed_to: formData.appointed_to || null,
        department: formData.department || null,
        doctor: formData.doctor || null,
      };

      await PatientService.create(submitData);
      toast.success('Patient registered successfully!');
      resetForm();
    } catch (err: any) {
      console.log('Error details:', err);
      const errorMessage =
        err.response?.data?.data?.message ||
        err.response?.data?.message ||
        'Failed to register patient';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      full_name: '',
      date_of_birth: '',
      gender: '',
      phone: '',
      email: '',
      occupation: '',
      marital_status: '',
      religion: '',
      education: '',
      blood_type: '',
      height: '',
      weight: '',
      national_id: '',
      passport_number: '',
      address: {
        city: '',
        kifle_ketema: '',
        wereda: '',
      },
      medical_history: [],
      allergies: [],
      medical_conditions: [],
      patient_category_id: '',
      referral_doctor_name: '',
      payment_method: '',
      visit_type: '',
      appointed_to: '',
      department: '',
      doctor: '',
    });
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

  return (
    <AppLayout tabsData={FRONT_DESK_TABS}>
      {/* <TabBar tabsData={FRONT_DESK_TABS}/> */}
      <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', mt: -10 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          Patient Registration
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
          Register a new patient - Only Name and Email are required
        </Typography>

        <Grid container spacing={3}>
          {/* Left Column - Personal & Contact Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Personal Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Title"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                  >
                    {titles.map(title => (
                      <MenuItem key={title} value={title}>
                        {title}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Full Name *"
                    value={formData.full_name}
                    onChange={handleInputChange('full_name')}
                    required
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControl component="fieldset">
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup row value={formData.gender} onChange={handleInputChange('gender')}>
                      {genders.map(gender => (
                        <FormControlLabel
                          key={gender}
                          value={gender}
                          control={<Radio />}
                          label={gender.charAt(0).toUpperCase() + gender.slice(1)}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    label="Date of Birth"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date_of_birth}
                    onChange={handleInputChange('date_of_birth')}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarToday fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Marital Status"
                    value={formData.marital_status}
                    onChange={handleInputChange('marital_status')}
                  >
                    {maritalStatuses.map(status => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid> */}

                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Religion"
                    value={formData.religion}
                    onChange={handleInputChange('religion')}
                  >
                    {religions.map(religion => (
                      <MenuItem key={religion} value={religion}>
                        {religion}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid> */}

                {/* <Grid size={{ xs: 12 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Education"
                    value={formData.education}
                    onChange={handleInputChange('education')}
                  >
                    {educationLevels.map(level => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid> */}

                {/* <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Occupation"
                    value={formData.occupation}
                    onChange={handleInputChange('occupation')}
                  />
                </Grid> */}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Height (cm)"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange('height')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Weight (kg)"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange('weight')}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Blood Type"
                    value={formData.blood_type}
                    onChange={handleInputChange('blood_type')}
                  >
                    {bloodTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Contact Information */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
                    Contact Information
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email *"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    error={
                      formData.email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                    }
                    helperText={
                      formData.email !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                        ? 'Invalid email format'
                        : 'Required field'
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    inputProps={{ maxLength: 12 }}
                    helperText={`Format: 251XXXXXXXXX (12 digits total). Current: ${formData.phone.length}/12`}
                    error={
                      formData.phone !== '' &&
                      (formData.phone.length !== 12 || !formData.phone.startsWith('251'))
                    }
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Right Column - Address, Medical & Appointment Information */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Address & Identification
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="City"
                    value={formData.address.city}
                    onChange={handleAddressChange('city')}
                  >
                    {cities.map(city => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Sub-City"
                    value={formData.address.kifle_ketema}
                    onChange={handleAddressChange('kifle_ketema')}
                  >
                    {kifleKetemas.map(kk => (
                      <MenuItem key={kk} value={kk}>
                        {kk}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Wereda"
                    value={formData.address.wereda}
                    onChange={handleAddressChange('wereda')}
                  >
                    {weredas.map(wereda => (
                      <MenuItem key={wereda} value={wereda}>
                        {wereda}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="National ID"
                    value={formData.national_id}
                    onChange={handleNationalIdChange}
                    inputProps={{ maxLength: 16 }}
                    helperText={`Must be 16 digits. Current: ${formData.national_id.length}/16`}
                    error={formData.national_id !== '' && formData.national_id.length !== 16}
                  />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Passport Number"
                    value={formData.passport_number}
                    onChange={handleInputChange('passport_number')}
                  />
                </Grid>

                {/* <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Referral Doctor Name"
                    value={formData.referral_doctor_name}
                    onChange={handleInputChange('referral_doctor_name')}
                  />
                </Grid> */}
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Other Information
              </Typography>

              <Grid container spacing={2}>
                {/* <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Payment Method"
                    value={formData.payment_method}
                    onChange={handleInputChange('payment_method')}
                  >
                    {paymentMethods.map(method => (
                      <MenuItem key={method} value={method}>
                        {method}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid> */}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Visit Type"
                    value={formData.visit_type}
                    onChange={handleInputChange('visit_type')}
                  >
                    {visitTypes.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Appointed To"
                    value={formData.appointed_to}
                    onChange={handleInputChange('appointed_to')}
                  />
                </Grid> */}

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    select
                    fullWidth
                    size="small"
                    label="Patient Category"
                    value={formData.patient_category_id}
                    onChange={handleInputChange('patient_category_id')}
                    disabled={loading}
                  >
                    {loading ? (
                      <MenuItem disabled>Loading categories...</MenuItem>
                    ) : error ? (
                      <MenuItem disabled>Error loading categories</MenuItem>
                    ) : (
                      patientCategories.map(category => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Medical Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Medical History (comma separated)"
                    placeholder="Condition 1, Condition 2, ..."
                    value={formData.medical_history.join(', ')}
                    onChange={handleArrayInputChange('medical_history')}
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Allergies (comma separated)"
                    placeholder="Allergy 1, Allergy 2, ..."
                    value={formData.allergies.join(', ')}
                    onChange={handleArrayInputChange('allergies')}
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Medical Conditions (comma separated)"
                    placeholder="Condition 1, Condition 2, ..."
                    value={formData.medical_conditions.join(', ')}
                    onChange={handleArrayInputChange('medical_conditions')}
                    multiline
                    rows={2}
                  />
                </Grid>
              </Grid> */}

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Save Patient
                </Button>
                <Button variant="outlined" color="secondary" onClick={resetForm}>
                  Reset
                </Button>
                <Button variant="contained" color="success" onClick={navigateToPreviousPage}>
                  Cancel
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AppLayout>
  );
};

export default PatientRegistration;
