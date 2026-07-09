import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFooter, AuthHeader, FigmaInput } from '@/components/ui/AuthChrome';
import { FIGMA_ASSETS } from '@/constants/figma-assets.constants';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useAuth, parseApiError } from '@/context/AuthContext';
import {
  registerFoundationSchema,
  registerUserSchema,
  type RegisterFoundationFormData,
  type RegisterUserFormData,
} from '@/features/auth/validations/auth.validations';
import { cn } from '@/utils/cn';

type RegisterRole = 'USER' | 'FOUNDATION';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza registro segun Figma con selector de rol e integracion API.

// Salida:
// Retorna el elemento JSX de la pagina de registro.
export function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser, registerFoundation } = useAuth();
  const [role, setRole] = useState<RegisterRole>('USER');
  const [apiError, setApiError] = useState('');

  const userForm = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  const foundationForm = useForm<RegisterFoundationFormData>({
    resolver: zodResolver(registerFoundationSchema),
  });

  const isSubmitting =
    role === 'USER' ? userForm.formState.isSubmitting : foundationForm.formState.isSubmitting;

  const onSubmitUser = async (data: RegisterUserFormData) => {
    setApiError('');
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
      navigate('/campaigns', { replace: true });
    } catch (error) {
      handleRegisterError(error);
    }
  };

  const onSubmitFoundation = async (data: RegisterFoundationFormData) => {
    setApiError('');
    try {
      await registerFoundation({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        foundationName: data.foundationName,
        description: data.description,
      });
      navigate('/foundation/requests', { replace: true });
    } catch (error) {
      handleRegisterError(error);
    }
  };

  const handleRegisterError = (error: unknown) => {
    const parsed = parseApiError(error);
    if (parsed.status === 409) {
      setApiError(parsed.message || UI_MESSAGES.AUTH_EMAIL_EXISTS);
      return;
    }
    setApiError(parsed.message || UI_MESSAGES.AUTH_GENERIC_ERROR);
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-page">
      <AuthHeader variant="register" />
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[672px] overflow-hidden rounded-xl border border-border-default bg-white shadow-[var(--shadow-auth-card)]">
          <div className="space-y-2 px-8 pb-4 pt-8 text-center">
            <h1 className="text-[32px] font-bold text-text-primary">{UI_MESSAGES.REGISTER_TITLE}</h1>
            <p className="text-base text-text-secondary">
              {UI_MESSAGES.REGISTER_SUBTITLE_1}
              <br />
              {UI_MESSAGES.REGISTER_SUBTITLE_2}
            </p>
          </div>
          <div className="px-8 pb-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text-muted">
              {UI_MESSAGES.REGISTER_PROFILE_LABEL}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRole('USER')}
                className={cn(
                  'flex items-center gap-4 rounded-xl border-2 p-[18px] text-left transition-colors',
                  role === 'USER'
                    ? 'border-vivid-600 bg-vivid-200 shadow-[0_0_0_2px_rgba(102,70,255,0.2)]'
                    : 'border-border-default',
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vivid-600 text-white">
                  D
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{UI_MESSAGES.REGISTER_DONOR_TITLE}</p>
                  <p className="text-sm text-text-secondary">
                    {UI_MESSAGES.REGISTER_DONOR_DESC_1}
                    <br />
                    {UI_MESSAGES.REGISTER_DONOR_DESC_2}
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setRole('FOUNDATION')}
                className={cn(
                  'flex items-center gap-4 rounded-xl border-2 p-[18px] text-left transition-colors',
                  role === 'FOUNDATION'
                    ? 'border-vivid-600 bg-vivid-200 shadow-[0_0_0_2px_rgba(102,70,255,0.2)]'
                    : 'border-border-default',
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vivid-500 text-white">
                  F
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {UI_MESSAGES.REGISTER_FOUNDATION_TITLE}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {UI_MESSAGES.REGISTER_FOUNDATION_DESC_1}
                    <br />
                    {UI_MESSAGES.REGISTER_FOUNDATION_DESC_2}
                  </p>
                </div>
              </button>
            </div>
          </div>
          {role === 'USER' ? (
            <form onSubmit={userForm.handleSubmit(onSubmitUser)} className="space-y-4 px-8 pb-8">
              <FigmaInput
                label={UI_MESSAGES.REGISTER_FULL_NAME}
                placeholder={UI_MESSAGES.REGISTER_FULL_NAME_PLACEHOLDER}
                iconSrc={FIGMA_ASSETS.ICON_MAIL}
                variant="default"
                error={userForm.formState.errors.fullName?.message}
                {...userForm.register('fullName')}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FigmaInput
                  label={UI_MESSAGES.REGISTER_EMAIL}
                  type="email"
                  placeholder={UI_MESSAGES.REGISTER_EMAIL_PLACEHOLDER}
                  iconSrc={FIGMA_ASSETS.ICON_MAIL}
                  variant="default"
                  error={userForm.formState.errors.email?.message}
                  {...userForm.register('email')}
                />
                <FigmaInput
                  label={UI_MESSAGES.REGISTER_PHONE}
                  placeholder={UI_MESSAGES.REGISTER_PHONE_PLACEHOLDER}
                  variant="default"
                  {...userForm.register('phone')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FigmaInput
                  label={UI_MESSAGES.REGISTER_PASSWORD}
                  type="password"
                  iconSrc={FIGMA_ASSETS.ICON_LOCK}
                  variant="default"
                  error={userForm.formState.errors.password?.message}
                  {...userForm.register('password')}
                />
                <FigmaInput
                  label={UI_MESSAGES.REGISTER_CONFIRM_PASSWORD}
                  type="password"
                  iconSrc={FIGMA_ASSETS.ICON_LOCK}
                  variant="default"
                  error={userForm.formState.errors.confirmPassword?.message}
                  {...userForm.register('confirmPassword')}
                />
              </div>
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 size-5 rounded border-border-default" {...userForm.register('acceptTerms')} />
                <span className="text-sm text-text-secondary">
                  {UI_MESSAGES.REGISTER_TERMS_PREFIX}{' '}
                  <span className="font-bold text-vivid-700">{UI_MESSAGES.REGISTER_TERMS_LINK}</span>{' '}
                  {UI_MESSAGES.REGISTER_TERMS_AND}{' '}
                  <span className="font-bold text-vivid-700">{UI_MESSAGES.REGISTER_PRIVACY_LINK}</span>.
                </span>
              </label>
              {userForm.formState.errors.acceptTerms && (
                <p className="text-sm text-red-600">{userForm.formState.errors.acceptTerms.message}</p>
              )}
              {apiError && <p className="text-sm text-red-600">{apiError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-vivid-600 py-4 text-lg font-bold text-white shadow-[var(--shadow-button)] disabled:opacity-50"
              >
                {isSubmitting ? UI_MESSAGES.LOADING : UI_MESSAGES.REGISTER_SUBMIT}
              </button>
            </form>
          ) : (
            <form onSubmit={foundationForm.handleSubmit(onSubmitFoundation)} className="space-y-4 px-8 pb-8">
              <FigmaInput
                label={UI_MESSAGES.REGISTER_FULL_NAME}
                placeholder={UI_MESSAGES.REGISTER_FULL_NAME_PLACEHOLDER}
                variant="default"
                error={foundationForm.formState.errors.fullName?.message}
                {...foundationForm.register('fullName')}
              />
              <FigmaInput
                label={UI_MESSAGES.REGISTER_FOUNDATION_NAME}
                placeholder={UI_MESSAGES.REGISTER_FOUNDATION_NAME_PLACEHOLDER}
                variant="default"
                error={foundationForm.formState.errors.foundationName?.message}
                {...foundationForm.register('foundationName')}
              />
              <FigmaInput
                label={UI_MESSAGES.REGISTER_FOUNDATION_DESCRIPTION}
                placeholder={UI_MESSAGES.REGISTER_FOUNDATION_DESCRIPTION_PLACEHOLDER}
                variant="default"
                {...foundationForm.register('description')}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FigmaInput
                  label={UI_MESSAGES.REGISTER_EMAIL}
                  type="email"
                  placeholder={UI_MESSAGES.REGISTER_EMAIL_PLACEHOLDER}
                  variant="default"
                  error={foundationForm.formState.errors.email?.message}
                  {...foundationForm.register('email')}
                />
                <FigmaInput
                  label={UI_MESSAGES.REGISTER_PHONE}
                  placeholder={UI_MESSAGES.REGISTER_PHONE_PLACEHOLDER}
                  variant="default"
                  {...foundationForm.register('phone')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FigmaInput
                  label={UI_MESSAGES.REGISTER_PASSWORD}
                  type="password"
                  variant="default"
                  error={foundationForm.formState.errors.password?.message}
                  {...foundationForm.register('password')}
                />
                <FigmaInput
                  label={UI_MESSAGES.REGISTER_CONFIRM_PASSWORD}
                  type="password"
                  variant="default"
                  error={foundationForm.formState.errors.confirmPassword?.message}
                  {...foundationForm.register('confirmPassword')}
                />
              </div>
              <label className="flex items-start gap-3">
                <input type="checkbox" className="mt-1 size-5 rounded border-border-default" {...foundationForm.register('acceptTerms')} />
                <span className="text-sm text-text-secondary">
                  {UI_MESSAGES.REGISTER_TERMS_PREFIX}{' '}
                  <span className="font-bold text-vivid-700">{UI_MESSAGES.REGISTER_TERMS_LINK}</span>{' '}
                  {UI_MESSAGES.REGISTER_TERMS_AND}{' '}
                  <span className="font-bold text-vivid-700">{UI_MESSAGES.REGISTER_PRIVACY_LINK}</span>.
                </span>
              </label>
              {apiError && <p className="text-sm text-red-600">{apiError}</p>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-vivid-600 py-4 text-lg font-bold text-white shadow-[var(--shadow-button)] disabled:opacity-50"
              >
                {isSubmitting ? UI_MESSAGES.LOADING : UI_MESSAGES.REGISTER_SUBMIT}
              </button>
            </form>
          )}
          <div className="border-t border-border-default bg-vivid-100 px-4 py-4 text-center">
            <p className="text-base text-text-secondary">
              {UI_MESSAGES.REGISTER_HAS_ACCOUNT}{' '}
              <Link to="/login" className="font-bold text-vivid-700">
                {UI_MESSAGES.REGISTER_LOGIN_LINK}
              </Link>
            </p>
          </div>
        </div>
      </div>
      <AuthFooter variant="simple" />
    </div>
  );
}
