import { type ImgHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface AppImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

/**
 * Entrada: src y props nativas de img.
 * Proceso: Renderiza imagen con fondo transparente y object-contain del sistema de diseno.
 * Salida: Retorna el elemento JSX de la imagen.
 */
export function AppImage({ className, alt = '', ...props }: AppImageProps) {
  return (
    <img
      alt={alt}
      className={cn('block bg-transparent object-contain', className)}
      {...props}
    />
  );
}
