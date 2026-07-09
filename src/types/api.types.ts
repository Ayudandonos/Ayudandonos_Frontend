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

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'donor' | 'foundation' | 'admin';
}

export interface Foundation {
  id: string;
  name: string;
  description?: string;
}

export interface AuthTokenData {
  accessToken: string;
  user: User;
  foundation?: Foundation;
}

export interface MeData {
  user: User;
  foundation?: Foundation;
}

export interface HealthCheck {
  status: string;
  environment: string;
  timestamp: string;
  version: string;
}
