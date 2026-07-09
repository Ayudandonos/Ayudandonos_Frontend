import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFooter, AuthHeader, FigmaInput } from '@/components/ui/AuthChrome';
import { FIGMA_ASSETS } from '@/constants/figma-assets.constants';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useAuth, parseApiError } from '@/context/AuthContext';
import { loginSchema, type LoginFormData } from '@/features/auth/validations/auth.validations';

// Entrada:
// Ninguna.

// Proceso:
// Renderiza pantalla de login segun Figma e integra POST /auth/login.

// Salida:
// Retorna el elemento JSX de la pagina de login.
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

  const onSubmit = async (data: LoginFormData) => {
    setApiError('');
    try {
      const user = await login(data.email, data.password, data.remember ?? true);
      const redirect =
        user.role === 'FOUNDATION' ? '/foundation/requests' : '/campaigns';
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
    <div className="flex min-h-screen flex-col bg-surface-page">
      <AuthHeader variant="login" />
      <div className="flex flex-1 items-center justify-center px-6 py-16 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-10 lg:flex-row lg:gap-10">
          <section className="flex flex-1 flex-col gap-6">
            <img
              src={FIGMA_ASSETS.HERO_ILLUSTRATION}
              alt=""
              className="aspect-square max-h-[448px] max-w-[448px] object-contain"
            />
            <div className="space-y-4">
              <h1 className="text-[32px] font-semibold leading-10 tracking-tight text-text-primary">
                {UI_MESSAGES.LOGIN_HERO_TITLE_1}
                <br />
                {UI_MESSAGES.LOGIN_HERO_TITLE_2}{' '}
                <span className="text-vivid-700">{UI_MESSAGES.LOGIN_HERO_HIGHLIGHT}</span>
              </h1>
              <p className="max-w-lg text-lg leading-7 text-text-secondary">
                {UI_MESSAGES.LOGIN_HERO_DESCRIPTION}
              </p>
            </div>
          </section>
          <section className="w-full max-w-[440px]">
            <div className="rounded-xl border border-border-default bg-white p-6 shadow-[var(--shadow-card)]">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-text-primary">{UI_MESSAGES.LOGIN_TITLE}</h2>
                <p className="mt-1 text-sm text-text-secondary">{UI_MESSAGES.LOGIN_SUBTITLE}</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FigmaInput
                  label={UI_MESSAGES.LOGIN_EMAIL_LABEL}
                  type="email"
                  placeholder={UI_MESSAGES.LOGIN_EMAIL_PLACEHOLDER}
                  iconSrc={FIGMA_ASSETS.ICON_MAIL}
                  error={errors.email?.message}
                  {...register('email')}
                />
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium text-text-secondary">
                      {UI_MESSAGES.LOGIN_PASSWORD_LABEL}
                    </label>
                    <span className="text-xs font-semibold text-vivid-700">
                      {UI_MESSAGES.LOGIN_FORGOT_PASSWORD}
                    </span>
                  </div>
                  <FigmaInput
                    type={showPassword ? 'text' : 'password'}
                    placeholder={UI_MESSAGES.LOGIN_PASSWORD_PLACEHOLDER}
                    iconSrc={FIGMA_ASSETS.ICON_LOCK}
                    error={errors.password?.message}
                    rightElement={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-xs text-text-muted"
                      >
                        {showPassword ? 'Ocultar' : 'Ver'}
                      </button>
                    }
                    {...register('password')}
                  />
                </div>
                <label className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    className="size-4 rounded border-border-default"
                    {...register('remember')}
                  />
                  <span className="text-sm text-text-secondary">{UI_MESSAGES.LOGIN_REMEMBER}</span>
                </label>
                {apiError && <p className="text-sm text-red-600">{apiError}</p>}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-vivid-700 text-sm font-medium text-white shadow-sm hover:bg-vivid-600 disabled:opacity-50"
                >
                  {isSubmitting ? UI_MESSAGES.LOADING : UI_MESSAGES.LOGIN_SUBMIT}
                </button>
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-default" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-xs uppercase text-text-muted">
                      {UI_MESSAGES.LOGIN_DIVIDER}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="flex h-10 items-center justify-center gap-1 rounded-xl border border-border-default bg-white text-base text-text-primary"
                  >
                    <img src={FIGMA_ASSETS.ICON_GOOGLE} alt="" className="size-4" />
                    {UI_MESSAGES.LOGIN_GOOGLE}
                  </button>
                  <button
                    type="button"
                    className="flex h-10 items-center justify-center rounded-xl border border-border-default bg-white text-base text-text-primary"
                  >
                    {UI_MESSAGES.LOGIN_SSO}
                  </button>
                </div>
                <p className="pt-4 text-center text-sm text-text-secondary">
                  {UI_MESSAGES.LOGIN_NO_ACCOUNT}{' '}
                  <Link to="/register" className="font-semibold text-vivid-700">
                    {UI_MESSAGES.LOGIN_REGISTER_LINK}
                  </Link>
                </p>
              </form>
            </div>
          </section>
        </div>
      </div>
      <AuthFooter variant="full" />
    </div>
  );
}
