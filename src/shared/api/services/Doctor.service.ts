import { createApiClient } from '../interceptors';

type TimeSlot = any;

const doctorsApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const doctorsService = {
  // Get all doctors
  getAll: () => doctorsApi.get('/get-doctors'),

  getAvailability: (doctorId: string, date: string) =>
    doctorsApi.get(`/doctor-availabilities/${doctorId}`, {
      params: { date },
    }),

  createAvailability: (doctorId: string, date: string, _editingTimeSlots: TimeSlot[]) =>
    doctorsApi.post(`/doctor-availabilities/${doctorId}`, {}, { params: { date } }),

  updateAvailability: (doctorId: string, date: string, _editingTimeSlots: TimeSlot[]) =>
    doctorsApi.patch(`/doctor-availabilities/${doctorId}`, {}, { params: { date } }),

  deleteAvailability: (doctorId: string, _selectedDate: string, ) =>
    doctorsApi.delete(`/doctor-availabilities/${doctorId}` ),

  getTimeSlots: (date: string) =>
    doctorsApi.get('/available-time-slots', {
      params: { date },
    }),
};
