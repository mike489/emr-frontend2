import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  InputAdornment,
} from '@mui/material';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Clock,
  User,
  Save,
  X,
  Repeat,
} from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { doctorsService } from '../../../shared/api/services/Doctor.service';
import { toast } from 'react-toastify';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization?: string;
}

interface TimeSlot {
  id?: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  appointment_type?: 'in-person' | 'video' | 'phone';
  max_patients?: number;
  notes?: string;
  title?: string;
}

interface Availability {
  id: string;
  doctor_id: string;
  date: string;
  time_slots: TimeSlot[];
  created_at: string;
  updated_at: string;
}

const DoctorAvailability: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [_timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [_selectedAvailability, setSelectedAvailability] = useState<Availability | null>(null);
  const [editingTimeSlots, setEditingTimeSlots] = useState<TimeSlot[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  // New time slot state with Google Calendar fields
  const [newTimeSlot, setNewTimeSlot] = useState({
    title: 'Available Appointment',
    type: 'appointment',
    date: '',
    start_time: '',
    end_time: '',
    all_day: false,
    repeat: 'none',
    guests: '',
    video_conferencing: false,
    location: '',
    description: '',
    notify: true,
    notify_time: '5pm',
    appointment_type: 'in-person' as 'in-person' | 'video' | 'phone',
    max_patients: 1,
    notes: '',
    is_available: true,
  });

  const repeatOptions = [
    { value: 'none', label: 'Does not repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekdays', label: 'Every weekday (Monday to Friday)' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'custom', label: 'Custom...' },
  ];

  
  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const response = await doctorsService.getAll();
      setDoctors(response.data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    }
  };

  // Fetch availability for selected doctor and date
  const fetchAvailability = async (doctorId: string, date: string) => {
    setLoading(true);
    try {
      const response = await doctorsService.getAvailability(doctorId, date);
      if (response.data?.data) {
        setAvailabilities(prev => {
          const existing = prev.filter(a => !(a.doctor_id === doctorId && a.date === date));
          return [...existing, response.data.data];
        });
        setEditingTimeSlots(response.data.data.time_slots || []);
      } else {
        setEditingTimeSlots([]);
      }
    } catch (error) {
      setEditingTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch time slots for all doctors on a date
  const fetchTimeSlots = async (date: string) => {
    try {
      const response = await doctorsService.getTimeSlots(date);
      setTimeSlots(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  // Create new availability
  const handleCreateAvailability = async () => {
    if (!selectedDoctor || !selectedDate) {
      toast.error('Please select a doctor and date');
      return;
    }

    setLoading(true);
    try {
      await doctorsService.createAvailability(selectedDoctor.id, selectedDate, editingTimeSlots);
      toast.success('Availability created successfully');
      await fetchAvailability(selectedDoctor.id, selectedDate);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create availability');
      console.error('Error creating availability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update existing availability
  const handleUpdateAvailability = async () => {
    if (!selectedDoctor || !selectedDate) {
      toast.error('Please select a doctor and date');
      return;
    }

    setLoading(true);
    try {
      await doctorsService.updateAvailability(selectedDoctor.id, selectedDate, editingTimeSlots);
      toast.success('Availability updated successfully');
      await fetchAvailability(selectedDoctor.id, selectedDate);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update availability');
      console.error('Error updating availability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete availability
  const handleDeleteAvailability = async () => {
    if (!selectedDoctor || !selectedDate) {
      toast.error('Please select a doctor and date');
      return;
    }

    setLoading(true);
    try {
      await doctorsService.deleteAvailability(selectedDoctor.id, selectedDate);
      toast.success('Availability deleted successfully');
      setAvailabilities(prev => 
        prev.filter(a => !(a.doctor_id === selectedDoctor.id && a.date === selectedDate))
      );
      setEditingTimeSlots([]);
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete availability');
      console.error('Error deleting availability:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add time slot to editing list
  const addTimeSlot = () => {
    if (!newTimeSlot.start_time || !newTimeSlot.end_time) {
      toast.error('Please fill both start and end time');
      return;
    }

    if (newTimeSlot.start_time >= newTimeSlot.end_time) {
      toast.error('End time must be after start time');
      return;
    }

    const slot: TimeSlot = {
      id: Date.now().toString(),
      start_time: newTimeSlot.start_time,
      end_time: newTimeSlot.end_time,
      is_available: newTimeSlot.is_available,
      appointment_type: newTimeSlot.appointment_type,
      max_patients: newTimeSlot.max_patients,
      notes: newTimeSlot.description,
      title: newTimeSlot.title,
    };

    setEditingTimeSlots(prev => [...prev, slot]);
    
    // Reset form
    setNewTimeSlot({
      title: 'Available Appointment',
      type: 'appointment',
      date: selectedDate,
      start_time: '',
      end_time: '',
      all_day: false,
      repeat: 'none',
      guests: '',
      video_conferencing: false,
      location: '',
      description: '',
      notify: true,
      notify_time: '5pm',
      appointment_type: 'in-person',
      max_patients: 1,
      notes: '',
      is_available: true,
    });
    
    setSlotDialogOpen(false);
    setIsEditing(true);
  };

  // Remove time slot from editing list
  const removeTimeSlot = (index: number) => {
    setEditingTimeSlots(prev => prev.filter((_, i) => i !== index));
    setIsEditing(true);
  };

  // Calendar event handlers
  const handleDateSelect = (selectInfo: any) => {
    const date = selectInfo.startStr.split('T')[0];
    setSelectedDate(date);
    setNewTimeSlot(prev => ({ ...prev, date }));
    if (selectedDoctor) {
      fetchAvailability(selectedDoctor.id, date);
    }
    fetchTimeSlots(date);
    setIsEditing(false);
  };

  const handleEventClick = (clickInfo: any) => {
    const availability = availabilities.find(a => a.id === clickInfo.event.id);
    setSelectedAvailability(availability || null);
  };

  // Open slot dialog with current date
  const handleOpenSlotDialog = () => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }
    setNewTimeSlot(prev => ({ ...prev, date: selectedDate }));
    setSlotDialogOpen(true);
  };

  // Check if availability exists for selected doctor and date
  const currentAvailability = availabilities.find(
    a => a.doctor_id === selectedDoctor?.id && a.date === selectedDate
  );

  const hasAvailability = currentAvailability && currentAvailability.time_slots.length > 0;

  // Initialize
  useEffect(() => {
    fetchDoctors();
  }, []);

  // Update newTimeSlot date when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      setNewTimeSlot(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  // Calendar events for FullCalendar
  const calendarEvents = availabilities.flatMap(availability =>
    availability.time_slots.map(slot => ({
      id: `${availability.id}-${slot.id}`,
      title: slot.title || `Available - ${slot.appointment_type}`,
      start: `${availability.date}T${slot.start_time}`,
      end: `${availability.date}T${slot.end_time}`,
      color: 
        slot.appointment_type === 'video' ? '#4285f4' :
        slot.appointment_type === 'phone' ? '#34a853' : '#ea4335',
      extendedProps: {
        type: slot.appointment_type,
        maxPatients: slot.max_patients,
        notes: slot.notes,
      },
    }))
  );

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', mt: -14 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
        Doctor Availability
      </Typography>

      {/* Doctor Selection */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Select Doctor"
              value={selectedDoctor?.id || ''}
              onChange={(e) => {
                const doctor = doctors.find(d => d.id === e.target.value);
                setSelectedDoctor(doctor || null);
                setSelectedDate('');
                setEditingTimeSlots([]);
                setIsEditing(false);
              }}
              InputProps={{
                startAdornment: <User size={20} style={{ marginRight: 8, color: '#666' }} />,
              }}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">Select a doctor</MenuItem>
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.name} {doctor.specialization && `- ${doctor.specialization}`}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {selectedDoctor && (
        <>
          {/* Calendar Section - Google Calendar Style */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                <Calendar size={24} color="#4285f4" />
                {selectedDoctor.name}'s Schedule
              </Typography>
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={handleOpenSlotDialog}
                sx={{
                  backgroundColor: '#4285f4',
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: '#3367d6',
                  },
                }}
              >
                Create Time Slot
              </Button>
            </Box>

            <Box sx={{ height: 600 }}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                editable={true}
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
            </Box>
          </Paper>

          {/* Selected Date Management */}
          {selectedDate && (
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                  <Clock size={20} color="#4285f4" />
                  Managing {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {hasAvailability && (
                    <>
                      <Button
                        variant="outlined"
                        startIcon={<Edit size={16} />}
                        onClick={() => setIsEditing(true)}
                        disabled={isEditing}
                        sx={{ borderRadius: 2 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Trash2 size={16} />}
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={loading}
                        sx={{ borderRadius: 2 }}
                      >
                        Delete All
                      </Button>
                    </>
                  )}
                  
                  {isEditing && (
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<Save size={16} />}
                      onClick={hasAvailability ? handleUpdateAvailability : handleCreateAvailability}
                      disabled={loading || editingTimeSlots.length === 0}
                      sx={{ borderRadius: 2 }}
                    >
                      {loading ? <CircularProgress size={16} /> : 'Save Changes'}
                    </Button>
                  )}
                  
                  {isEditing && (
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        if (currentAvailability) {
                          setEditingTimeSlots(currentAvailability.time_slots);
                        } else {
                          setEditingTimeSlots([]);
                        }
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {/* Current Time Slots */}
                  <Grid  size={{ xs: 12, md: 8 }}>
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          {isEditing ? 'Editing Time Slots' : 'Scheduled Time Slots'}
                        </Typography>
                        
                        {editingTimeSlots.length > 0 ? (
                          <List>
                            {editingTimeSlots.map((slot, index) => (
                              <React.Fragment key={index}>
                                <ListItem sx={{ 
                                  borderRadius: 2, 
                                  mb: 1,
                                  backgroundColor: '#f8f9fa',
                                  border: '1px solid #e9ecef',
                                }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                                    <Box sx={{ 
                                      width: 8, 
                                      height: 40, 
                                      borderRadius: 1,
                                      backgroundColor: 
                                        slot.appointment_type === 'video' ? '#4285f4' :
                                        slot.appointment_type === 'phone' ? '#34a853' : '#ea4335',
                                    }} />
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="subtitle1" fontWeight="600">
                                        {slot.title}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {slot.start_time} - {slot.end_time}
                                      </Typography>
                                      <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                        <Chip 
                                          label={slot.appointment_type} 
                                          size="small"
                                          variant="outlined"
                                        />
                                        <Chip 
                                          label={`${slot.max_patients} patient(s)`}
                                          size="small"
                                          variant="outlined"
                                        />
                                      </Box>
                                      {slot.notes && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                          {slot.notes}
                                        </Typography>
                                      )}
                                    </Box>
                                  </Box>
                                  {isEditing && (
                                    <ListItemSecondaryAction>
                                      <IconButton
                                        edge="end"
                                        color="error"
                                        onClick={() => removeTimeSlot(index)}
                                      >
                                        <X size={16} />
                                      </IconButton>
                                    </ListItemSecondaryAction>
                                  )}
                                </ListItem>
                                {index < editingTimeSlots.length - 1 && <Divider />}
                              </React.Fragment>
                            ))}
                          </List>
                        ) : (
                          <Alert severity="info" sx={{ borderRadius: 2 }}>
                            No time slots scheduled for this date.
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Quick Actions */}
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          Quick Actions
                        </Typography>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Plus size={16} />}
                          onClick={handleOpenSlotDialog}
                          sx={{ mb: 1, borderRadius: 2, justifyContent: 'flex-start' }}
                        >
                          Add Time Slot
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={<Clock size={16} />}
                          onClick={() => {
                            // Add quick time slots
                            const quickSlots: TimeSlot[] = [
                              { 
                                id: Date.now().toString(),
                                title: 'Morning Consultation',
                                start_time: '09:00', 
                                end_time: '10:00', 
                                is_available: true, 
                                appointment_type: 'in-person',
                                max_patients: 1 
                              },
                              { 
                                id: (Date.now() + 1).toString(),
                                title: 'Video Call',
                                start_time: '14:00', 
                                end_time: '15:00', 
                                is_available: true, 
                                appointment_type: 'video',
                                max_patients: 1 
                              },
                              { 
                                id: (Date.now() + 2).toString(),
                                title: 'Phone Consultation',
                                start_time: '16:00', 
                                end_time: '17:00', 
                                is_available: true, 
                                appointment_type: 'phone',
                                max_patients: 1 
                              },
                            ];
                            setEditingTimeSlots(prev => [...prev, ...quickSlots]);
                            setIsEditing(true);
                          }}
                          sx={{ borderRadius: 2, justifyContent: 'flex-start' }}
                        >
                          Add Common Slots
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Paper>
          )}
        </>
      )}

      {/* Google Calendar Style Slot Dialog */}
     <Dialog 
  open={slotDialogOpen} 
  onClose={() => setSlotDialogOpen(false)} 
  maxWidth="sm" 
  fullWidth
  PaperProps={{ 
    sx: { 
      borderRadius: 2,
      maxWidth: 600,
    } 
  }}
>
  <DialogTitle sx={{ p: 0 }}>
    <Box sx={{ p: 3, pb: 2 }}>
      <TextField
        fullWidth
        variant="standard"
        placeholder="Add title"
        value={newTimeSlot.title}
        onChange={(e) => setNewTimeSlot(prev => ({ ...prev, title: e.target.value }))}
        InputProps={{
          disableUnderline: true,
          sx: { 
            fontSize: '22px',
            fontWeight: 400,
            '& input::placeholder': {
              color: '#3c4043',
              opacity: 1,
            }
          }
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <Clock size={16} color="#5f6368" />
        <Typography variant="body2" color="#5f6368">
          {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          }) : 'Select date'}
        </Typography>
      </Box>
    </Box>
  </DialogTitle>

  <DialogContent sx={{ p: 0, borderRadius: 0 }}>
    {/* Date Selection */}
    <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}>
      <TextField
        fullWidth
        type="date"
        label="Date"
        value={selectedDate || ''}
        onChange={(e) => {
          setSelectedDate(e.target.value);
          setNewTimeSlot(prev => ({ ...prev, date: e.target.value }));
        }}
        InputProps={{
          sx: { borderRadius: 1 }
        }}
      />
    </Box>

    {/* Time Slots Section */}
    <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="500">
          Time Slots
        </Typography>
        <Button
          startIcon={<Plus size={16} />}
          onClick={() => {
            // Add current time slot to the list and reset for new entry
            if (newTimeSlot.start_time && newTimeSlot.end_time) {
              const slot: TimeSlot = {
                id: Date.now().toString(),
                start_time: newTimeSlot.start_time,
                end_time: newTimeSlot.end_time,
                is_available: true,
                appointment_type: 'in-person',
                max_patients: 1,
                notes: '',
                title: newTimeSlot.title,
              };
              setEditingTimeSlots(prev => [...prev, slot]);
              
              // Reset time fields for next slot
              setNewTimeSlot(prev => ({
                ...prev,
                start_time: '',
                end_time: ''
              }));
            }
          }}
          disabled={!newTimeSlot.start_time || !newTimeSlot.end_time}
          sx={{ 
            borderRadius: 1,
            textTransform: 'none'
          }}
        >
          Add Another Slot
        </Button>
      </Box>

      {/* Current Time Slot Input */}
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            type="time"
            label="Start time"
            value={newTimeSlot.start_time}
            onChange={(e) => setNewTimeSlot(prev => ({ ...prev, start_time: e.target.value }))}
            InputProps={{
              sx: { borderRadius: 1 }
            }}
          />
        </Grid>
        <Grid size={{ xs: 6 }}>
          <TextField
            fullWidth
            type="time"
            label="End time"
            value={newTimeSlot.end_time}
            onChange={(e) => setNewTimeSlot(prev => ({ ...prev, end_time: e.target.value }))}
            InputProps={{
              sx: { borderRadius: 1 }
            }}
          />
        </Grid>
      </Grid>

      {/* Display Added Time Slots */}
      {editingTimeSlots.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Added slots:
          </Typography>
          <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
            {editingTimeSlots.map((slot, index) => (
              <ListItem 
                key={slot.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => {
                      setEditingTimeSlots(prev => prev.filter((_, i) => i !== index));
                    }}
                  >
                    <X size={16} />
                  </IconButton>
                }
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  mb: 1,
                  py: 1
                }}
              >
                <ListItemText
                  primary={`${slot.start_time} - ${slot.end_time}`}
                  secondary={slot.title}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>

    {/* Repeat Options */}
    <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}>
      <TextField
        fullWidth
        select
        label="Repeat"
        value={newTimeSlot.repeat}
        onChange={(e) => setNewTimeSlot(prev => ({ ...prev, repeat: e.target.value }))}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Repeat size={16} color="#5f6368" />
            </InputAdornment>
          ),
          sx: { borderRadius: 1 }
        }}
      >
        {repeatOptions.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  </DialogContent>

  <DialogActions sx={{ 
    p: 2, 
    borderTop: '1px solid #e0e0e0',
    justifyContent: 'space-between'
  }}>
    <Box sx={{ display: 'flex', gap: 1 }}>
      <Button 
        onClick={() => {
          setSlotDialogOpen(false);
          setEditingTimeSlots([]); // Clear added slots when canceling
        }}
        sx={{ borderRadius: 2, px: 3 }}
      >
        Cancel
      </Button>
      <Button 
        variant="contained"
        onClick={() => {
          // Add the current time slot if filled, then save all
          if (newTimeSlot.start_time && newTimeSlot.end_time) {
            const slot: TimeSlot = {
              id: Date.now().toString(),
              start_time: newTimeSlot.start_time,
              end_time: newTimeSlot.end_time,
              is_available: true,
              appointment_type: 'in-person',
              max_patients: 1,
              notes: '',
              title: newTimeSlot.title,
            };
            setEditingTimeSlots(prev => [...prev, slot]);
          }
          
          // Now save all slots
          addTimeSlot();
        }}
        disabled={editingTimeSlots.length === 0 && (!newTimeSlot.start_time || !newTimeSlot.end_time)}
        sx={{ 
          borderRadius: 2,
          px: 3,
          backgroundColor: '#1a73e8',
          '&:hover': {
            backgroundColor: '#1669d6',
          }
        }}
      >
        Save All Slots
      </Button>
    </Box>
  </DialogActions>
</Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle>Delete All Time Slots</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all time slots for {new Date(selectedDate).toLocaleDateString()}?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteAvailability} 
            color="error" 
            variant="contained"
            disabled={loading}
            sx={{ borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={16} /> : 'Delete All'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorAvailability;