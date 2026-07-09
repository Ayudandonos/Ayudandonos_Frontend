import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import type { UserRole } from '@/types';
import { useAuth } from '@/context/useAuth';

interface RoleRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: string;
}

// Entrada:
// children: contenido; allowedRoles: roles permitidos; fallback: ruta alternativa.

// Proceso:
// Valida que el rol del usuario este en la lista permitida.

// Salida:
// Retorna children, fallback o redireccion a /campaigns.
export function RoleRoute({ children, allowedRoles, fallback = '/campaigns' }: RoleRouteProps) {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={fallback} replace />;
  }

  return children;
}
