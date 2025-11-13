import { createApiClient } from '../interceptors';

const doctorsApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const doctorsService = {
  getAll: () => doctorsApi.get('/get-doctors'),
};
