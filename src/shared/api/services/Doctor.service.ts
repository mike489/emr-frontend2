import { createApiClient } from '../interceptors';

type TimeSlot = any;

const doctorsApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const doctorsService = {
  // Get all doctors
  getAll: () => doctorsApi.get('/doctors'),

  // Get paginated doctors
  getPaginated: (page: number = 1, perPage: number = 10) =>
    doctorsApi.get('/doctors-paginate', {
      params: { page, per_page: perPage },
    }),

  // Create a new doctor
  create: (payload: { name: string; email: string; phone: string; username: string; password: string; speciality: string }) =>
    doctorsApi.post('/doctors', payload),

  // Get all specialities
  getSpecialities: () => doctorsApi.get('/specialities'),

  getAvailability: (doctorId: string, date: string) =>
    doctorsApi.get(`/doctor-availabilities/${doctorId}`, {
      params: { date },
    }),

  getMonthlyCalendarAvailability: (doctorId: string, data: any) =>
    doctorsApi.get(`/doctors/${doctorId}/monthly-calendar-availability`, { params: data }),

  createAvailability: (doctorId: string, date: string, _editingTimeSlots: TimeSlot[]) =>
    doctorsApi.post(`/availability-rules/${doctorId}/toggle-day`, {}, { params: { date } }),

  createAvailabilityRule: (payload: any) => doctorsApi.post('/availability-rules', payload),
};

// Nurses service
export const nursesService = {
  create: (payload: { name: string; email: string; phone: string; username: string; password: string; roles: string[] }) =>
    doctorsApi.post('/nurses', payload),
};
