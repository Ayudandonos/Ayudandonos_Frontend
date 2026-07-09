import { useContext } from 'react';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { AuthContext } from '@/context/auth-context';

// Entrada:
// Ninguna.

// Proceso:
// Obtiene el contexto de autenticacion.

// Salida:
// Retorna el valor del contexto o lanza error si falta el provider.
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(UI_MESSAGES.AUTH_CONTEXT_ERROR);
  }
  return context;
}
