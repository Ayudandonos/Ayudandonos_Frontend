import { Link, useLocation } from 'react-router-dom';
import { FIGMA_ASSETS } from '@/constants/figma-assets.constants';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/utils/cn';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  path: string;
  roles: UserRole[];
}

const USER_NAV: NavItem[] = [
  { label: UI_MESSAGES.NAV_CAMPAIGNS, path: '/campaigns', roles: ['USER', 'FOUNDATION', 'ADMIN'] },
  { label: UI_MESSAGES.NAV_MY_COMMITMENTS, path: '/my-donations', roles: ['USER'] },
  { label: UI_MESSAGES.NAV_FOUNDATIONS, path: '/campaigns', roles: ['USER'] },
  { label: UI_MESSAGES.NAV_PROFILE, path: '/campaigns', roles: ['USER', 'FOUNDATION', 'ADMIN'] },
];

const FOUNDATION_NAV: NavItem[] = [
  { label: UI_MESSAGES.NAV_CAMPAIGNS, path: '/campaigns', roles: ['FOUNDATION'] },
  { label: UI_MESSAGES.NAV_CREATE_CAMPAIGN, path: '/foundation/campaigns/new', roles: ['FOUNDATION'] },
  { label: UI_MESSAGES.NAV_NEEDS, path: '/foundation/needs/new', roles: ['FOUNDATION'] },
  { label: UI_MESSAGES.NAV_REQUESTS, path: '/foundation/requests', roles: ['FOUNDATION'] },
  { label: UI_MESSAGES.NAV_DELIVERIES, path: '/foundation/deliveries/schedule', roles: ['FOUNDATION'] },
];

// Entrada:
// Ninguna.

// Proceso:
// Renderiza barra lateral de 256px con navegacion segun rol del usuario.

// Salida:
// Retorna el elemento JSX del SideNav.
export function SideNav() {
  const { role, logout } = useAuth();
  const location = useLocation();

  const items =
    role === 'FOUNDATION'
      ? FOUNDATION_NAV
      : USER_NAV.filter((item) => role && item.roles.includes(role));

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border-default bg-vivid-50">
      <div className="flex h-16 items-center gap-3 border-b border-border-default px-6">
        <img src={FIGMA_ASSETS.LOGO} alt="" className="h-8 w-8" />
        <span className="text-xl font-bold text-vivid-700">{UI_MESSAGES.APP_NAME}</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {items.map((item) => (
          <Link
            key={item.path + item.label}
            to={item.path}
            className={cn(
              'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              isActive(item.path)
                ? 'bg-vivid-200 font-semibold text-vivid-700'
                : 'text-text-secondary hover:bg-vivid-100',
            )}
          >
            {item.label}
          </Link>
        ))}
        {role === 'USER' && (
          <Link
            to="/campaigns"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-vivid-700 px-4 py-3 text-sm font-medium text-white"
          >
            + {UI_MESSAGES.NAV_NEW_DONATION}
          </Link>
        )}
      </nav>
      <div className="border-t border-border-default p-4">
        <p className="mb-2 px-4 py-2 text-sm text-text-secondary">{UI_MESSAGES.NAV_SETTINGS}</p>
        <button
          type="button"
          onClick={() => void logout()}
          className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
        >
          {UI_MESSAGES.NAV_LOGOUT}
        </button>
      </div>
    </aside>
  );
}

// Entrada:
// Ninguna.

// Proceso:
// Renderiza header superior de 64px con busqueda y avatar.

// Salida:
// Retorna el elemento JSX del header del dashboard.
export function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border-default bg-white px-6">
      <div className="mx-auto flex w-full max-w-3xl items-center">
        <input
          type="search"
          placeholder={UI_MESSAGES.GLOBAL_SEARCH_PLACEHOLDER}
          className="w-full rounded-full border border-border-default bg-vivid-50 px-4 py-2 text-sm text-text-secondary placeholder:text-text-muted focus:border-vivid-600 focus:outline-none"
          readOnly
        />
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-vivid-200 text-sm font-semibold text-vivid-700">
          {user?.fullName?.charAt(0) ?? 'U'}
        </div>
      </div>
    </header>
  );
}
