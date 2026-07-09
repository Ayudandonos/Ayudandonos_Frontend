import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '@/context/useAuth';
import { UI_MESSAGES } from '@/constants/messages.constants';

interface ProtectedRouteProps {
  children: ReactNode;
}

// Entrada:
// children: contenido protegido.

// Proceso:
// Redirige a login si el usuario no esta autenticado.

// Salida:
// Retorna children o redireccion a /login.
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-text-secondary">
        {UI_MESSAGES.LOADING}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
