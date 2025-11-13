import { createApiClient } from '../interceptors';

const patientApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const PatientCategoryService = {
  getAll: () => patientApi.get('/patient-categories'),
};
