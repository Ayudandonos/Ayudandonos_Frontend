import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { ToastViewport } from '@/components/ui/Toast';
import {
  DEFAULT_TOAST_DURATION_MS,
  ToastContext,
  type PushToastInput,
  type ToastItem,
} from '@/context/toast-context';

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * Entrada: children: arbol de la aplicacion.
 * Proceso: Administra cola de toasts con auto-cierre y renderiza el viewport fijo.
 * Salida: Retorna el provider con viewport de notificaciones.
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  /**
   * Entrada: id: identificador del toast.
   * Proceso: Elimina el toast y cancela su temporizador de cierre.
   * Salida: No retorna valor.
   */
  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Entrada: input: mensaje, variante y duracion opcional.
   * Proceso: Agrega un toast a la cola y programa su auto-cierre.
   * Salida: Retorna el id del toast creado.
   */
  const pushToast = useCallback(
    (input: PushToastInput) => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const durationMs = input.durationMs ?? DEFAULT_TOAST_DURATION_MS;
      const toast: ToastItem = {
        id,
        variant: input.variant ?? 'info',
        message: input.message,
        title: input.title,
        durationMs,
      };

      setToasts((current) => [...current, toast].slice(-5));

      const timer = setTimeout(() => {
        dismissToast(id);
      }, durationMs);
      timersRef.current.set(id, timer);

      return id;
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      toasts,
      pushToast,
      dismissToast,
    }),
    [toasts, pushToast, dismissToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
