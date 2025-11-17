import { createApiClient } from '../interceptors';

const patientApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const PatientService = {
  getAll: () => patientApi.get('/patients'),
  getList: (filters?: Record<string, any>) => {
    return patientApi.get('/patient-lists', { params: filters });
  },
   getPatientCheckout: (filters?: Record<string, any>) => {
    return patientApi.get('/patient-checked-out', { params: filters });
  },
  
  getArchivedPatients: (filters?: Record<string, any>) => {
    return patientApi.get('/patient-archived', { params: filters });
  },
  getById: (id: string) => patientApi.get(`/patients/${id}`),
  // getList: (params: any) => patientApi.get('/patient-lists', { params }),
  create: (data: any) => patientApi.post('/patients', data),
  update: (id: string, data: any) => patientApi.put(`/patients/${id}`, data),
  delete: (id: string) => patientApi.delete(`/patients/${id}`),
  getVisits: () => patientApi.get('/get-visits'),

  createExamination: (payload: any) => patientApi.post('/patients/examination-data', payload),
  getExaminationData: (consultation_id: string) =>
    patientApi.get(`/patients/examination-data`, {
      params: { consultation_id },
    }),
};
