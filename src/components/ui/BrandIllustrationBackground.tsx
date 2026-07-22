import { FIGMA_ASSETS } from '@/constants/figma-assets.constants';
import { cn } from '@/utils/cn';

type IllustrationTone = 'default' | 'soft';

interface BrandIllustrationBackgroundProps {
  tone?: IllustrationTone;
  /** Fijo al viewport (solo register). Por defecto acompaña el scroll de la pagina. */
  fixed?: boolean;
}

/**
 * Entrada: tone: intensidad; fixed: ancla el fondo al viewport.
 * Proceso: Renderiza capa de fondo full-bleed con ilustracion y degradado de legibilidad.
 * Salida: Retorna el elemento JSX decorativo del fondo.
 */
export function BrandIllustrationBackground({
  tone = 'default',
  fixed = false,
}: BrandIllustrationBackgroundProps) {
  const isSoft = tone === 'soft';

  return (
    <div
      className={cn(
        'pointer-events-none inset-0 -z-10 overflow-hidden',
        fixed ? 'fixed' : 'absolute',
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          'absolute inset-0 bg-surface-page bg-no-repeat [background-position:center] [background-size:cover] lg:[background-position:70%_50%]',
          isSoft ? 'opacity-45' : 'opacity-95',
        )}
        style={{ backgroundImage: `url(${FIGMA_ASSETS.HERO_ILLUSTRATION_SVG})` }}
      />
      <div
        className={cn(
          'absolute inset-0',
          isSoft
            ? 'bg-gradient-to-b from-surface-page/70 via-surface-page/50 to-surface-page/65 lg:bg-gradient-to-r lg:from-surface-page/80 lg:via-surface-page/55 lg:to-surface-page/40'
            : 'bg-gradient-to-b from-surface-page/30 via-transparent to-surface-page/25 lg:bg-gradient-to-r lg:from-surface-page lg:via-surface-page/55 lg:to-transparent lg:via-30%',
        )}
      />
    </div>
  );
}
