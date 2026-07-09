import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { UI_MESSAGES } from '@/constants/messages.constants';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza el formulario de inicio de sesión (placeholder para Fase 2).

// Salida:
// Retorna el elemento JSX de la página de login.
export function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{UI_MESSAGES.LOGIN_TITLE}</h2>
        <p className="mt-1 text-sm text-gray-500">{UI_MESSAGES.LOGIN_SUBTITLE}</p>
      </div>
      <p className="text-center text-sm text-amber-600">
        {UI_MESSAGES.LOGIN_PENDING}
      </p>
      <Button className="w-full" disabled>
        {UI_MESSAGES.LOGIN_SUBMIT}
      </Button>
      <p className="text-center text-sm text-gray-500">
        {UI_MESSAGES.LOGIN_NO_ACCOUNT}{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
          {UI_MESSAGES.LOGIN_REGISTER_LINK}
        </Link>
      </p>
    </div>
  );
}
