import { createApiClient } from '../interceptors';
import type { ApiResponse } from '../types/api.types';

const authClient = createApiClient(import.meta.env.VITE_AUTH_URL);

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Permission {
  uuid: string;
  name: string;
}

export interface Role {
  uuid: string;
  name: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  profile_image: string | null;
  roles: Role[];
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  roles: Role[];
  user: User; // ✅ add this
}

export const authApi = {
  login: (creds: LoginCredentials) => authClient.post<ApiResponse<LoginResponse>>('/login', creds),

  me: () => authClient.get<ApiResponse<User>>('/me'),

  logout: () => authClient.post('/logout'),
};
