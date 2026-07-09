import { Outlet, Link } from 'react-router-dom';
import { UI_MESSAGES } from '@/constants/messages.constants';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza el layout de autenticación centrado con logo y área de contenido.

// Salida:
// Retorna el elemento JSX del layout de autenticación.
export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            {UI_MESSAGES.APP_NAME}
          </Link>
          <p className="mt-2 text-sm text-gray-500">{UI_MESSAGES.APP_TAGLINE}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
