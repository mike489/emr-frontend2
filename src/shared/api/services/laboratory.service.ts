import { createApiClient } from '../interceptors';

const LaboratoryApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const LaboratoryService = {
  getAll: () => LaboratoryApi.get('/laboratory-payment-requests'),
  getList: (filters?: Record<string, any>) => {
    return LaboratoryApi.get('/laboratory-payment-requests', { params: filters });
  },
  getLabs: () => LaboratoryApi.get('/laboratories'),
  createLabRequest: (patientId: string, data: any) =>
    LaboratoryApi.post(`/patient-laboratory/${patientId}`, data),

  getLabPatient: () => LaboratoryApi.get('/laboratories/patients'),

  getLabRequest: (patientId: string) => LaboratoryApi.get(`/patient-laboratories/${patientId}`),

  createLabPayment: (patientId: string, data: any) =>
    LaboratoryApi.post(`/laboratories-payment/${patientId}`, data),

  createLabResult: (patientId: string, data: any) =>
    LaboratoryApi.post(`/submit-laboratories-result/${patientId}`, data),
};
