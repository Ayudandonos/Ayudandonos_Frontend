import { useEffect, useRef, useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useToast } from '@/context/useToast';
import { LocationCascadingFields } from '@/features/foundations/components/LocationCascadingFields';
import {
  updateFoundationSchema,
  type UpdateFoundationFormData,
} from '@/features/foundations/validations/foundations.validations';
import type { FoundationSocialLink } from '@/features/foundations/types/foundations.types';
import { parseApiError } from '@/utils/api-error';

interface FoundationFormProps {
  defaultValues: UpdateFoundationFormData;
  apiError?: string;
  successMessage?: string;
  onSubmit: (data: UpdateFoundationFormData) => Promise<void>;
}

const SOCIAL_NETWORKS = ['FACEBOOK', 'INSTAGRAM'] as const;

const FIELD_LABELS: Record<string, string> = {
  name: UI_MESSAGES.FOUNDATIONS_FORM_NAME,
  acronym: UI_MESSAGES.FOUNDATIONS_FORM_ACRONYM,
  nit: UI_MESSAGES.FOUNDATIONS_FORM_NIT,
  category: UI_MESSAGES.FOUNDATIONS_FORM_CATEGORY,
  mission: UI_MESSAGES.FOUNDATIONS_FORM_MISSION,
  vision: UI_MESSAGES.FOUNDATIONS_FORM_VISION,
  description: UI_MESSAGES.FOUNDATIONS_FORM_DESCRIPTION,
  country: UI_MESSAGES.FOUNDATIONS_FORM_COUNTRY,
  department: UI_MESSAGES.FOUNDATIONS_FORM_DEPARTMENT,
  city: UI_MESSAGES.FOUNDATIONS_FORM_CITY,
  address: UI_MESSAGES.FOUNDATIONS_FORM_ADDRESS,
  institutionalEmail: UI_MESSAGES.FOUNDATIONS_FORM_INSTITUTIONAL_EMAIL,
  phone: UI_MESSAGES.FOUNDATIONS_FORM_PHONE,
  website: UI_MESSAGES.FOUNDATIONS_FORM_WEBSITE,
  legalRepresentativeName: UI_MESSAGES.FOUNDATIONS_FORM_LEGAL_REP_NAME,
  legalRepresentativeDocument: UI_MESSAGES.FOUNDATIONS_FORM_LEGAL_REP_DOCUMENT,
  socialLinks: UI_MESSAGES.FOUNDATIONS_SECTION_SOCIAL,
};

/**
 * Entrada: formErrors: mapa de errores de react-hook-form.
 * Proceso: Extrae etiquetas legibles de los campos invalidos.
 * Salida: Retorna lista de textos para la alerta de validacion.
 */
function collectInvalidFieldLabels(
  formErrors: FieldErrors<UpdateFoundationFormData>,
): string[] {
  const items: string[] = [];

  Object.keys(formErrors).forEach((key) => {
    const error = formErrors[key as keyof UpdateFoundationFormData];
    if (!error) {
      return;
    }

    const label = FIELD_LABELS[key] ?? key;
    const message =
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : UI_MESSAGES.FOUNDATIONS_FIELD_REQUIRED;

    items.push(`${label}: ${message}`);
  });

  return items;
}

/**
 * Entrada: defaultValues, apiError, successMessage y onSubmit del perfil.
 * Proceso: Guarda con try/catch; muestra toast y alerta junto al boton.
 * Salida: Retorna el elemento JSX del formulario.
 */
