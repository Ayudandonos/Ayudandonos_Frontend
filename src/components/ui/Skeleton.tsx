import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

/**
 * Entrada: className: clases Tailwind opcionales para dimensiones.
 * Proceso: Renderiza bloque animado de carga segun design system.
 * Salida: Retorna el elemento JSX del skeleton.
 */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-lg bg-vivid-100', className)} aria-hidden="true" />;
}
