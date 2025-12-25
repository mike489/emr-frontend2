import { createApiClient } from '../interceptors';

const OperationalApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const OperationalService = {
  getOR: (search?: string) => {
    let url = '/operations';
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    return OperationalApi.get(url);
  },
  createOperationRequest: (patientId: string, data: any) =>
    OperationalApi.post(`/patient-operations/${patientId}`, data),

  getOperationRequest: (patientId: string) =>
    OperationalApi.get(`/patient-operations/${patientId}`),

  getORPatients: (filters?: Record<string, any>) =>
    OperationalApi.get('/operation-requests', { params: filters }),

  createOperationPayment: (patientId: string, data: any) =>
    OperationalApi.post(`/operation-payments/${patientId}`, data),
};