export function FoundationForm({
  defaultValues,
  apiError,
  successMessage,
  onSubmit,
}: FoundationFormProps) {
  const { pushToast } = useToast();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [clientError, setClientError] = useState('');
  const [validationItems, setValidationItems] = useState<string[]>([]);
  const [localSuccess, setLocalSuccess] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFoundationFormData>({
    resolver: zodResolver(updateFoundationSchema),
    defaultValues,
    mode: 'onSubmit',
    shouldFocusError: true,
  });

  const socialLinks = watch('socialLinks') ?? [];
  const socialLinksError = errors.socialLinks?.message || errors.socialLinks?.root?.message;
  const displayError = apiError || clientError;
  const displaySuccess = successMessage || localSuccess;

  useEffect(() => {
    if (!displayError && !displaySuccess && validationItems.length === 0) {
      return;
    }
    feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [displayError, displaySuccess, validationItems]);

  useEffect(() => {
    if (apiError) {
      pushToast({
        variant: 'danger',
        title: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_ERROR_TITLE,
        message: apiError,
      });
    }
  }, [apiError, pushToast]);

  useEffect(() => {
    if (successMessage && !localSuccess) {
      pushToast({
        variant: 'success',
        title: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_SUCCESS_TITLE,
        message: successMessage,
      });
    }
  }, [successMessage, localSuccess, pushToast]);

  /**
   * Entrada: network: red social; url: enlace a persistir en el formulario.
   * Proceso: Actualiza o elimina la URL vacia de la red social.
   * Salida: No retorna valor; modifica socialLinks via setValue.
   */
  const updateSocialUrl = (network: FoundationSocialLink['network'], url: string) => {
    const trimmed = url.trim();
    const current = socialLinks.filter((link) => link.network !== network);
    if (trimmed) {
      current.push({ network, url: trimmed });
    }
    setValue('socialLinks', current, { shouldDirty: true, shouldValidate: true });
  };

  /**
   * Entrada: network: red social a consultar.
   * Proceso: Busca la URL registrada para la red social en socialLinks.
   * Salida: Retorna la URL encontrada o cadena vacia.
   */
  const getSocialUrl = (network: FoundationSocialLink['network']) =>
    socialLinks.find((link) => link.network === network)?.url ?? '';

  /**
   * Entrada: formErrors: mapa de errores de react-hook-form.
   * Proceso: Muestra toast + alerta local con lista de campos invalidos.
   * Salida: No retorna valor.
   */
  const handleInvalid = (formErrors: FieldErrors<UpdateFoundationFormData>) => {
    const items = collectInvalidFieldLabels(formErrors);
    setLocalSuccess('');
    setClientError(UI_MESSAGES.FOUNDATIONS_FORM_VALIDATION_ERROR);
    setValidationItems(items);
    pushToast({
      variant: 'danger',
      title: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_ERROR_TITLE,
      message:
        items.length > 0
          ? `${UI_MESSAGES.FOUNDATIONS_FORM_VALIDATION_ERROR} ${items.slice(0, 3).join(' · ')}`
          : UI_MESSAGES.FOUNDATIONS_FORM_VALIDATION_ERROR,
    });
  };

  /**
   * Entrada: data: valores ya validados por Zod.
   * Proceso: Envia al contenedor con try/catch y feedback de exito o error.
   * Salida: No retorna valor.
   */
  const handleValidSubmit = async (data: UpdateFoundationFormData) => {
    setClientError('');
    setValidationItems([]);
    setLocalSuccess('');

    try {
      await onSubmit({
        ...data,
        acronym: data.acronym ?? null,
        website: data.website ?? null,
        socialLinks: (data.socialLinks ?? []).filter((link) => link.url.trim() !== ''),
      });

      const okMessage = successMessage || UI_MESSAGES.FOUNDATIONS_PROFILE_UPDATED;
      setLocalSuccess(okMessage);
      pushToast({
        variant: 'success',
        title: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_SUCCESS_TITLE,
        message: okMessage,
      });
    } catch (submitError) {
      const parsed = parseApiError(submitError);
      const message = parsed.message || UI_MESSAGES.FOUNDATIONS_FORM_SAVE_UNEXPECTED;
      setClientError(message);
      setValidationItems(
        Object.entries(parsed.fieldErrors).map(
          ([field, fieldMessage]) => `${FIELD_LABELS[field] ?? field}: ${fieldMessage}`,
        ),
      );
      pushToast({
        variant: 'danger',
        title: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_ERROR_TITLE,
        message,
      });
    }
  };

  /**
   * Entrada: event: envio nativo del formulario.
   * Proceso: Envuelve el submit de RHF en try/catch por fallos del resolver.
   * Salida: No retorna valor.
   */
  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setClientError('');
    setValidationItems([]);
    setLocalSuccess('');

    try {
      await handleSubmit(handleValidSubmit, handleInvalid)(event);
    } catch (unexpectedError) {
      console.error('[FoundationForm] submit failed', unexpectedError, getValues());
      const message = UI_MESSAGES.FOUNDATIONS_FORM_SAVE_UNEXPECTED;
      setClientError(message);
      pushToast({
        variant: 'danger',
        title: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_ERROR_TITLE,
        message,
      });
    }
  };

  return (
    <form
      id="foundation-profile-form"
      onSubmit={(event) => void onFormSubmit(event)}
      className="space-y-8"
      noValidate
    >
      <Alert variant="info">{UI_MESSAGES.FOUNDATIONS_FORM_REQUIRED_LEGEND}</Alert>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_SECTION_IDENTITY}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_NAME}
            placeholder={UI_MESSAGES.REGISTER_FOUNDATION_NAME_PLACEHOLDER}
            error={errors.name?.message}
            requiredMark
            {...register('name')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_ACRONYM}
            error={errors.acronym?.message}
            optionalMark
            {...register('acronym')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_NIT}
            error={errors.nit?.message}
            requiredMark
            {...register('nit')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_CATEGORY}
            error={errors.category?.message}
            requiredMark
            {...register('category')}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_SECTION_LOCATION}
        </h2>
        <LocationCascadingFields
          watch={watch}
          setValue={setValue}
          register={register}
          errors={errors}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_SECTION_NARRATIVE}
        </h2>
        {(['mission', 'vision', 'description'] as const).map((field) => (
          <div key={field}>
            <label className="mb-2 block text-sm font-medium text-text-primary">
              {field === 'mission'
                ? UI_MESSAGES.FOUNDATIONS_FORM_MISSION
                : field === 'vision'
                  ? UI_MESSAGES.FOUNDATIONS_FORM_VISION
                  : UI_MESSAGES.FOUNDATIONS_FORM_DESCRIPTION}
              <span className="ms-1 text-error-500" aria-label="obligatorio">
                *
              </span>
            </label>
            <textarea
              rows={field === 'description' ? 4 : 3}
              className="w-full rounded-lg border border-border-default bg-white px-4 py-3 text-sm focus:border-vivid-600 focus:outline-none"
              aria-invalid={Boolean(errors[field])}
              {...register(field)}
            />
            {errors[field]?.message && (
              <p className="mt-1 text-sm text-error-500">{errors[field]?.message}</p>
            )}
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_SECTION_CONTACT}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_INSTITUTIONAL_EMAIL}
            error={errors.institutionalEmail?.message}
            requiredMark
            {...register('institutionalEmail')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_PHONE}
            error={errors.phone?.message}
            requiredMark
            {...register('phone')}
          />
          <div className="md:col-span-2">
            <Input
              label={UI_MESSAGES.FOUNDATIONS_FORM_WEBSITE}
              error={errors.website?.message}
              optionalMark
              {...register('website')}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_SECTION_LEGAL}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_LEGAL_REP_NAME}
            error={errors.legalRepresentativeName?.message}
            requiredMark
            {...register('legalRepresentativeName')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_LEGAL_REP_DOCUMENT}
            error={errors.legalRepresentativeDocument?.message}
            requiredMark
            {...register('legalRepresentativeDocument')}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_SECTION_SOCIAL}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {SOCIAL_NETWORKS.map((network) => (
            <Input
              key={network}
              label={network === 'FACEBOOK' ? 'Facebook' : 'Instagram'}
              placeholder={UI_MESSAGES.FOUNDATIONS_FORM_SOCIAL_URL}
              value={getSocialUrl(network)}
              optionalMark
              onChange={(event) => updateSocialUrl(network, event.target.value)}
            />
          ))}
        </div>
        {socialLinksError && <p className="text-sm text-error-500">{socialLinksError}</p>}
      </section>

      <div className="space-y-3">
        <Alert variant="neutral">{UI_MESSAGES.FOUNDATIONS_FORM_SAVE_HINT}</Alert>

        <div ref={feedbackRef} id="foundation-save-feedback" className="space-y-3">
          {displayError && (
            <Alert
              variant="danger"
              title={UI_MESSAGES.FOUNDATIONS_FORM_SAVE_ERROR_TITLE}
              items={validationItems.length > 0 ? validationItems : undefined}
            >
              {validationItems.length === 0 ? displayError : null}
            </Alert>
          )}

          {displaySuccess && (
            <Alert variant="success" title={UI_MESSAGES.FOUNDATIONS_FORM_SAVE_SUCCESS_TITLE}>
              {displaySuccess}
              <span className="mt-2 block text-sm">
                {UI_MESSAGES.FOUNDATIONS_FORM_SAVE_NEXT_DOCS}
              </span>
            </Alert>
          )}
        </div>

        <Button type="submit" isLoading={isSubmitting} fullWidth>
          {UI_MESSAGES.FOUNDATIONS_SAVE_PROFILE}
        </Button>
      </div>
    </form>
  );
}
