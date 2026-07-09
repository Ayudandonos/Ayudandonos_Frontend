const TOKEN_KEY = 'accessToken';
const REMEMBER_KEY = 'rememberSession';

// Entrada:
// token: JWT de acceso; remember: si persiste en localStorage o sessionStorage.

// Proceso:
// Guarda el token segun la preferencia de recordar sesion.

// Salida:
// No retorna valor.
export function saveAccessToken(token: string, remember: boolean): void {
  clearAccessToken();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  if (remember) {
    localStorage.setItem(REMEMBER_KEY, 'true');
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }
}

// Entrada:
// Ninguna.

// Proceso:
// Obtiene token desde localStorage o sessionStorage.

// Salida:
// Retorna token o null si no existe.
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

// Entrada:
// Ninguna.

// Proceso:
// Elimina token y preferencia de ambos storages.

// Salida:
// No retorna valor.
export function clearAccessToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}

// Entrada:
// Ninguna.

// Proceso:
// Determina si la sesion debe persistir en localStorage.

// Salida:
// Retorna true si rememberSession esta activo.
export function isRememberSession(): boolean {
  return localStorage.getItem(REMEMBER_KEY) === 'true';
}
