import { type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import { prepareSvgContent } from './icon-utils';
import { ICONS } from './icons';
import { ICON_SIZE_PX, type IconName, type IconSize } from './types';

export type { IconName, IconSize } from './types';

interface IconProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'color'> {
  name: IconName;
  size?: IconSize;
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  title?: string;
  decorative?: boolean;
  'aria-label'?: string;
  role?: string;
}

// Entrada:
// name, size, dimensiones, color, accesibilidad y props HTML adicionales.

// Proceso:
// Resuelve el SVG desde el registro centralizado y lo renderiza con currentColor.

// Salida:
// Retorna el elemento JSX del icono.
export function Icon({
  name,
  size = 'md',
  width,
  height,
  color,
  className,
  title,
  decorative = true,
  'aria-label': ariaLabel,
  role,
  style,
  ...rest
}: IconProps) {
  const svgContent = ICONS[name];
  const dimension = ICON_SIZE_PX[size];
  const resolvedWidth = width ?? dimension;
  const resolvedHeight = height ?? dimension;
  const isDecorative = decorative && !title && !ariaLabel;
  const accessibleLabel = ariaLabel ?? title;

  const inlineStyle: CSSProperties = {
    width: typeof resolvedWidth === 'number' ? `${resolvedWidth}px` : resolvedWidth,
    height: typeof resolvedHeight === 'number' ? `${resolvedHeight}px` : resolvedHeight,
    color,
    ...style,
  };

  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full', className)}
      style={inlineStyle}
      aria-hidden={isDecorative ? true : undefined}
      aria-label={isDecorative ? undefined : accessibleLabel}
      role={role ?? (isDecorative ? undefined : 'img')}
      {...rest}
      dangerouslySetInnerHTML={{ __html: prepareSvgContent(svgContent) }}
    />
  );
}
