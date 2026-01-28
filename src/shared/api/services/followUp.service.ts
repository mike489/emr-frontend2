import { createApiClient } from '../interceptors';

const patientApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const FollowUpService = {
  getList: (filters?: Record<string, any>) => {
    return patientApi.get('/follow-up-notes', { params: filters });
  },

  create: (data: any) => patientApi.post('/follow-up-notes', data),
  update: (id: string, data: any) => patientApi.put(`/follow-up-notes/${id}`, data),
  delete: (id: string) => patientApi.delete(`/follow-up-notes/${id}`),
  getVisits: () => patientApi.get('/get-visits'),

  createExamination: (payload: any) => patientApi.post('/patients/examination-data', payload),
  getExaminationData: (consultation_id: string) =>
    patientApi.get(`/patients/examination-data`, {
      params: { consultation_id },
    }),
  getFollowUpNote: (patient_id: string) =>
    patientApi.get('/follow-up-notes', { params: { patient_id } }),

  getIopValues: (patient_id: string) => patientApi.get(`/follow-up-notes/iop_values/${patient_id}`),
  getVisualAcuitiesValues: (patient_id: string) =>
    patientApi.get(`follow-up-notes/visual-acuities/${patient_id}`),
  getAllergies: (patient_id: string) => patientApi.get(`follow-up-notes/allergies/${patient_id}`),
};
