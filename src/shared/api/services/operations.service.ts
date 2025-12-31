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

  getORPatientsTest: (patientId: string) => OperationalApi.get(`/operation-requests/${patientId}`),
  // getORPatientsTest: (patientId: string) => OperationalApi.get(`/patient-operations/${patientId}`),

  createOperationPayment: (patientId: string, data: any) =>
    OperationalApi.post(`/operation-pay/${patientId}`, data),

  createOperationResult: async (patientId: string, formData: FormData) => {
    // For FormData uploads, override timeout
    return await OperationalApi.post(`/submit-operations-result/${patientId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 60 seconds for file uploads
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });
  },
};
