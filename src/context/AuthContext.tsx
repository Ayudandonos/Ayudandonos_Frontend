import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import type { Foundation, User, UserRole } from '@/types';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { authService } from '@/features/auth/services/auth.service';
import type {
  RegisterFoundationPayload,
  RegisterUserPayload,
} from '@/features/auth/services/auth.service';
import { parseApiError } from '@/utils/api-error';
import { saveAccessToken, clearAccessToken, getAccessToken } from '@/utils/auth-storage';

interface AuthContextValue {
  user: User | null;
  foundation: Foundation | null;
  accessToken: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<User>;
  logout: () => Promise<void>;
  registerUser: (payload: RegisterUserPayload) => Promise<User>;
  registerFoundation: (payload: RegisterFoundationPayload) => Promise<User>;
  fetchMe: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

// Entrada:
// authData: respuesta de login o registro; remember: persistencia de sesion.

// Proceso:
// Guarda token y actualiza estado de usuario y fundacion.

// Salida:
// Retorna el usuario autenticado.
function applyAuthSession(
  authData: { accessToken: string; user: User; foundation?: Foundation },
  remember: boolean,
  setUser: (u: User | null) => void,
  setFoundation: (f: Foundation | null) => void,
  setAccessToken: (t: string | null) => void,
): User {
  saveAccessToken(authData.accessToken, remember);
  setAccessToken(authData.accessToken);
  setUser(authData.user);
  setFoundation(authData.foundation ?? null);
  return authData.user;
}

// Entrada:
// children: componentes hijos.

// Proceso:
// Gestiona sesion JWT, login, registro, logout y restauracion desde storage.

// Salida:
// Retorna el proveedor de contexto de autenticacion.
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [foundation, setFoundation] = useState<Foundation | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getAccessToken());
  const [isLoading, setIsLoading] = useState(true);

  // Entrada:
  // Ninguna.

  // Proceso:
  // Restaura sesion desde token almacenado llamando GET /auth/me.

  // Salida:
  // Actualiza estado de usuario o limpia sesion invalida.
  const fetchMe = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const me = await authService.fetchMe();
      setUser(me.user);
      setFoundation(me.foundation ?? null);
      setAccessToken(token);
    } catch {
      clearAccessToken();
      setUser(null);
      setFoundation(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  // Entrada:
  // email, password, remember: credenciales y preferencia de sesion.

  // Proceso:
  // Autentica contra POST /auth/login.

  // Salida:
  // Retorna el usuario autenticado.
  const login = useCallback(async (email: string, password: string, remember = true) => {
    const data = await authService.login({ email, password });
    return applyAuthSession(data, remember, setUser, setFoundation, setAccessToken);
  }, []);

  // Entrada:
  // payload: datos de registro de donante.

  // Proceso:
  // Registra via POST /auth/register/user y establece sesion.

  // Salida:
  // Retorna el usuario creado.
  const registerUser = useCallback(async (payload: RegisterUserPayload) => {
    const data = await authService.registerUser(payload);
    return applyAuthSession(data, true, setUser, setFoundation, setAccessToken);
  }, []);

  // Entrada:
  // payload: datos de registro de fundacion.

  // Proceso:
  // Registra via POST /auth/register/foundation y establece sesion.

  // Salida:
  // Retorna el usuario creado.
  const registerFoundation = useCallback(async (payload: RegisterFoundationPayload) => {
    const data = await authService.registerFoundation(payload);
    return applyAuthSession(data, true, setUser, setFoundation, setAccessToken);
  }, []);

  // Entrada:
  // Ninguna.

  // Proceso:
  // Invalida sesion en backend y limpia estado local.

  // Salida:
  // No retorna valor.
  const logout = useCallback(async () => {
    try {
      if (getAccessToken()) await authService.logout();
    } finally {
      clearAccessToken();
      setUser(null);
      setFoundation(null);
      setAccessToken(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        foundation,
        accessToken,
        role: user?.role ?? null,
        isAuthenticated: !!user && !!accessToken,
        isLoading,
        login,
        logout,
        registerUser,
        registerFoundation,
        fetchMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Entrada:
// Ninguna.

// Proceso:
// Obtiene el contexto de autenticacion.

// Salida:
// Retorna el valor del contexto o lanza error si falta el provider.
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(UI_MESSAGES.AUTH_CONTEXT_ERROR);
  }
  return context;
}

export { parseApiError };
