import { createContext } from 'react';
import type { Foundation, User, UserRole } from '@/types';
import type {
  RegisterFoundationPayload,
  RegisterUserPayload,
} from '@/features/auth/services/auth.service';

export interface AuthSession {
  user: User;
  foundation: Foundation | null;
}

export interface AuthContextValue {
  user: User | null;
  foundation: Foundation | null;
  accessToken: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<AuthSession>;
  logout: () => Promise<void>;
  registerUser: (payload: RegisterUserPayload) => Promise<AuthSession>;
  registerFoundation: (payload: RegisterFoundationPayload) => Promise<AuthSession>;
  fetchMe: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
