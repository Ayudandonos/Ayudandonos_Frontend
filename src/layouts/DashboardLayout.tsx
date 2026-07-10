import { Outlet } from 'react-router-dom';
import { DashboardHeader, SideNav } from '@/components/ui/DashboardChrome';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza layout con SideNav 256px, header 64px y area de contenido.
 * Salida: Retorna el elemento JSX del layout de dashboard.
 */
export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader />
        <main className="flex-1 overflow-auto bg-vivid-50 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
