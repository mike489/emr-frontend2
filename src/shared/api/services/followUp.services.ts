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
};
