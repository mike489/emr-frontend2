import { createApiClient } from "../interceptors";

const usersApi = createApiClient(import.meta.env.VITE_EMS_URL);
export const usersService = {
  getAll: (filters?: Record<string, any>) => {
    return usersApi.get('/users', { params: filters });
  },
  create: (data: any) => {
    return usersApi.post('/users', data);
  },
//   getTriageWithCount: () => {
//     return usersApi.get('/users');
//   },

};