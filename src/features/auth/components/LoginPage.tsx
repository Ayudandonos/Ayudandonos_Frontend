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
import { BrandIllustrationBackground } from '@/components/ui/BrandIllustrationBackground';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useAuth } from '@/context/useAuth';
import { useToast } from '@/context/useToast';
import { parseApiError } from '@/utils/api-error';
import { canFoundationOperate } from '@/utils/foundation-access';
import { cn } from '@/utils/cn';
import {
  forgotPasswordSchema,
  loginSchema,
  type ForgotPasswordFormData,
  type LoginFormData,
} from '@/features/auth/validations/auth.validations';

/**
 * Entrada: Ninguna.
 * Proceso: Renderiza login con fondo ilustrado y card reversible para recuperar contraseña.
 * Salida: Retorna el elemento JSX de la pagina de login.
 */
export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { pushToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { remember: true },
  });

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  /**
   * Entrada: Ninguna.
   * Proceso: Gira la card al formulario de recuperacion y precarga el correo del login.
   * Salida: No retorna valor.
   */
  const openForgotPassword = () => {
    forgotForm.reset({ email: getValues('email') || '' });
    setShowForgotPassword(true);
  };

  /**
   * Entrada: Ninguna.
   * Proceso: Regresa la card al formulario de inicio de sesion.
   * Salida: No retorna valor.
   */
  const closeForgotPassword = () => {
    setShowForgotPassword(false);
  };

  /**
   * Entrada: data: credenciales validadas del formulario de login.
   * Proceso: Autentica al usuario y redirige segun su rol en la aplicacion.
   * Salida: No retorna valor; navega a la ruta correspondiente o muestra error.
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      const { user, foundation } = await login(data.email, data.password, data.remember ?? true);
      const redirect =
        user.role === 'ADMIN'
          ? '/admin/reports'
          : user.role === 'FOUNDATION'
            ? canFoundationOperate(foundation)
              ? '/foundation/requests'
              : '/foundation/profile'
            : '/campaigns';
      navigate(redirect, { replace: true });
    } catch (error) {
      const parsed = parseApiError(error);
      let message = parsed.message || UI_MESSAGES.AUTH_GENERIC_ERROR;
      if (parsed.status === 401) {
        message = parsed.message || UI_MESSAGES.AUTH_INVALID_CREDENTIALS;
      } else if (parsed.status === 403) {
        message = parsed.message || UI_MESSAGES.AUTH_ACCOUNT_DISABLED;
      } else {
        Object.entries(parsed.fieldErrors).forEach(([field, fieldMessage]) => {
          setError(field as keyof LoginFormData, { message: fieldMessage });
        });
      }
      pushToast({ variant: 'danger', message });
    }
  };

  /**
   * Entrada: _data: correo validado del formulario de recuperacion.
   * Proceso: Informa por toast que la recuperacion no esta disponible ahora.
   * Salida: No retorna valor.
   */
  const onForgotSubmit = async (_data: ForgotPasswordFormData) => {
    pushToast({
      variant: 'warning',
      message: UI_MESSAGES.LOGIN_FORGOT_UNAVAILABLE,
    });
  };

  return (
    <div className="relative flex min-h-screen flex-col">
      <BrandIllustrationBackground />
      <AuthHeader variant="login" />
      <div className="relative flex flex-1 animate-fade-in items-center px-6 py-16 lg:px-10">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <section className="w-full max-w-xl space-y-5 text-center lg:text-left">
            <p className="animate-scale-in text-4xl font-bold tracking-tight text-primary-700 sm:text-5xl lg:text-6xl">
              {UI_MESSAGES.APP_NAME}
            </p>
            <div className="animate-slide-in space-y-3 [animation-delay:80ms]">
              <h1 className="text-display text-text-primary">
                {UI_MESSAGES.LOGIN_HERO_TITLE_1}
                <br />
                <span className="text-primary-700">{UI_MESSAGES.LOGIN_HERO_HIGHLIGHT}</span>
              </h1>
              <p className="mx-auto max-w-md text-body text-text-primary/90 lg:mx-0">
                {UI_MESSAGES.LOGIN_HERO_DESCRIPTION}
              </p>
            </div>
          </section>

          <section className="animate-slide-in w-full max-w-[440px] [animation-delay:160ms] [perspective:1200px]">
            <div
              className={cn(
                'relative w-full transition-transform duration-500 [transform-style:preserve-3d]',
                showForgotPassword && '[transform:rotateY(180deg)]',
              )}
            >
              <div className="[backface-visibility:hidden]">
                <Card padding="md" hover={false}>
                  <div className="mb-6">
                    <h2 className="text-heading text-text-primary">{UI_MESSAGES.LOGIN_TITLE}</h2>
                    <p className="mt-1 text-sm text-text-primary/80">{UI_MESSAGES.LOGIN_SUBTITLE}</p>
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
                        <button
                          type="button"
                          onClick={openForgotPassword}
                          className="text-xs font-semibold text-primary-700 transition-smooth hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                          aria-label={UI_MESSAGES.LOGIN_FORGOT_PASSWORD_ARIA}
                        >
                          {UI_MESSAGES.LOGIN_FORGOT_PASSWORD}
                        </button>
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
                      <span className="text-sm text-text-primary/80">{UI_MESSAGES.LOGIN_REMEMBER}</span>
                    </label>
                    <AuthSubmitButton
                      isLoading={isSubmitting}
                      label={UI_MESSAGES.LOGIN_SUBMIT}
                      variant="login"
                    />
                    <p className="pt-2 text-center text-sm text-text-primary/85">
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
              </div>

              <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <Card padding="lg" hover={false} className="flex h-full flex-col">
                  <div className="space-y-3">
                    <h2 className="text-heading text-text-primary">{UI_MESSAGES.LOGIN_FORGOT_TITLE}</h2>
                    <p className="text-sm leading-relaxed text-text-primary/85">
                      {UI_MESSAGES.LOGIN_FORGOT_SUBTITLE}
                    </p>
                  </div>
                  <form
                    onSubmit={forgotForm.handleSubmit(onForgotSubmit)}
                    className="mt-8 flex flex-1 flex-col gap-6"
                    noValidate
                  >
                    <Input
                      label={UI_MESSAGES.LOGIN_EMAIL_LABEL}
                      type="email"
                      autoComplete="email"
                      placeholder={UI_MESSAGES.LOGIN_EMAIL_PLACEHOLDER}
                      iconLeft="envelope"
                      error={forgotForm.formState.errors.email?.message}
                      {...forgotForm.register('email')}
                    />
                    <div className="mt-auto flex flex-col gap-3 pt-4">
                      <AuthSubmitButton
                        isLoading={forgotForm.formState.isSubmitting}
                        label={UI_MESSAGES.LOGIN_FORGOT_SUBMIT}
                        variant="login"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        fullWidth
                        onClick={closeForgotPassword}
                      >
                        {UI_MESSAGES.LOGIN_FORGOT_BACK}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            </div>
          </section>
        </div>
      </div>
      <AuthFooter variant="full" translucent />
    </div>
  );
}
