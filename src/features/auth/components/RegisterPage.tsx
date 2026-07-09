import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AuthFooter,
  AuthHeader,
  AuthSubmitButton,
} from '@/components/ui/AuthChrome';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useAuth, parseApiError } from '@/context/AuthContext';
import { ProfileRoleCard, type ProfileRole } from '@/features/auth/components/ProfileRoleCard';
import {
  registerFoundationSchema,
  registerUserSchema,
  type RegisterFoundationFormData,
  type RegisterUserFormData,
} from '@/features/auth/validations/auth.validations';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza registro segun prototipo con selector de rol e integracion API.

// Salida:
// Retorna el elemento JSX de la pagina de registro.
export function RegisterPage() {
  const navigate = useNavigate();
  const { registerUser, registerFoundation } = useAuth();
  const [role, setRole] = useState<ProfileRole>('USER');
  const [apiError, setApiError] = useState('');

  const userForm = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserSchema),
  });

  const foundationForm = useForm<RegisterFoundationFormData>({
    resolver: zodResolver(registerFoundationSchema),
  });

  const isSubmitting =
    role === 'USER' ? userForm.formState.isSubmitting : foundationForm.formState.isSubmitting;

  const handleRegisterError = (error: unknown) => {
    const parsed = parseApiError(error);
    if (parsed.status === 409) {
      setApiError(parsed.message || UI_MESSAGES.AUTH_EMAIL_EXISTS);
      return;
    }
    setApiError(parsed.message || UI_MESSAGES.AUTH_GENERIC_ERROR);
  };

  const onSubmitUser = async (data: RegisterUserFormData) => {
    setApiError('');
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });
      navigate('/', { replace: true });
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
      navigate('/', { replace: true });
    } catch (error) {
      handleRegisterError(error);
    }
  };

  return (
    <div className="auth-register-bg flex min-h-screen flex-col">
      <AuthHeader variant="register" />
      <div className="flex flex-1 animate-fade-in items-center justify-center px-6 py-12">
        <div className="w-full max-w-[672px]">
        <Card padding="none" className="overflow-hidden" hover={false}>
          <div className="space-y-2 px-8 pb-4 pt-8 text-center">
            <h1 className="text-display">{UI_MESSAGES.REGISTER_TITLE}</h1>
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
              <ProfileRoleCard role="USER" selected={role === 'USER'} onSelect={setRole} />
              <ProfileRoleCard
                role="FOUNDATION"
                selected={role === 'FOUNDATION'}
                onSelect={setRole}
              />
            </div>
          </div>
          {role === 'USER' ? (
            <form
              onSubmit={userForm.handleSubmit(onSubmitUser)}
              className="space-y-4 px-8 pb-8"
              noValidate
            >
              <Input
                label={UI_MESSAGES.REGISTER_FULL_NAME}
                placeholder={UI_MESSAGES.REGISTER_FULL_NAME_PLACEHOLDER}
                iconLeft="id-badge"
                filled
                error={userForm.formState.errors.fullName?.message}
                {...userForm.register('fullName')}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={UI_MESSAGES.REGISTER_EMAIL}
                  type="email"
                  autoComplete="email"
                  placeholder={UI_MESSAGES.REGISTER_EMAIL_PLACEHOLDER}
                  iconLeft="envelope"
                  filled
                  error={userForm.formState.errors.email?.message}
                  {...userForm.register('email')}
                />
                <Input
                  label={UI_MESSAGES.REGISTER_PHONE}
                  type="tel"
                  autoComplete="tel"
                  placeholder={UI_MESSAGES.REGISTER_PHONE_PLACEHOLDER}
                  iconLeft="phone"
                  filled
                  {...userForm.register('phone')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={UI_MESSAGES.REGISTER_PASSWORD}
                  type="password"
                  autoComplete="new-password"
                  filled
                  error={userForm.formState.errors.password?.message}
                  {...userForm.register('password')}
                />
                <Input
                  label={UI_MESSAGES.REGISTER_CONFIRM_PASSWORD}
                  type="password"
                  autoComplete="new-password"
                  filled
                  error={userForm.formState.errors.confirmPassword?.message}
                  {...userForm.register('confirmPassword')}
                />
              </div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 size-5 rounded border-border-default text-vivid-600 focus:ring-vivid-600"
                  {...userForm.register('acceptTerms')}
                />
                <span className="text-sm text-text-secondary">
                  {UI_MESSAGES.REGISTER_TERMS_PREFIX}{' '}
                  <Link to="/terminos-y-condiciones" className="font-bold text-vivid-700 hover:text-vivid-600">
                    {UI_MESSAGES.REGISTER_TERMS_LINK}
                  </Link>{' '}
                  {UI_MESSAGES.REGISTER_TERMS_AND}{' '}
                  <Link to="/politica-de-privacidad" className="font-bold text-vivid-700 hover:text-vivid-600">
                    {UI_MESSAGES.REGISTER_PRIVACY_LINK}
                  </Link>.
                </span>
              </label>
              {userForm.formState.errors.acceptTerms && (
                <p className="text-sm text-red-600" role="alert">
                  {userForm.formState.errors.acceptTerms.message}
                </p>
              )}
              {apiError && (
                <p className="text-sm text-red-600" role="alert">
                  {apiError}
                </p>
              )}
              <AuthSubmitButton
                isLoading={isSubmitting}
                label={UI_MESSAGES.REGISTER_SUBMIT}
                variant="register"
              />
            </form>
          ) : (
            <form
              onSubmit={foundationForm.handleSubmit(onSubmitFoundation)}
              className="space-y-4 px-8 pb-8"
              noValidate
            >
              <Input
                label={UI_MESSAGES.REGISTER_FULL_NAME}
                placeholder={UI_MESSAGES.REGISTER_FULL_NAME_PLACEHOLDER}
                iconLeft="id-badge"
                filled
                error={foundationForm.formState.errors.fullName?.message}
                {...foundationForm.register('fullName')}
              />
              <Input
                label={UI_MESSAGES.REGISTER_FOUNDATION_NAME}
                placeholder={UI_MESSAGES.REGISTER_FOUNDATION_NAME_PLACEHOLDER}
                iconLeft="building"
                filled
                error={foundationForm.formState.errors.foundationName?.message}
                {...foundationForm.register('foundationName')}
              />
              <Input
                label={UI_MESSAGES.REGISTER_FOUNDATION_DESCRIPTION}
                placeholder={UI_MESSAGES.REGISTER_FOUNDATION_DESCRIPTION_PLACEHOLDER}
                filled
                {...foundationForm.register('description')}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={UI_MESSAGES.REGISTER_EMAIL}
                  type="email"
                  autoComplete="email"
                  placeholder={UI_MESSAGES.REGISTER_EMAIL_PLACEHOLDER}
                  iconLeft="envelope"
                  filled
                  error={foundationForm.formState.errors.email?.message}
                  {...foundationForm.register('email')}
                />
                <Input
                  label={UI_MESSAGES.REGISTER_PHONE}
                  type="tel"
                  autoComplete="tel"
                  placeholder={UI_MESSAGES.REGISTER_PHONE_PLACEHOLDER}
                  iconLeft="phone"
                  filled
                  {...foundationForm.register('phone')}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label={UI_MESSAGES.REGISTER_PASSWORD}
                  type="password"
                  autoComplete="new-password"
                  filled
                  error={foundationForm.formState.errors.password?.message}
                  {...foundationForm.register('password')}
                />
                <Input
                  label={UI_MESSAGES.REGISTER_CONFIRM_PASSWORD}
                  type="password"
                  autoComplete="new-password"
                  filled
                  error={foundationForm.formState.errors.confirmPassword?.message}
                  {...foundationForm.register('confirmPassword')}
                />
              </div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 size-5 rounded border-border-default text-vivid-600 focus:ring-vivid-600"
                  {...foundationForm.register('acceptTerms')}
                />
                <span className="text-sm text-text-secondary">
                  {UI_MESSAGES.REGISTER_TERMS_PREFIX}{' '}
                  <Link to="/terminos-y-condiciones" className="font-bold text-vivid-700 hover:text-vivid-600">
                    {UI_MESSAGES.REGISTER_TERMS_LINK}
                  </Link>{' '}
                  {UI_MESSAGES.REGISTER_TERMS_AND}{' '}
                  <Link to="/politica-de-privacidad" className="font-bold text-vivid-700 hover:text-vivid-600">
                    {UI_MESSAGES.REGISTER_PRIVACY_LINK}
                  </Link>.
                </span>
              </label>
              {foundationForm.formState.errors.acceptTerms && (
                <p className="text-sm text-red-600" role="alert">
                  {foundationForm.formState.errors.acceptTerms.message}
                </p>
              )}
              {apiError && (
                <p className="text-sm text-red-600" role="alert">
                  {apiError}
                </p>
              )}
              <AuthSubmitButton
                isLoading={isSubmitting}
                label={UI_MESSAGES.REGISTER_SUBMIT}
                variant="register"
              />
            </form>
          )}
          <div className="border-t border-border-default bg-primary-50/50 px-4 py-4 text-center">
            <p className="text-base text-text-secondary">
              {UI_MESSAGES.REGISTER_HAS_ACCOUNT}{' '}
              <Link
                to="/login"
                className="font-bold text-primary-700 transition-smooth hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
              >
                {UI_MESSAGES.REGISTER_LOGIN_LINK}
              </Link>
            </p>
          </div>
        </Card>
        </div>
      </div>
      <AuthFooter variant="simple" />
    </div>
  );
}
