import { createApiClient } from '../interceptors';

type TimeSlot = any;

const doctorsApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const doctorsService = {
  // Get all doctors
  getAll: () => doctorsApi.get('/doctors'),

  getAvailability: (doctorId: string, date: string) =>
    doctorsApi.get(`/doctor-availabilities/${doctorId}`, {
      params: { date },
    }),

  getMonthlyCalendarAvailability: (doctorId: string, data: any) =>
    doctorsApi.get(`/doctors/${doctorId}/monthly-calendar-availability`, { params: data }),

  createAvailability: (doctorId: string, date: string, _editingTimeSlots: TimeSlot[]) =>
    doctorsApi.post(`/availability-rules/${doctorId}/toggle-day`, {}, { params: { date } }),

  createAvailabilityRule: (payload: any) =>
    doctorsApi.post('/availability-rules', payload),
};