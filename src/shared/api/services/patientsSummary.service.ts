import { createApiClient } from '../interceptors';

const patientSummaryApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const PatientSummaryService = {
  getAll: (department: string) =>
    patientSummaryApi.get(`/patients-summary?department=${department}`),
};
