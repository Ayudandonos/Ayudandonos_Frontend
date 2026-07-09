import { Outlet } from 'react-router-dom';

// Entrada:
// Ninguna.

// Proceso:
// Contenedor minimo para rutas de autenticacion; cada pagina define su layout Figma.

// Salida:
// Retorna outlet sin envoltorio adicional.
export function AuthLayout() {
  return <Outlet />;
}
