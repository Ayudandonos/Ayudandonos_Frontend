import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User } from '@/types';
import { UI_MESSAGES } from '@/constants/messages.constants';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Entrada:
// children: componentes hijos que tendrán acceso al contexto de autenticación.

// Proceso:
// Gestiona el estado del usuario autenticado y expone funciones de login y logout.

// Salida:
// Retorna el proveedor de contexto con el valor de autenticación.
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(false);

  // Entrada:
  // _email: correo del usuario; _password: contraseña del usuario.

  // Proceso:
  // Placeholder de autenticación; la integración con authService se realizará en Fase 2.

  // Salida:
  // Lanza error indicando que la autenticación no está implementada.
  const login = useCallback(async (_email: string, _password: string) => {
    throw new Error(UI_MESSAGES.AUTH_NOT_IMPLEMENTED);
  }, []);

  // Entrada:
  // Ninguna.

  // Proceso:
  // Limpia el estado del usuario y elimina el token de acceso del almacenamiento local.

  // Salida:
  // No retorna valor; el usuario queda desautenticado.
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('accessToken');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Entrada:
// Ninguna.

// Proceso:
// Obtiene el contexto de autenticación y valida que se use dentro de AuthProvider.

// Salida:
// Retorna el valor del contexto de autenticación.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(UI_MESSAGES.AUTH_CONTEXT_ERROR);
  }
  return context;
}
