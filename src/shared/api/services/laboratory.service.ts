// import axios from 'axios';
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

  // createLabResult: (patientId: string, formData: FormData) => {
  //   return LaboratoryApi.post(`/submit-laboratories-result/${patientId}`, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });
  // },

  createLabResult: async (patientId: string, formData: FormData) => {
    // For FormData uploads, override timeout
    return await LaboratoryApi.post(`/submit-laboratories-result/${patientId}`, formData, {
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

  getMedications: () => LaboratoryApi.get(`/pharmacy-medicines`),

  createPharmacyMedicinesOrder: (patientId: string, data: any) =>
    LaboratoryApi.post(`/pharmacy-medicines/order/${patientId}`, data),

  getPharmacyMedicinesOrder: (patientId: string) =>
    LaboratoryApi.get(`/pharmacy-medicines/order/${patientId}`),

  getPharmacyMedicinesPatientOrders: () => LaboratoryApi.get(`pharmacy-medicines/patient-orders`),

  createGlassPrescriptions: (patientId: string, data: any) =>
    LaboratoryApi.post(`/glass-prescriptions/${patientId}`, data),

  getGlassPrescriptions: () => LaboratoryApi.get(`/glass-prescriptions`),

  getGlassPrescriptionDetails: (patientId: string) =>
    LaboratoryApi.get(`/glass-prescriptions/${patientId}`),
};
