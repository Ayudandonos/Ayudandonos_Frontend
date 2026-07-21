import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import { canFoundationOperate } from '@/utils/foundation-access';

/**
 * Entrada: Ninguna (ruta /dashboard del area autenticada).
 * Proceso: Redirige al usuario segun rol y estado operativo de la fundacion.
 * Salida: Retorna Navigate hacia la ruta inicial correspondiente del dashboard.
 */
export function DashboardRedirect() {
  const { role, foundation } = useAuth();

  if (role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (role === 'FOUNDATION') {
    return canFoundationOperate(foundation) ? (
      <Navigate to="/foundation/requests" replace />
    ) : (
      <Navigate to="/foundation/profile" replace />
    );
  }

  return <Navigate to="/campaigns" replace />;
}
