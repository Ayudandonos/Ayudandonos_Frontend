const TOKEN_KEY = 'accessToken';
const REMEMBER_KEY = 'rememberSession';

// Entrada:
// token: JWT de acceso; remember: si persiste en localStorage.

// Proceso:
// Guarda el token en localStorage o sessionStorage segun preferencia de recordar sesion.

// Salida:
// No retorna valor.
export function saveAccessToken(token: string, remember: boolean): void {
  localStorage.setItem(REMEMBER_KEY, remember ? 'true' : 'false');
  if (remember) {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.setItem(TOKEN_KEY, token);
}

// Entrada:
// Ninguna.

// Proceso:
// Lee el token desde localStorage o sessionStorage.

// Salida:
// Retorna el token o null si no existe.
export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY);
}

// Entrada:
// Ninguna.

// Proceso:
// Elimina el token y la preferencia de recordar sesion.

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
