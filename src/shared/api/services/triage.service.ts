import { createApiClient } from '../interceptors';

const triageApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const TriageService = {
  getAll: (filters?: Record<string, any>) => {
    return triageApi.get('/patient-lists', { params: filters });
  },
};
