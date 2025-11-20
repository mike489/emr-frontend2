import { createApiClient } from '../interceptors';

const apiClient = createApiClient(import.meta.env.VITE_EMS_URL);

export interface MedicalCertificate {
  id: string;
  patient_id: string;
  diagnosis: string;
  injury_description: string;
  recommendations: string;
  remarks: string;
  date_of_examination: string;
  rest_days: number;
  status: 'issued' | 'draft';
  created_at?: string;
  updated_at?: string;
}

export const MedicalCertificateService = {
  getAll: () => apiClient.get('/medical-certificates'),
  
  getMedicalCertificateMy: (patientId: string) => 
    apiClient.get(`/medical-certificates/patient/${patientId}`),

  create: (data: Omit<MedicalCertificate, 'id'>) => 
    apiClient.post('/medical-certificates', data),

  update: (id: string, data: Partial<MedicalCertificate>) => 
    apiClient.put(`/medical-certificates/${id}`, data),
  
  delete: (id: string) => 
    apiClient.delete(`/medical-certificates/${id}`),
};