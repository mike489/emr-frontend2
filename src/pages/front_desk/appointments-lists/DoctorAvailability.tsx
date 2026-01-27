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
  FormControlLabel,
  Checkbox,
  FormGroup,
} from '@mui/material';
import { Calendar, Plus, Edit, Trash2, Clock, User, Save, X, Repeat } from 'lucide-react';
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

interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  type: string;
  rule_id: string;
  color: string;
}

// interface AvailabilityRule {
//   doctor_id: string;
//   frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
//   interval?: number;
//   byweekday?: string[];
//   bymonthday?: number;
//   start_time: string;
//   end_time: string;
//   enabled?: boolean;
//   count?: number;
//   until?: string;
//   title?: string;
//   appointment_type?: 'in-person' | 'video' | 'phone';
//   max_patients?: number;
// }

const DoctorAvailability: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [slotDialogOpen, setSlotDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingTimeSlots, setEditingTimeSlots] = useState<TimeSlot[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [customRepeatOpen, setCustomRepeatOpen] = useState(false);
  const [customDates, setCustomDates] = useState<string[]>([]);
  const [viewRange, setViewRange] = useState<{ start: string; end: string } | null>(null);

  const weekdays = [
    { value: 'MO', label: 'Monday' },
    { value: 'TU', label: 'Tuesday' },
    { value: 'WE', label: 'Wednesday' },
    { value: 'TH', label: 'Thursday' },
    { value: 'FR', label: 'Friday' },
    { value: 'SA', label: 'Saturday' },
    { value: 'SU', label: 'Sunday' },
  ];

  const repeatOptions = [
    { value: 'none', label: 'Does not repeat' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekdays', label: 'Every weekday (Monday to Friday)' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
    { value: 'custom', label: 'Custom...' },
  ];

  const [newTimeSlot, setNewTimeSlot] = useState({
    title: 'Available Appointment',
    start_time: '',
    end_time: '',
    repeat: 'none',
    frequency: 'DAILY' as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY',
    interval: 1,
    byweekday: [] as string[],
    bymonthday: 1,
    until: '',
    count: undefined as number | undefined,
    appointment_type: 'in-person' as 'in-person' | 'video' | 'phone',
    max_patients: 1,
    notes: '',
  });

  // Fetch doctors and set first one as default
  const fetchDoctors = async () => {
    try {
      const response = await doctorsService.getAll();
      const doctorsList = response.data?.data || [];
      setDoctors(doctorsList);

      // Set first doctor as selected by default
      if (doctorsList.length > 0 && !selectedDoctor) {
        setSelectedDoctor(doctorsList[0]);
      }
    } catch (error) {
      toast.error('Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    }
  };

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

  const fetchMonthlyCalendarAvailability = async (
    doctorId: string,
    startDate?: string,
    endDate?: string
  ) => {
    try {
      const params: any = {};
      if (startDate) params.start = startDate;
      if (endDate) params.end = endDate;

      const response = await doctorsService.getMonthlyCalendarAvailability(doctorId, params);
      setCalendarEvents(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching calendar availability:', error);
      setCalendarEvents([]);
    }
  };

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
      if (viewRange) {
        await fetchMonthlyCalendarAvailability(selectedDoctor.id, viewRange.start, viewRange.end);
      }
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create availability');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAvailabilityRule = async () => {
    if (!selectedDoctor) {
      toast.error('Please select a doctor');
      return;
    }

    if (!newTimeSlot.start_time || !newTimeSlot.end_time) {
      toast.error('Please provide start and end time');
      return;
    }

    setLoading(true);
    try {
      // Create base payload with required fields
      const payload: any = {
        doctor_id: selectedDoctor.id,
        frequency: newTimeSlot.frequency,
        start_time: newTimeSlot.start_time,
        end_time: newTimeSlot.end_time,
        title: newTimeSlot.title || 'Available Appointment',
        appointment_type: newTimeSlot.appointment_type,
        max_patients: newTimeSlot.max_patients,
      };

      // Add frequency-specific fields
      switch (newTimeSlot.frequency) {
        case 'DAILY':
          payload.interval = newTimeSlot.interval;
          if (newTimeSlot.until) payload.until = newTimeSlot.until;
          if (newTimeSlot.count) payload.count = newTimeSlot.count;
          break;

        case 'WEEKLY':
          payload.interval = newTimeSlot.interval;
          // Ensure we have weekdays selected, use default if empty
          payload.byweekday =
            newTimeSlot.byweekday.length > 0 ? newTimeSlot.byweekday : getDefaultWeekdays();
          if (newTimeSlot.until) payload.until = newTimeSlot.until;
          if (newTimeSlot.count) payload.count = newTimeSlot.count;
          break;

        case 'MONTHLY':
          payload.interval = newTimeSlot.interval;
          payload.bymonthday = newTimeSlot.bymonthday;
          if (newTimeSlot.until) payload.until = newTimeSlot.until;
          if (newTimeSlot.count) payload.count = newTimeSlot.count;
          break;

        case 'YEARLY':
          payload.bymonthday = newTimeSlot.bymonthday;
          if (newTimeSlot.until) payload.until = newTimeSlot.until;
          if (newTimeSlot.count) payload.count = newTimeSlot.count;
          break;
      }

      console.log('Sending payload:', payload); // Debug log

      // FIXED: Remove selectedDoctor.id parameter
      await doctorsService.createAvailabilityRule(payload);
      toast.success('Availability rule created successfully');
      if (viewRange) {
        await fetchMonthlyCalendarAvailability(selectedDoctor.id, viewRange.start, viewRange.end);
      }
      setSlotDialogOpen(false);
      resetNewTimeSlot();
    } catch (error: any) {
      console.error('Error creating availability rule:', error);
      toast.error(error.response?.data?.message || 'Failed to create availability rule');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (newTimeSlot.repeat === 'none') {
      setNewTimeSlot(prev => ({ ...prev, frequency: 'DAILY' }));
    } else if (newTimeSlot.repeat === 'daily') {
      setNewTimeSlot(prev => ({ ...prev, frequency: 'DAILY' }));
    } else if (newTimeSlot.repeat === 'weekdays') {
      setNewTimeSlot(prev => ({ ...prev, frequency: 'WEEKLY', byweekday: getDefaultWeekdays() }));
    } else if (newTimeSlot.repeat === 'weekly') {
      setNewTimeSlot(prev => ({ ...prev, frequency: 'WEEKLY' }));
    } else if (newTimeSlot.repeat === 'monthly') {
      setNewTimeSlot(prev => ({ ...prev, frequency: 'MONTHLY' }));
    } else if (newTimeSlot.repeat === 'yearly') {
      setNewTimeSlot(prev => ({ ...prev, frequency: 'YEARLY' }));
    }
  }, [newTimeSlot.repeat]);

  const getDefaultWeekdays = (): string[] => ['MO', 'TU', 'WE', 'TH', 'FR'];

  const resetNewTimeSlot = () => {
    setNewTimeSlot({
      title: 'Available Appointment',
      start_time: '',
      end_time: '',
      repeat: 'none',
      frequency: 'DAILY',
      interval: 1,
      byweekday: getDefaultWeekdays(),
      bymonthday: 1,
      until: '',
      count: undefined,
      appointment_type: 'in-person',
      max_patients: 1,
      notes: '',
    });
  };

  const handleDeleteAvailability = async () => {
    if (!selectedDoctor || !selectedDate) {
      toast.error('Please select a doctor and date');
      return;
    }

    setLoading(true);
    try {
      await doctorsService.createAvailability(selectedDoctor.id, selectedDate, []);
      toast.success('Availability deleted successfully');
      setAvailabilities(prev =>
        prev.filter(a => !(a.doctor_id === selectedDoctor.id && a.date === selectedDate))
      );
      setEditingTimeSlots([]);
      setDeleteDialogOpen(false);
      if (viewRange) {
        await fetchMonthlyCalendarAvailability(selectedDoctor.id, viewRange.start, viewRange.end);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete availability');
    } finally {
      setLoading(false);
    }
  };

  // const addTimeSlot = () => {
  //   if (!newTimeSlot.start_time || !newTimeSlot.end_time) {
  //     toast.error('Please fill both start and end time');
  //     return;
  //   }

  //   if (newTimeSlot.start_time >= newTimeSlot.end_time) {
  //     toast.error('End time must be after start time');
  //     return;
  //   }

  //   const slot: TimeSlot = {
  //     id: Date.now().toString(),
  //     start_time: newTimeSlot.start_time,
  //     end_time: newTimeSlot.end_time,
  //     is_available: true,
  //     appointment_type: newTimeSlot.appointment_type,
  //     max_patients: newTimeSlot.max_patients,
  //     notes: newTimeSlot.notes,
  //     title: newTimeSlot.title,
  //   };

  //   setEditingTimeSlots(prev => [...prev, slot]);
  //   resetNewTimeSlot();
  //   setSlotDialogOpen(false);
  //   setIsEditing(true);
  // };

  const removeTimeSlot = (index: number) => {
    setEditingTimeSlots(prev => prev.filter((_, i) => i !== index));
    setIsEditing(true);
  };

  const handleDateSelect = (selectInfo: any) => {
    const date = selectInfo.startStr.split('T')[0];

    setSelectedDate(date);
    setNewTimeSlot(prev => ({ ...prev, date }));

    if (selectedDoctor) {
      fetchAvailability(selectedDoctor.id, date);
    }

    setIsEditing(false);
    setSlotDialogOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const event = calendarEvents.find(
      (event: CalendarEvent) => event.rule_id === clickInfo.event.id
    );
    if (event) {
      console.log('Event clicked:', event);
    }
  };

  // Use view interval (month start/end) instead of padded visible range to avoid over-fetching
  const handleDatesSet = (dateInfo: any) => {
    if (!selectedDoctor) return;

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const start = formatDate(dateInfo.view.currentStart); // first day of the current month
    const end = formatDate(dateInfo.view.currentEnd); // first day of the next month
    setViewRange({ start, end });
    fetchMonthlyCalendarAvailability(selectedDoctor.id, start, end);
  };

  const handleOpenSlotDialog = () => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }
    setNewTimeSlot(prev => ({ ...prev, date: selectedDate }));
    setSlotDialogOpen(true);
  };

  const handleSaveCustomSlots = () => {
    const datesToSave =
      newTimeSlot.repeat === 'custom' ? [...customDates, selectedDate] : [selectedDate];

    datesToSave.forEach(() => {
      const slot: TimeSlot = {
        id: Date.now().toString(),
        start_time: newTimeSlot.start_time,
        end_time: newTimeSlot.end_time,
        is_available: true,
        appointment_type: newTimeSlot.appointment_type,
        max_patients: newTimeSlot.max_patients,
        notes: newTimeSlot.notes,
        title: newTimeSlot.title,
      };
      setEditingTimeSlots(prev => [...prev, slot]);
    });

    setSlotDialogOpen(false);
    setCustomRepeatOpen(false);
    setCustomDates([]);
  };
  // const handleRepeatChange = (value: string) => {
  //   if (value === 'custom') {
  //     setCustomRepeatOpen(true);
  //   } else {
  //     // Map UI repeat options to API frequency values
  //     const frequencyMap: { [key: string]: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' } = {
  //       'none': 'DAILY',
  //       'daily': 'DAILY',
  //       'weekdays': 'WEEKLY',
  //       'weekly': 'WEEKLY',
  //       'monthly': 'MONTHLY',
  //       'yearly': 'YEARLY',
  //     };

  //     const frequency = frequencyMap[value];

  //     setNewTimeSlot(prev => ({
  //       ...prev,
  //       repeat: value,
  //       frequency: frequency,
  //       // Set default weekdays for weekly frequency
  //       byweekday: value === 'weekdays' || value === 'weekly' ? getDefaultWeekdays() : prev.byweekday
  //     }));
  //   }
  // };
  const handleWeekdayToggle = (weekday: string) => {
    setNewTimeSlot(prev => ({
      ...prev,
      byweekday: prev.byweekday.includes(weekday)
        ? prev.byweekday.filter(w => w !== weekday)
        : [...prev.byweekday, weekday],
    }));
  };

  const currentAvailability = availabilities.find(
    a => a.doctor_id === selectedDoctor?.id && a.date === selectedDate
  );

  const hasAvailability = currentAvailability && currentAvailability.time_slots.length > 0;

  // Normalize backend UTC timestamps to local wall time for FullCalendar
  const normalizeToLocal = (isoUtc: string): string => {
    const d = new Date(isoUtc);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const fullCalendarEvents = calendarEvents.map(event => ({
    id: event.rule_id,
    title: event.title,
    start: normalizeToLocal(event.start),
    end: normalizeToLocal(event.end),
    color: event.color,
    extendedProps: { type: event.type },
  }));

  const renderFrequencyFields = () => {
    const commonFields = (
      <>
        <Grid size={6}>
          <TextField
            fullWidth
            type="date"
            label="End Date (Optional)"
            value={newTimeSlot.until}
            onChange={e => setNewTimeSlot(prev => ({ ...prev, until: e.target.value }))}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={6}>
          <TextField
            fullWidth
            type="number"
            label="Number of Occurrences (Optional)"
            value={newTimeSlot.count || ''}
            onChange={e =>
              setNewTimeSlot(prev => ({
                ...prev,
                count: e.target.value ? parseInt(e.target.value) : undefined,
              }))
            }
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
      </>
    );

    switch (newTimeSlot.frequency) {
      case 'DAILY':
        return (
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                type="number"
                label="Interval (days)"
                value={newTimeSlot.interval}
                onChange={e =>
                  setNewTimeSlot(prev => ({ ...prev, interval: parseInt(e.target.value) }))
                }
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            {commonFields}
          </Grid>
        );

      case 'WEEKLY':
        return (
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                type="number"
                label="Interval (weeks)"
                value={newTimeSlot.interval}
                onChange={e =>
                  setNewTimeSlot(prev => ({ ...prev, interval: parseInt(e.target.value) }))
                }
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid size={12}>
              <Typography variant="subtitle2" gutterBottom>
                Repeat on:
              </Typography>
              <FormGroup row>
                {weekdays.map(day => (
                  <FormControlLabel
                    key={day.value}
                    control={
                      <Checkbox
                        checked={newTimeSlot.byweekday.includes(day.value)}
                        onChange={() => handleWeekdayToggle(day.value)}
                      />
                    }
                    label={day.label}
                  />
                ))}
              </FormGroup>
            </Grid>
            {commonFields}
          </Grid>
        );

      case 'MONTHLY':
        return (
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                type="number"
                label="Interval (months)"
                value={newTimeSlot.interval}
                onChange={e =>
                  setNewTimeSlot(prev => ({ ...prev, interval: parseInt(e.target.value) }))
                }
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                type="number"
                label="Day of Month"
                value={newTimeSlot.bymonthday}
                onChange={e =>
                  setNewTimeSlot(prev => ({ ...prev, bymonthday: parseInt(e.target.value) }))
                }
                InputProps={{ inputProps: { min: 1, max: 31 } }}
              />
            </Grid>
            {commonFields}
          </Grid>
        );

      case 'YEARLY':
        return (
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                type="number"
                label="Day of Month"
                value={newTimeSlot.bymonthday}
                onChange={e =>
                  setNewTimeSlot(prev => ({ ...prev, bymonthday: parseInt(e.target.value) }))
                }
                InputProps={{ inputProps: { min: 1, max: 31 } }}
              />
            </Grid>
            {commonFields}
          </Grid>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      setNewTimeSlot(prev => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDoctor && viewRange) {
      fetchMonthlyCalendarAvailability(selectedDoctor.id, viewRange.start, viewRange.end);
    }
  }, [selectedDoctor, viewRange]);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh', mt: -14 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#2c3e50' }}>
        Doctor Availability
      </Typography>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              select
              fullWidth
              label="Select Doctor"
              value={selectedDoctor?.id || ''}
              onChange={e => {
                const doctor = doctors.find(d => d.id === e.target.value);
                setSelectedDoctor(doctor || null);
                setSelectedDate('');
                setEditingTimeSlots([]);
                setIsEditing(false);
              }}
              InputProps={{
                startAdornment: <User size={20} style={{ marginRight: 8, color: '#666' }} />,
              }}
            >
              {doctors.map(doctor => (
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
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
            >
              <Typography
                variant="h6"
                sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}
              >
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
                  '&:hover': { backgroundColor: '#3367d6' },
                }}
              >
                Create Time Slot
              </Button>
            </Box>

            <Box sx={{ height: 600 }}>
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                timeZone="local"
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
                events={fullCalendarEvents}
                datesSet={handleDatesSet}
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

          {selectedDate && (
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}
                >
                  <Clock size={20} color="#4285f4" />
                  Managing{' '}
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
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
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Trash2 size={16} />}
                        onClick={() => setDeleteDialogOpen(true)}
                        disabled={loading}
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
                      onClick={handleCreateAvailability}
                      disabled={loading || editingTimeSlots.length === 0}
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
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                          {isEditing ? 'Editing Time Slots' : 'Scheduled Time Slots'}
                        </Typography>

                        {editingTimeSlots.length > 0 ? (
                          <List>
                            {editingTimeSlots.map((slot, index) => (
                              <React.Fragment key={index}>
                                <ListItem
                                  sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    backgroundColor: '#f8f9fa',
                                    border: '1px solid #e9ecef',
                                  }}
                                >
                                  <Box
                                    sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}
                                  >
                                    <Box
                                      sx={{
                                        width: 8,
                                        height: 40,
                                        borderRadius: 1,
                                        backgroundColor:
                                          slot.appointment_type === 'video'
                                            ? '#4285f4'
                                            : slot.appointment_type === 'phone'
                                              ? '#34a853'
                                              : '#ea4335',
                                      }}
                                    />
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
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          sx={{ mt: 0.5 }}
                                        >
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
                          <Alert severity="info">No time slots scheduled for this date.</Alert>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </Paper>
          )}
        </>
      )}

      <Dialog
        open={slotDialogOpen}
        onClose={() => setSlotDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box sx={{ p: 3, pb: 2 }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Add title"
              value={newTimeSlot.title}
              onChange={e => setNewTimeSlot(prev => ({ ...prev, title: e.target.value }))}
              InputProps={{
                disableUnderline: true,
                sx: {
                  fontSize: '22px',
                  fontWeight: 400,
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Clock size={16} color="#5f6368" />
              <Typography variant="body2" color="#5f6368">
                {selectedDate
                  ? new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Select date'}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={selectedDate || ''}
              onChange={e => {
                setSelectedDate(e.target.value);
                setNewTimeSlot(prev => ({ ...prev, date: e.target.value }));
              }}
            />
          </Box>

          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
            >
              <Typography variant="h6" fontWeight="500">
                Time Slots
              </Typography>
              <Button
                startIcon={<Plus size={16} />}
                onClick={() => {
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
                    setNewTimeSlot(prev => ({ ...prev, start_time: '', end_time: '' }));
                  }
                }}
                disabled={!newTimeSlot.start_time || !newTimeSlot.end_time}
              >
                Add Another Slot
              </Button>
            </Box>

            <Grid container spacing={2} alignItems="center">
              <Grid size={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Start time"
                  value={newTimeSlot.start_time}
                  onChange={e => setNewTimeSlot(prev => ({ ...prev, start_time: e.target.value }))}
                />
              </Grid>
              <Grid size={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="End time"
                  value={newTimeSlot.end_time}
                  onChange={e => setNewTimeSlot(prev => ({ ...prev, end_time: e.target.value }))}
                />
              </Grid>
            </Grid>

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
                          onClick={() =>
                            setEditingTimeSlots(prev => prev.filter((_, i) => i !== index))
                          }
                        >
                          <X size={16} />
                        </IconButton>
                      }
                      sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 1, py: 1 }}
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

          <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}>
            <TextField
              fullWidth
              select
              label="Repeat"
              value={newTimeSlot.repeat}
              onChange={e => {
                const value = e.target.value;
                if (value === 'custom') {
                  setCustomRepeatOpen(true);
                } else {
                  const frequencyMap: { [key: string]: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' } =
                    {
                      none: 'DAILY',
                      daily: 'DAILY',
                      weekdays: 'WEEKLY',
                      weekly: 'WEEKLY',
                      monthly: 'MONTHLY',
                      yearly: 'YEARLY',
                    };

                  setNewTimeSlot(prev => ({
                    ...prev,
                    repeat: value,
                    frequency: frequencyMap[value] || 'DAILY',
                    byweekday: value === 'weekdays' ? getDefaultWeekdays() : prev.byweekday,
                  }));
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Repeat size={16} color="#5f6368" />
                  </InputAdornment>
                ),
              }}
            >
              {repeatOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {newTimeSlot.repeat !== 'none' && newTimeSlot.repeat !== 'custom' && (
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Recurrence Settings
              </Typography>
              {renderFrequencyFields()}
            </Box>
          )}

          {customRepeatOpen && (
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                Custom Repeat – Select Dates
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setCustomDates(prev => [...prev, selectedDate || ''])}
                disabled={!selectedDate}
                sx={{ mb: 2 }}
              >
                Add Selected Date
              </Button>

              {customDates.length > 0 ? (
                <List dense>
                  {customDates.map((d, i) => (
                    <ListItem
                      key={i}
                      secondaryAction={
                        <IconButton
                          size="small"
                          onClick={() =>
                            setCustomDates(prev => prev.filter((_, index) => index !== i))
                          }
                        >
                          <X size={16} />
                        </IconButton>
                      }
                    >
                      <ListItemText primary={new Date(d).toLocaleDateString()} />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No additional dates selected.
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
          <Button
            onClick={() => {
              setSlotDialogOpen(false);
              setEditingTimeSlots([]);
              setCustomRepeatOpen(false);
              setCustomDates([]);
              resetNewTimeSlot();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (newTimeSlot.repeat === 'none') {
                // Single time slot - just add to editing list
                if (newTimeSlot.start_time && newTimeSlot.end_time) {
                  const slot: TimeSlot = {
                    id: Date.now().toString(),
                    start_time: newTimeSlot.start_time,
                    end_time: newTimeSlot.end_time,
                    is_available: true,
                    appointment_type: newTimeSlot.appointment_type,
                    max_patients: newTimeSlot.max_patients,
                    notes: newTimeSlot.notes,
                    title: newTimeSlot.title,
                  };
                  setEditingTimeSlots(prev => [...prev, slot]);
                  setSlotDialogOpen(false);
                  setIsEditing(true);
                  resetNewTimeSlot();
                  toast.success('Time slot added successfully');
                } else {
                  toast.error('Please fill both start and end time');
                }
              } else if (newTimeSlot.repeat === 'custom') {
                handleSaveCustomSlots();
              } else {
                // Recurring availability rule
                handleCreateAvailabilityRule();
              }
            }}
            disabled={
              newTimeSlot.repeat === 'none'
                ? !newTimeSlot.start_time || !newTimeSlot.end_time
                : newTimeSlot.repeat === 'custom'
                  ? customDates.length === 0
                  : !newTimeSlot.start_time || !newTimeSlot.end_time
            }
            sx={{ backgroundColor: '#1a73e8', '&:hover': { backgroundColor: '#1669d6' } }}
          >
            {loading ? <CircularProgress size={16} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete All Time Slots</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete all time slots for{' '}
            {new Date(selectedDate).toLocaleDateString()}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteAvailability}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={16} /> : 'Delete All'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DoctorAvailability;
