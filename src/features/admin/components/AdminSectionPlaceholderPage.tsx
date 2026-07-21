import { EmptyState } from '@/components/ui/EmptyState';

interface AdminSectionPlaceholderPageProps {
  title: string;
  description: string;
}

/**
 * Entrada: title y description: textos del modulo administrativo pendiente.
 * Proceso: Renderiza cabecera y estado vacio informativo sin datos mock.
 * Salida: Retorna el elemento JSX de la seccion placeholder.
 */
export function AdminSectionPlaceholderPage({ title, description }: AdminSectionPlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-display text-text-primary">{title}</h1>
        <p className="mt-2 text-body text-text-secondary">{description}</p>
      </header>
      <EmptyState title={title} description={description} />
    </div>
  );
}
