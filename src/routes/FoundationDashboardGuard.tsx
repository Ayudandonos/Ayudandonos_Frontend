import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';
import {
  canFoundationOperate,
  isFoundationProfileReady,
} from '@/utils/foundation-access';

/**
 * Entrada: Ninguna (envuelve rutas hijas del dashboard autenticado).
 * Proceso: Restringe fundaciones sin perfil completo o sin verificacion admin al modulo de perfil.
 * Salida: Retorna Outlet, Navigate a perfil o redireccion segun estado de la fundacion.
 */
export function FoundationDashboardGuard() {
  const { role, foundation } = useAuth();
  const location = useLocation();

  if (role !== 'FOUNDATION') {
    return <Outlet />;
  }

  const isProfileRoute = location.pathname.startsWith('/foundation/profile');

  if (isProfileRoute) {
    return <Outlet />;
  }

  if (!isFoundationProfileReady(foundation)) {
    return (
      <Navigate
        to="/foundation/profile"
        replace
        state={{ gate: 'incomplete', from: location.pathname }}
      />
    );
  }

  if (!canFoundationOperate(foundation)) {
    return (
      <Navigate
        to="/foundation/profile"
        replace
        state={{ gate: 'verification', from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
