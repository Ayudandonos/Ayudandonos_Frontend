import { useContext } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { ToastContext } from '@/context/toast-context';

/**
 * Entrada: Ninguna.
 * Proceso: Obtiene el contexto de toasts globales.
 * Salida: Retorna pushToast/dismissToast o lanza error si falta el provider.
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error(UI_MESSAGES.TOAST_CONTEXT_ERROR);
  }
  return context;
}
