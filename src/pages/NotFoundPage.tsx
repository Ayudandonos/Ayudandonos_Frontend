import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';
import { UI_MESSAGES } from '@/constants/messages.constants';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza la página de error 404 con mensaje y enlace de regreso al inicio.

// Salida:
// Retorna el elemento JSX de la página no encontrada.
export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-300">{UI_MESSAGES.NOT_FOUND_CODE}</h1>
      <p className="mt-4 text-xl text-gray-600">{UI_MESSAGES.NOT_FOUND_MESSAGE}</p>
      <Link to="/" className="mt-8">
        <Button>{UI_MESSAGES.NOT_FOUND_BACK}</Button>
      </Link>
    </div>
  );
}
