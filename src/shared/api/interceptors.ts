import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';

export const createApiClient = (baseURL: string) => {
  const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  // Add Bearer token
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 401 → auto logout
  api.interceptors.response.use(
    res => res,
    error => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return api;
};
