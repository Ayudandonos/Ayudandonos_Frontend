export interface ApiResponseMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta?: ApiResponseMeta;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export type UserRole = 'USER' | 'FOUNDATION' | 'ADMIN';

export type FoundationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface Foundation {
  id: string;
  name: string;
  status: FoundationStatus;
  logoUrl: string | null;
  category: string | null;
  city: string | null;
  description: string | null;
  isProfileComplete: boolean;
  hasRequiredDocuments: boolean;
}

export interface AuthTokenData {
  accessToken: string;
  user: User;
  foundation?: Foundation;
}

export interface MeData {
  user: User;
  foundation: Foundation | null;
}

export interface HealthCheck {
  status: string;
  environment: string;
  timestamp: string;
  version: string;
}
