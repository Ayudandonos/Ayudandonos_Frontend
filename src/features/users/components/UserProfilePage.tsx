import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppImage } from '@/components/ui/AppImage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useAuth } from '@/context/useAuth';
import { DonorStatsPanel } from '@/features/users/components/DonorStatsPanel';
import { UserProfileSkeleton } from '@/features/users/components/UserProfileSkeleton';
import { usersService } from '@/features/users/services/users.service';
import type { UserProfile } from '@/features/users/types/users.types';
import {
  userProfileSchema,
  type UserProfileFormData,
} from '@/features/users/validations/users.validations';
import { parseApiError } from '@/utils/api-error';

/**
 * Entrada: profile: datos del usuario desde la API.
 * Proceso: Mapea valores nulos a cadenas vacias para el formulario.
 * Salida: Retorna valores por defecto de React Hook Form.
 */
function toFormDefaults(profile: UserProfile): UserProfileFormData {
  return {
    fullName: profile.fullName,
    phone: profile.phone ?? '',
    city: profile.city ?? '',
    department: profile.department ?? '',
    bio: profile.bio ?? '',
    avatarUrl: profile.avatarUrl ?? '',
  };
}

/**
 * Entrada: Ninguna (usuario autenticado con rol USER).
 * Proceso: Carga GET /users/me, edita con PATCH y muestra estadisticas de donante.
 * Salida: Retorna el elemento JSX de perfil de donante.
 */
export function UserProfilePage() {
  const { role, fetchMe } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      city: '',
      department: '',
      bio: '',
      avatarUrl: '',
    },
  });

  const bioValue = watch('bio') ?? '';

  /**
   * Entrada: Ninguna.
   * Proceso: Solicita perfil al backend y sincroniza el formulario.
   * Salida: No retorna valor.
   */
  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setApiError('');
    try {
      const data = await usersService.fetchMyProfile();
      setProfile(data);
      reset(toFormDefaults(data));
    } catch (error) {
      setApiError(parseApiError(error).message || UI_MESSAGES.USER_PROFILE_LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [reset]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  /**
   * Entrada: data: formulario validado.
   * Proceso: Envia PATCH /users/me y refresca sesion global.
   * Salida: No retorna valor.
   */
  async function onSubmit(data: UserProfileFormData) {
    setApiError('');
    setSuccessMessage('');
    try {
      const updated = await usersService.updateMyProfile({
        fullName: data.fullName,
        phone: data.phone || null,
        city: data.city || null,
        department: data.department || null,
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
      });
      setProfile(updated);
      reset(toFormDefaults(updated));
      setSuccessMessage(UI_MESSAGES.USER_PROFILE_SAVED);
      await fetchMe();
    } catch (error) {
      setApiError(parseApiError(error).message || UI_MESSAGES.AUTH_GENERIC_ERROR);
    }
  }

  if (isLoading) {
    return <UserProfileSkeleton />;
  }

  if (!profile) {
    return (
      <Card glass={false} className="border border-border-default bg-white p-6">
        <p className="text-sm text-red-700" role="alert">
          {apiError || UI_MESSAGES.USER_PROFILE_LOAD_ERROR}
        </p>
        <Button type="button" variant="secondary" className="mt-4" onClick={() => void loadProfile()}>
          {UI_MESSAGES.EMPTY_STATE_RETRY}
        </Button>
      </Card>
    );
  }

  const avatarSrc = profile.avatarUrl?.trim() || undefined;
  const showStats = role === 'USER';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-display text-text-primary">{UI_MESSAGES.USER_PROFILE_TITLE}</h1>
        <p className="mt-2 text-body text-text-secondary">{UI_MESSAGES.USER_PROFILE_DESCRIPTION}</p>
      </header>

      {successMessage && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700" role="status">
          {successMessage}
        </p>
      )}

      {apiError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {apiError}
        </p>
      )}

      <Card glass={false} className="border border-border-default bg-white p-6">
        <form className="space-y-6" onSubmit={(event) => void handleSubmit(onSubmit)(event)} noValidate>
          <div className="flex flex-wrap items-center gap-4">
            {avatarSrc ? (
              <AppImage
                src={avatarSrc}
                alt=""
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-vivid-200 text-xl font-semibold text-vivid-700">
                {profile.fullName.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Input
                label={UI_MESSAGES.USER_PROFILE_EMAIL}
                value={profile.email}
                readOnly
                disabled
              />
            </div>
          </div>

          <Input
            label={UI_MESSAGES.USER_PROFILE_FULL_NAME}
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={UI_MESSAGES.USER_PROFILE_PHONE}
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label={UI_MESSAGES.USER_PROFILE_CITY}
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label={UI_MESSAGES.USER_PROFILE_DEPARTMENT}
              error={errors.department?.message}
              {...register('department')}
            />
            <Input
              label={UI_MESSAGES.USER_PROFILE_AVATAR_URL}
              error={errors.avatarUrl?.message}
              {...register('avatarUrl')}
            />
          </div>

          <div>
            <label htmlFor="user-bio" className="mb-1 block text-sm font-medium text-text-primary">
              {UI_MESSAGES.USER_PROFILE_BIO}
            </label>
            <textarea
              id="user-bio"
              rows={4}
              className="w-full rounded-lg border border-border-default bg-white px-3 py-2 text-sm text-text-primary focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              aria-invalid={!!errors.bio}
              {...register('bio')}
            />
            <div className="mt-1 flex justify-between text-xs text-text-muted">
              {errors.bio?.message ? (
                <span className="text-red-600">{errors.bio.message}</span>
              ) : (
                <span />
              )}
              <span>{UI_MESSAGES.USER_PROFILE_BIO_COUNTER(bioValue.length, 500)}</span>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {UI_MESSAGES.USER_PROFILE_SAVE}
          </Button>
        </form>
      </Card>

      {showStats && <DonorStatsPanel stats={profile.donationStats} />}
    </div>
  );
}
