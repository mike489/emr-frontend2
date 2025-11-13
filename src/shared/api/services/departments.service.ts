import { createApiClient } from '../interceptors';

const departmentsApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const DepartmentsService = {
  getAll: () => departmentsApi.get('/departments'),
};
