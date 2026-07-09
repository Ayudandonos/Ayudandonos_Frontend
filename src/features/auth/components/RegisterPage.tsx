import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { UI_MESSAGES } from '@/constants/messages.constants';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza el formulario de registro (placeholder para Fase 2).

// Salida:
// Retorna el elemento JSX de la página de registro.
export function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{UI_MESSAGES.REGISTER_TITLE}</h2>
        <p className="mt-1 text-sm text-gray-500">{UI_MESSAGES.REGISTER_SUBTITLE}</p>
      </div>
      <p className="text-center text-sm text-amber-600">
        {UI_MESSAGES.REGISTER_PENDING}
      </p>
      <Button className="w-full" disabled>
        {UI_MESSAGES.REGISTER_SUBMIT}
      </Button>
      <p className="text-center text-sm text-gray-500">
        {UI_MESSAGES.REGISTER_HAS_ACCOUNT}{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          {UI_MESSAGES.REGISTER_LOGIN_LINK}
        </Link>
      </p>
    </div>
  );
}
