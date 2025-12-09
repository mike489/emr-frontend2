import { createApiClient } from '../interceptors';

const BedAndWardsApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const BedAndWardService = {
  getAll: () => BedAndWardsApi.get('/wards'),
  delete: (id: string) => BedAndWardsApi.delete(`/wards/${id}`),
  update: (id: string, data: any) => BedAndWardsApi.put(`/wards/${id}`, data),
  create: (data: any) => BedAndWardsApi.post('/wards', data),

  getAllBeds: () => BedAndWardsApi.get('/beds'),
  getPatientBeds: () => BedAndWardsApi.get(`/patient-beds`),
  deleteBed: (id: string) => BedAndWardsApi.delete(`/beds/${id}`),
  updateBed: (id: string, data: any) => BedAndWardsApi.put(`/beds/${id}`, data),
  createBed: (data: any) => BedAndWardsApi.post('/beds', data),
  assignBed: (id: string, data: any) => BedAndWardsApi.post(`/beds/${id}/assign`, data),
  releaseBed: (id: string, data: any) => BedAndWardsApi.post(`/beds/${id}/release`, data),

  getAllInpatients: () => BedAndWardsApi.get('/in-patients'),
};
