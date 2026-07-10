import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/context';
import { Button } from '@/components/ui';
import { UI_MESSAGES } from '@/constants/messages.constants';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza el layout principal con encabezado, navegación, contenido y pie de página.
 * Salida: Retorna el elemento JSX del layout principal.
 */
export function MainLayout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold text-primary-600">
            {UI_MESSAGES.APP_NAME}
          </Link>
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={logout}>
                {UI_MESSAGES.NAV_LOGOUT}
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {UI_MESSAGES.NAV_LOGIN}
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">{UI_MESSAGES.NAV_REGISTER}</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500 sm:px-6 lg:px-8">
          {UI_MESSAGES.APP_FOOTER(new Date().getFullYear())}
        </div>
      </footer>
    </div>
  );
}
