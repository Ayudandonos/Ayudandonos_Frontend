import { cn } from '@/utils/cn';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  label?: string;
}

/**
 * Entrada: value/max: progreso numerico; label opcional.
 * Proceso: Calcula porcentaje y renderiza barra visual accesible.
 * Salida: Retorna el elemento JSX de la barra de progreso.
 */
export function ProgressBar({ value, max, className, label }: ProgressBarProps) {
  const safeMax = max > 0 ? max : 1;
  const percent = Math.min(100, Math.round((Math.max(0, value) / safeMax) * 100));

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs text-text-secondary">
          <span>{label}</span>
          <span>{percent}%</span>
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-vivid-100"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary-600 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
