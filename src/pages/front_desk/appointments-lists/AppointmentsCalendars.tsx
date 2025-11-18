import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  CircularProgress,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
} from '@mui/material';
import {
  Calendar,
  User,
  Clock,
  Phone,
  Mail,
  Search,
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { toast } from 'react-toastify';
import { doctorsService } from '../../../shared/api/services/Doctor.service';
import { AppointmentsService } from '../../../shared/api/services/appointments.services';
import Fallbacks from '../../../features/shared/components/Fallbacks';

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
}

interface Filters {
  page: number;
  per_page: number;
  sort_by: string;
  sort_order: string;
  department: string;
  search: string;
  gender: string;
  doctor_id: string;
  patient_category_id: string;
  dob_from: string;
  source: string;
  dob_to: string;
  age_min: string;
  age_max: string;
  created_from: string;
  created_to: string;
}

const sources = [
  { id: 'Website', name: 'Website' },
  { id: 'Call Center', name: 'Call Center' },
  { id: 'In Person', name: 'In Person' },
];

const AppointmentCalendars: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([]);

  const [filters, setFilters] = useState<Filters>({
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

  // Fetch appointments from API
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await AppointmentsService.getList(filters);
      const appointmentsData = res.data?.data?.data || res.data?.data || [];
      setAppointments(appointmentsData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const res = await doctorsService.getAll();
      const doctorsData = res.data?.data || [];
      setDoctors(doctorsData);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch doctors');
      console.error('Error fetching doctors:', err);
    }
  };

  // Clear filters
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
  };

  // Format appointments for FullCalendar
  const calendarEvents = appointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.patient_name} - ${appointment.doctor.name}`,
    start: `${appointment.appointment_date.split('T')[0]}T${appointment.time}`,
    end: calculateEndTime(appointment.appointment_date, appointment.time),
    extendedProps: {
      appointment,
    },
    color: getStatusColor(appointment.status),
  }));

  // Calculate end time (assuming 1-hour appointments)
  function calculateEndTime(date: string, startTime: string): string {
    const start = new Date(`${date.split('T')[0]}T${startTime}`);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // Add 1 hour
    return end.toISOString();
  }

  // Get color based on appointment status
  function getStatusColor(status: string): string {
    const colors = {
      Pending: '#ff9800',
      Confirmed: '#4caf50',
      Cancelled: '#f44336',
      Completed: '#2196f3',
    };
    return colors[status as keyof typeof colors] || '#757575';
  }

  // Handle date selection from calendar
  const handleDateSelect = (selectInfo: any) => {
    const selectedDate = selectInfo.startStr;
    setSelectedDate(selectedDate);
    
    // Filter appointments for selected date
    const filteredAppointments = appointments.filter(appointment => 
      appointment.appointment_date.startsWith(selectedDate)
    );
    setSelectedAppointments(filteredAppointments);
  };

  // Handle event click
  const handleEventClick = (clickInfo: any) => {
    const appointment = clickInfo.event.extendedProps.appointment;
    console.log('Appointment clicked:', appointment);
    // You can show a modal with appointment details here
  };

  // Format time for display
  const formatTime = (time: string): string => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, [filters]);

  useEffect(() => {
    // Update selected appointments when appointments change
    if (selectedDate) {
      const filteredAppointments = appointments.filter(appointment => 
        appointment.appointment_date.startsWith(selectedDate)
      );
      setSelectedAppointments(filteredAppointments);
    }
  }, [appointments, selectedDate]);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', mt: -14 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
        Appointment Calendar
      </Typography>

      {/* Search and Filter Section */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          {/* Search */}
          <Grid size={{xs:12, sm:6, md:4}}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
              Search
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search patients..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Select Consultant */}
          <Grid size={{xs:12, sm:6, md:2}}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
              Select Consultant
            </Typography>
            <TextField
              fullWidth
              size="small"
              select
              value={filters.doctor_id}
              onChange={e => setFilters({ ...filters, doctor_id: e.target.value })}
            >
              <MenuItem value="">All Doctors</MenuItem>
              {doctors.map(doctor => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Select Source */}
          <Grid size={{xs:12, sm:6, md:2}}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
              Select Source
            </Typography>
            <TextField
              fullWidth
              size="small"
              select
              value={filters.source}
              onChange={e => setFilters({ ...filters, source: e.target.value })}
            >
              <MenuItem value="">All Sources</MenuItem>
              {sources.map(source => (
                <MenuItem key={source.id} value={source.id}>
                  {source.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Gender */}
          <Grid size={{xs:12, sm:6, md:2}}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
              Gender
            </Typography>
            <TextField
              fullWidth
              size="small"
              select
              value={filters.gender}
              onChange={e => setFilters({ ...filters, gender: e.target.value })}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        {/* Second row of filters */}
        <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
          {/* Created From */}
          <Grid size={{xs:12, sm:6, md:2}}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
              Date From
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={filters.created_from}
              onChange={e => setFilters({ ...filters, created_from: e.target.value })}
            />
          </Grid>

          {/* Created To */}
          <Grid size={{xs:12, sm:6, md:2}}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#333' }}>
              Date To
            </Typography>
            <TextField
              fullWidth
              size="small"
              type="date"
              value={filters.created_to}
              onChange={e => setFilters({ ...filters, created_to: e.target.value })}
            />
          </Grid>

          {/* Clear Filters */}
          <Grid size={{xs:12, sm:6, md:2}}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2, borderColor: '#d32f2f', color: '#d32f2f' }}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3} display="flex" flexDirection='column'>
        {/* Calendar Section */}
        <Grid size={{xs:12}}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Calendar size={24} color="#4285f4" />
              <Typography variant="h6" fontWeight="600">
                Appointments Schedule
              </Typography>
            </Box>

            <Box sx={{ height: 600 }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CircularProgress />
                </Box>
              ) : (
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }}
                  editable={false}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}
                  weekends={true}
                  select={handleDateSelect}
                  eventClick={handleEventClick}
                  events={calendarEvents}
                  slotMinTime="06:00:00"
                  slotMaxTime="22:00:00"
                  allDaySlot={false}
                  nowIndicator={true}
                  scrollTime="08:00:00"
                  height="100%"
                  eventTimeFormat={{
                    hour: '2-digit',
                    minute: '2-digit',
                    meridiem: false,
                  }}
                />
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Appointments List Section */}
        <Grid size={{xs:12, md:4}}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)', height: 'fit-content' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Clock size={20} />
              {selectedDate ? `Appointments for ${formatDate(selectedDate)}` : 'Select a Date'}
            </Typography>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : selectedAppointments.length > 0 ? (
              <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                {selectedAppointments.map((appointment, index) => (
                  <React.Fragment key={appointment.id}>
                    <ListItem sx={{ alignItems: 'flex-start', mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: 2 }}>
                      <ListItemAvatar>
                        <Avatar src={appointment.doctor.user.profile_photo_url}>
                          {appointment.doctor.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                              {appointment.patient_name}
                            </Typography>
                            <Chip 
                              label={appointment.status} 
                              size="small"
                              sx={{ 
                                backgroundColor: getStatusColor(appointment.status),
                                color: 'white',
                                fontWeight: '600',
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ mt: 1 }}>
                            {/* Patient Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <User size={16} />
                              <Typography variant="body2">
                                {appointment.gender}, {appointment.age} years
                              </Typography>
                            </Box>

                            {/* Contact Info */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Phone size={16} />
                              <Typography variant="body2">{appointment.phone_number}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Mail size={16} />
                              <Typography variant="body2">{appointment.email}</Typography>
                            </Box>

                            {/* Time & Doctor */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                              <Chip 
                                icon={<Clock size={14} />}
                                label={formatTime(appointment.time)}
                                variant="outlined"
                                size="small"
                              />
                              <Typography variant="body2" color="primary" fontWeight="600">
                                Dr. {appointment.doctor.name}
                              </Typography>
                            </Box>

                            {/* Source */}
                            <Box sx={{ mt: 1 }}>
                              <Chip 
                                label={`Source: ${appointment.source}`}
                                variant="outlined"
                                size="small"
                                color="primary"
                              />
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < selectedAppointments.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <>
                {selectedDate 
                  ? <Fallbacks title='empty' description='No appointments scheduled for this date' />
                  : <Fallbacks title='empty' description='Click on a date in the calendar to view appointments' />
                }
              </>
            )}
          </Paper>

          {/* Summary Card */}
          <Card sx={{ mt: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    {appointments.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Appointments
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main" fontWeight="bold">
                    {appointments.filter(a => a.status === 'Confirmed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Confirmed
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="warning.main" fontWeight="bold">
                    {appointments.filter(a => a.status === 'Pending').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AppointmentCalendars;