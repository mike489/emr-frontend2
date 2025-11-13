import { createApiClient } from '../interceptors';

const refractionApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const RefractionService = {
  getAll: (filters?: Record<string, any>) => {
    return refractionApi.get('/patient-lists', { params: filters });
  },
};
