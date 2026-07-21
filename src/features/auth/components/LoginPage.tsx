import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AuthFooter,
  AuthHeader,
  AuthPasswordField,
  AuthSubmitButton,
} from '@/components/ui/AuthChrome';
import { AppImage } from '@/components/ui/AppImage';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { FIGMA_ASSETS } from '@/constants/figma-assets.constants';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useAuth } from '@/context/useAuth';
import { parseApiError } from '@/utils/api-error';
import { canFoundationOperate } from '@/utils/foundation-access';
import { loginSchema, type LoginFormData } from '@/features/auth/validations/auth.validations';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza pantalla de login con sistema de diseno glass e integra POST /auth/login.
 * Salida: Retorna el elemento JSX de la pagina de login.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true },
  });

  /**
   * Entrada: data: credenciales validadas del formulario de login.
   * Proceso: Autentica al usuario y redirige segun su rol en la aplicacion.
   * Salida: No retorna valor; navega a la ruta correspondiente o muestra error.
   */
  const onSubmit = async (data: LoginFormData) => {
    setApiError('');
    try {
      const { user, foundation } = await login(data.email, data.password, data.remember ?? true);
      const redirect =
        user.role === 'ADMIN'
          ? '/admin/foundations'
          : user.role === 'FOUNDATION'
            ? canFoundationOperate(foundation)
              ? '/foundation/requests'
              : '/foundation/profile'
            : '/campaigns';
      navigate(redirect, { replace: true });
    } catch (error) {
      const parsed = parseApiError(error);
      if (parsed.status === 401) {
        setApiError(parsed.message || UI_MESSAGES.AUTH_INVALID_CREDENTIALS);
      } else if (parsed.status === 403) {
        setApiError(parsed.message || UI_MESSAGES.AUTH_ACCOUNT_DISABLED);
      } else {
        Object.entries(parsed.fieldErrors).forEach(([field, message]) => {
          setError(field as keyof LoginFormData, { message });
        });
        setApiError(parsed.message || UI_MESSAGES.AUTH_GENERIC_ERROR);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AuthHeader variant="login" />
      <div className="flex flex-1 animate-fade-in items-center justify-center px-6 py-16 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10 lg:flex-row lg:gap-16">
          <section className="flex flex-1 flex-col items-center gap-8 lg:items-start">
            <AppImage
              src={FIGMA_ASSETS.HERO_ILLUSTRATION}
              alt=""
              width={448}
              height={448}
              className="aspect-square w-full max-w-[448px]"
            />
            <div className="w-full max-w-lg space-y-4 text-center lg:text-left">
              <h1 className="text-display">
                {UI_MESSAGES.LOGIN_HERO_TITLE_1}
                <br />
                <span className="text-primary-700">{UI_MESSAGES.LOGIN_HERO_HIGHLIGHT}</span>
              </h1>
              <p className="text-body">{UI_MESSAGES.LOGIN_HERO_DESCRIPTION}</p>
            </div>
          </section>
          <section className="w-full max-w-[440px]">
            <Card padding="md" hover={false}>
              <div className="mb-6">
                <h2 className="text-heading">{UI_MESSAGES.LOGIN_TITLE}</h2>
                <p className="mt-1 text-caption">{UI_MESSAGES.LOGIN_SUBTITLE}</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <Input
                  label={UI_MESSAGES.LOGIN_EMAIL_LABEL}
                  type="email"
                  autoComplete="email"
                  placeholder={UI_MESSAGES.LOGIN_EMAIL_PLACEHOLDER}
                  iconLeft="envelope"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-label">{UI_MESSAGES.LOGIN_PASSWORD_LABEL}</span>
                    <span
                      className="cursor-not-allowed text-xs font-semibold text-primary-700 opacity-70"
                      aria-disabled="true"
                      title={UI_MESSAGES.LOGIN_FORGOT_PASSWORD_ARIA}
                    >
                      {UI_MESSAGES.LOGIN_FORGOT_PASSWORD}
                    </span>
                  </div>
                  <AuthPasswordField
                    autoComplete="current-password"
                    placeholder={UI_MESSAGES.LOGIN_PASSWORD_PLACEHOLDER}
                    showPassword={showPassword}
                    onToggle={() => setShowPassword((v) => !v)}
                    error={errors.password?.message}
                    {...register('password')}
                  />
                </div>
                <label className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-border-default text-primary-600 focus:ring-primary-600"
                    {...register('remember')}
                  />
                  <span className="text-caption">{UI_MESSAGES.LOGIN_REMEMBER}</span>
                </label>
                {apiError && (
                  <p className="text-sm text-error-500" role="alert">
                    {apiError}
                  </p>
                )}
                <AuthSubmitButton
                  isLoading={isSubmitting}
                  label={UI_MESSAGES.LOGIN_SUBMIT}
                  variant="login"
                />
                <p className="pt-2 text-center text-caption">
                  {UI_MESSAGES.LOGIN_NO_ACCOUNT}{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-primary-700 transition-smooth hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    {UI_MESSAGES.LOGIN_REGISTER_LINK}
                  </Link>
                </p>
              </form>
            </Card>
          </section>
        </div>
      </div>
      <AuthFooter variant="full" />
    </div>
  );
}
