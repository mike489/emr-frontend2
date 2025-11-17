import { createApiClient } from '../interceptors';

const api = createApiClient(import.meta.env.VITE_EMS_URL);

export const NotificationService = {
  getNotifications: (page = 1) =>
    api.get('/my-notifications', {
      params: { page },
    }),

  markAllRead: () => api.post('/read-all-notifications'),
  markOneRead: (id: string) => api.post(`/read-notification/${id}`),
};
