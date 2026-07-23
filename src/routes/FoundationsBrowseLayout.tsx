import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useAuth } from '@/context/useAuth';
import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: Ninguna (ruta publica /foundations*).
 * Proceso: Si hay sesion, reutiliza DashboardLayout (sidebar); si no, solo Outlet.
 * Salida: Retorna layout con o sin chrome de dashboard.
 */
export function FoundationsBrowseLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-text-secondary">
        {UI_MESSAGES.LOADING}
      </div>
    );
  }

  if (isAuthenticated) {
    return <DashboardLayout />;
  }

  return <Outlet />;
}
