import { createApiClient } from '../interceptors';
import type { ApiResponse, PaginationResponse } from '../types/api.types';

const emsClient = createApiClient(import.meta.env.VITE_EMS_URL);

export interface Patient {
  full_name: any;
  id: string;
  mrn: string;
  name: string;
  dob: string;
  gender: 'M' | 'F' | 'O';
  phone: string;
  email?: string;
  address?: string;
}

export const emsApi = {
  getPatients: (page = 1, search = '') =>
    emsClient.get<ApiResponse<PaginationResponse<Patient>>>('/patients', {
      params: { page, search },
    }),

  getPatient: (id: string) =>
    emsClient.get<ApiResponse<Patient>>(`/patients/${id}`),

  createPatient: (data: Partial<Patient>) =>
    emsClient.post<ApiResponse<Patient>>('/patients', data),

  updatePatient: (id: string, data: Partial<Patient>) =>
    emsClient.patch<ApiResponse<Patient>>(`/patients/${id}`, data),
};