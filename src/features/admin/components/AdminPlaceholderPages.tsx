import { UI_MESSAGES } from '@/constants/messages.constants';
import { AdminSectionPlaceholderPage } from '@/features/admin/components/AdminSectionPlaceholderPage';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza placeholder del modulo administrativo de campanas.
 * Salida: Retorna el elemento JSX de la pagina.
 */
export function AdminCampaignsPlaceholderPage() {
  return (
    <AdminSectionPlaceholderPage
      title={UI_MESSAGES.ADMIN_CAMPAIGNS_PAGE_TITLE}
      description={UI_MESSAGES.ADMIN_CAMPAIGNS_PAGE_DESCRIPTION}
    />
  );
}

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza placeholder del modulo administrativo de usuarios.
 * Salida: Retorna el elemento JSX de la pagina.
 */
export function AdminUsersPlaceholderPage() {
  return (
    <AdminSectionPlaceholderPage
      title={UI_MESSAGES.ADMIN_USERS_PAGE_TITLE}
      description={UI_MESSAGES.ADMIN_USERS_PAGE_DESCRIPTION}
    />
  );
}

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza placeholder del modulo administrativo de reportes.
 * Salida: Retorna el elemento JSX de la pagina.
 */
export function AdminReportsPlaceholderPage() {
  return (
    <AdminSectionPlaceholderPage
      title={UI_MESSAGES.ADMIN_REPORTS_PAGE_TITLE}
      description={UI_MESSAGES.ADMIN_REPORTS_PAGE_DESCRIPTION}
    />
  );
}

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza placeholder del perfil del administrador.
 * Salida: Retorna el elemento JSX de la pagina.
 */
export function AdminProfilePlaceholderPage() {
  return (
    <AdminSectionPlaceholderPage
      title={UI_MESSAGES.ADMIN_PROFILE_PAGE_TITLE}
      description={UI_MESSAGES.ADMIN_PROFILE_PAGE_DESCRIPTION}
    />
  );
}
