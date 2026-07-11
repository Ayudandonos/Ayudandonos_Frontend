import type { ReactNode } from 'react';
import { AuthFooter, AuthHeader } from '@/components/ui/AuthChrome';

interface PublicPageShellProps {
  children: ReactNode;
}

/**
 * Entrada: children: contenido principal de la pagina publica.
 * Proceso: Renderiza shell publico glass con header, animacion fade-in y footer.
 * Salida: Retorna el elemento JSX del contenedor publico.
 */
export function PublicPageShell({ children }: PublicPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader variant="login" />
      <main className="flex-1 animate-fade-in">{children}</main>
      <AuthFooter variant="full" />
    </div>
  );
}
