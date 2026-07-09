import { Link } from 'react-router-dom';
import { buttonLinkClass } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { PublicPageShell } from '@/features/marketing/components/PublicPageShell';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza pagina 404 con diseno glass del sistema.

// Salida:
// Retorna el elemento JSX de la pagina no encontrada.
export function NotFoundPage() {
  return (
    <PublicPageShell>
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
        <Card padding="lg" className="max-w-md" hover={false}>
          <h1 className="text-6xl font-bold text-primary-300">{UI_MESSAGES.NOT_FOUND_CODE}</h1>
          <p className="mt-4 text-subheading">{UI_MESSAGES.NOT_FOUND_MESSAGE}</p>
          <Link to="/" className={buttonLinkClass({ variant: 'primary', size: 'md', className: 'mt-8' })}>
            {UI_MESSAGES.NOT_FOUND_BACK}
          </Link>
        </Card>
      </div>
    </PublicPageShell>
  );
}
