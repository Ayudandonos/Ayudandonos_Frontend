import type { ReactNode } from 'react';
import { AuthFooter, AuthHeader } from '@/components/ui/AuthChrome';
import { BrandIllustrationBackground } from '@/components/ui/BrandIllustrationBackground';

type IllustrationTone = 'default' | 'soft';

interface PublicPageShellProps {
  children: ReactNode;
  /** Cuando es true, el SVG de marca cubre toda la pagina incluido el footer. */
  withIllustration?: boolean;
  /** Intensidad del fondo ilustrado (soft = mas claro, para paginas de contenido). */
  illustrationTone?: IllustrationTone;
}

/**
 * Entrada: children: contenido; withIllustration/illustrationTone: fondo SVG de marca.
 * Proceso: Renderiza shell publico glass con header, animacion fade-in y footer.
 * Salida: Retorna el elemento JSX del contenedor publico.
 */
export function PublicPageShell({
  children,
  withIllustration = false,
  illustrationTone = 'default',
}: PublicPageShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      {withIllustration ? <BrandIllustrationBackground tone={illustrationTone} /> : null}
      <AuthHeader variant="login" />
      <main className="relative flex-1 animate-fade-in">{children}</main>
      <AuthFooter variant="full" translucent={withIllustration} />
    </div>
  );
}
