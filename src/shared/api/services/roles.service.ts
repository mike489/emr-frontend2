import { createApiClient } from '../interceptors';

const rolesApi = createApiClient(import.meta.env.VITE_EMS_URL);

export const rolesService = {
  getAll: () => {
    return rolesApi.get('/roles');
  },
};
