import { UserProfilePage } from '@/features/users/components/UserProfilePage';

/**
 * Entrada: Ninguna (usuario autenticado con rol ADMIN).
 * Proceso: Reutiliza el formulario de perfil propio sobre GET/PATCH /users/me.
 * Salida: Retorna el elemento JSX del perfil administrativo editable.
 */
export function AdminProfilePage() {
  return <UserProfilePage />;
}
