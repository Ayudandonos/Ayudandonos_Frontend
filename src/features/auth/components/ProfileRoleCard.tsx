import { Icon } from '@/components/ui/Icon';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { cn } from '@/utils/cn';

export type ProfileRole = 'USER' | 'FOUNDATION';

interface ProfileRoleCardProps {
  role: ProfileRole;
  selected: boolean;
  onSelect: (role: ProfileRole) => void;
}

// Entrada:
// role, selected y onSelect para tarjeta de perfil.

// Proceso:
// Renderiza tarjeta glass de seleccion de perfil donante o fundacion.

// Salida:
// Retorna el elemento JSX de la tarjeta de perfil.
export function ProfileRoleCard({ role, selected, onSelect }: ProfileRoleCardProps) {
  const isDonor = role === 'USER';

  return (
    <button
      type="button"
      onClick={() => onSelect(role)}
      aria-pressed={selected}
      aria-label={isDonor ? UI_MESSAGES.REGISTER_DONOR_ARIA : UI_MESSAGES.REGISTER_FOUNDATION_ARIA}
      className={cn(
        'flex items-center gap-4 rounded-[var(--radius-lg)] border-2 p-[18px] text-left transition-smooth interactive-scale',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2',
        selected
          ? 'glass border-primary-600 shadow-[0_0_0_2px_rgba(102,70,255,0.15)]'
          : 'border-border-default bg-white/50 hover:border-primary-300 hover:bg-white/80',
      )}
    >
      <div
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-smooth',
          isDonor ? 'bg-primary-600 text-white' : 'bg-primary-500 text-white',
        )}
      >
        <Icon name={isDonor ? 'user' : 'building'} size="lg" decorative />
      </div>
      <div>
        <p className="font-semibold text-text-primary">
          {isDonor ? UI_MESSAGES.REGISTER_DONOR_TITLE : UI_MESSAGES.REGISTER_FOUNDATION_TITLE}
        </p>
        <p className="text-caption">
          {isDonor ? (
            <>
              {UI_MESSAGES.REGISTER_DONOR_DESC_1}
              <br />
              {UI_MESSAGES.REGISTER_DONOR_DESC_2}
            </>
          ) : (
            <>
              {UI_MESSAGES.REGISTER_FOUNDATION_DESC_1}
              <br />
              {UI_MESSAGES.REGISTER_FOUNDATION_DESC_2}
            </>
          )}
        </p>
      </div>
    </button>
  );
}
