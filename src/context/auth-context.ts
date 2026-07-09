import { createContext } from 'react';
import type { Foundation, User, UserRole } from '@/types';
import type {
  RegisterFoundationPayload,
  RegisterUserPayload,
} from '@/features/auth/services/auth.service';

export interface AuthContextValue {
  user: User | null;
  foundation: Foundation | null;
  accessToken: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<User>;
  logout: () => Promise<void>;
  registerUser: (payload: RegisterUserPayload) => Promise<User>;
  registerFoundation: (payload: RegisterFoundationPayload) => Promise<User>;
  fetchMe: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
