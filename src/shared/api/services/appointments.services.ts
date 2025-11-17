import { createApiClient } from '../interceptors';

const appointmentsApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const AppointmentsService = {
  getAll: () => appointmentsApi.get('/appointments'),
  getList: (filters?: Record<string, any>) => {
    return appointmentsApi.get('/appointments', { params: filters });
  },
   getPatientCheckout: (filters?: Record<string, any>) => {
    return appointmentsApi.get('/patient-checked-out', { params: filters });
  },
  getById: (id: string) => appointmentsApi.get(`/appointments/${id}`),
  // getList: (params: any) => appointmentsApi.get('/patient-lists', { params }),
  create: (data: any) => appointmentsApi.post('/create-appointment', data),
  update: (id: string, data: any) => appointmentsApi.put(`/appointments/${id}`, data),
  delete: (id: string) => appointmentsApi.delete(`/appointments/${id}`),
  reschedule: (id: string, data: { appointment_date: string; start_time: string }) =>
  appointmentsApi.put(`/appointments/${id}/reschedule`, data),


  
};
