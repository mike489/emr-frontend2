import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../shared/api';
import type { Role, Permission } from '../shared/api/clients/authClient';

// Role with permissions
export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

// Authenticated user
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  profile_image: string | null;
  roles: RoleWithPermissions[];
}

// API login response type
interface LoginApiResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    roles: RoleWithPermissions[];
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
    profile_image?: string | null;
  };
}

// Zustand store state
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  expiresAt: number | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isTokenValid: () => boolean;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permName: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem('access_token') || null,
      expiresAt: Number(localStorage.getItem('expires_at')) || null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login({ email, password });

          // Safely assert response shape
          if (!response?.data) {
            throw new Error('No response data');
          }

          const apiResponse = response.data as unknown as LoginApiResponse;

          if (!apiResponse.success || !apiResponse.data) {
            throw new Error(apiResponse.message || 'Login failed');
          }

          const loginData = apiResponse.data;
          const expiresAt = Date.now() + loginData.expires_in * 1000;

          const user: AuthUser = {
            id: loginData.id ?? '',
            name: loginData.name ?? '',
            email: loginData.email ?? '',
            phone: loginData.phone ?? '',
            username: loginData.username ?? '',
            profile_image: loginData.profile_image ?? null,
            roles: loginData.roles ?? [],
          };

          // Persist
          localStorage.setItem('access_token', loginData.access_token);
          localStorage.setItem('expires_at', expiresAt.toString());
          localStorage.setItem('user', JSON.stringify(user));

          set({ user, token: loginData.access_token, expiresAt, isLoading: false });
        } catch (error: any) {
          console.error('Login failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('user');
        set({ user: null, token: null, expiresAt: null });
        authApi.logout().catch(() => {});
      },

      isTokenValid: () => {
        const { expiresAt } = get();
        return expiresAt ? Date.now() < expiresAt - 60_000 : false;
      },

      hasRole: (roleName: string) => {
        const { user } = get();
        return user?.roles?.some(r => r.name === roleName) ?? false;
      },

      hasPermission: (permName: string) => {
        const { user } = get();
        if (!user?.roles) return false;
        return user.roles.some(role =>
          Array.isArray(role.permissions) ? role.permissions.some(p => p.name === permName) : false
        );
      },
    }),
    {
      name: 'emr-auth',
      partialize: state => ({
        token: state.token,
        expiresAt: state.expiresAt,
        user: state.user,
      }),
    }
  )
);
