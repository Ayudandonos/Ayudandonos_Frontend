import { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { DeliveryMap } from '@/components/ui/DeliveryMap';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useToast } from '@/context/useToast';
import { LocationCascadingFields } from '@/features/foundations/components/LocationCascadingFields';
import {
  normalizeOptionalUrl,
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
  latitude: UI_MESSAGES.FOUNDATIONS_FORM_LATITUDE,
  longitude: UI_MESSAGES.FOUNDATIONS_FORM_LONGITUDE,
  institutionalEmail: UI_MESSAGES.FOUNDATIONS_FORM_INSTITUTIONAL_EMAIL,
  phone: UI_MESSAGES.FOUNDATIONS_FORM_PHONE,
  website: UI_MESSAGES.FOUNDATIONS_FORM_WEBSITE,
  legalRepresentativeName: UI_MESSAGES.FOUNDATIONS_FORM_LEGAL_REP_NAME,
  legalRepresentativeDocument: UI_MESSAGES.FOUNDATIONS_FORM_LEGAL_REP_DOCUMENT,
  socialLinks: UI_MESSAGES.FOUNDATIONS_SECTION_SOCIAL,
};

/**
 * Entrada: network: codigo de red social.
 * Proceso: Obtiene etiqueta legible para la UI.
 * Salida: Retorna el nombre visible de la red.
 */
function socialNetworkLabel(network: string): string {
  if (network === 'FACEBOOK') return 'Facebook';
  if (network === 'INSTAGRAM') return 'Instagram';
  return network;
}

/**
 * Entrada: formErrors: mapa de errores; socialLinks: valores actuales.
 * Proceso: Recorre errores planos y anidados (incl. redes sociales por indice).
 * Salida: Retorna lista clara de campos a corregir.
 */
function collectInvalidFieldLabels(
  formErrors: FieldErrors<UpdateFoundationFormData>,
  socialLinks: FoundationSocialLink[],
): string[] {
  const items: string[] = [];

  Object.entries(formErrors).forEach(([key, error]) => {
    if (!error) {
      return;
    }

    if (key === 'socialLinks' && typeof error === 'object') {
      const socialErrors = error as Record<string, { url?: { message?: string }; message?: string }>;

      if (typeof socialErrors.message === 'string') {
        items.push(`${FIELD_LABELS.socialLinks}: ${socialErrors.message}`);
      }

      Object.entries(socialErrors).forEach(([index, itemError]) => {
        if (index === 'message' || index === 'root' || index === 'type' || index === 'ref') {
          return;
        }
        if (!itemError || typeof itemError !== 'object') {
          return;
        }

        const network = socialLinks[Number(index)]?.network;
        const label = network
          ? socialNetworkLabel(network)
          : `${FIELD_LABELS.socialLinks} (${Number(index) + 1})`;
        const message =
          itemError.url?.message ||
          itemError.message ||
          UI_MESSAGES.FOUNDATIONS_FORM_SOCIAL_URL_INVALID;

        items.push(`${label}: ${message}`);
      });
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
 * Proceso: Guarda con try/catch; muestra toast y lista clara de campos invalidos.
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

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFoundationFormData>({
    resolver: zodResolver(updateFoundationSchema),
    defaultValues: {
      ...defaultValues,
      socialLinks: defaultValues.socialLinks ?? [],
      latitude: defaultValues.latitude ?? null,
      longitude: defaultValues.longitude ?? null,
    },
    mode: 'onSubmit',
    shouldFocusError: true,
  });

  const socialLinks = watch('socialLinks') ?? [];
  const displayError = apiError || clientError;

  const socialFieldErrors = useMemo(() => {
    const map: Partial<Record<(typeof SOCIAL_NETWORKS)[number], string>> = {};
    const socialErrors = errors.socialLinks;

    if (!socialErrors || typeof socialErrors !== 'object') {
      return map;
    }

    SOCIAL_NETWORKS.forEach((network) => {
      const index = socialLinks.findIndex((link) => link.network === network);
      if (index < 0) {
        return;
      }
      const itemError = (socialErrors as Record<string, { url?: { message?: string } }>)[
        String(index)
      ];
      if (itemError?.url?.message) {
        map[network] = itemError.url.message;
      }
    });

    return map;
  }, [errors.socialLinks, socialLinks]);

  useEffect(() => {
    if (!displayError && validationItems.length === 0) {
      return;
    }
    feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [displayError, validationItems]);

  /**
   * Entrada: network: red social; url: enlace a persistir en el formulario.
   * Proceso: Normaliza URL y actualiza o elimina la entrada vacia.
   * Salida: No retorna valor; modifica socialLinks via setValue.
   */
  const updateSocialUrl = (network: FoundationSocialLink['network'], url: string) => {
    const trimmed = url.trim();
    const current = socialLinks.filter((link) => link.network !== network);
    if (trimmed) {
      current.push({ network, url: trimmed });
    }
    setValue('socialLinks', current, { shouldDirty: true, shouldValidate: false });
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
   * Proceso: Construye lista legible y muestra toast + alerta local.
   * Salida: No retorna valor.
   */
  const handleInvalid = (formErrors: FieldErrors<UpdateFoundationFormData>) => {
    const items = collectInvalidFieldLabels(formErrors, getValues('socialLinks') ?? []);
    setClientError(UI_MESSAGES.FOUNDATIONS_FORM_VALIDATION_ERROR);
    setValidationItems(items);
    pushToast({
      variant: 'danger',
      title: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_ERROR_TITLE,
      message:
        items.length > 0
          ? items.slice(0, 4).join(' · ')
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

    try {
      await onSubmit({
        ...data,
        acronym: data.acronym ?? null,
        website: data.website ? normalizeOptionalUrl(data.website) : null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        socialLinks: (data.socialLinks ?? [])
          .map((link) => ({
            ...link,
            url: normalizeOptionalUrl(link.url),
          }))
          .filter((link) => link.url !== ''),
      });

      const okMessage = successMessage || UI_MESSAGES.FOUNDATIONS_PROFILE_UPDATED;
      pushToast({
        variant: 'success',
        title: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_SUCCESS_TITLE,
        message: okMessage,
      });
    } catch (submitError) {
      const parsed = parseApiError(submitError);
      const message = parsed.message || UI_MESSAGES.FOUNDATIONS_FORM_SAVE_UNEXPECTED;
      const fieldItems = Object.entries(parsed.fieldErrors).map(
        ([field, fieldMessage]) => `${FIELD_LABELS[field] ?? field}: ${fieldMessage}`,
      );
      setClientError(message);
      setValidationItems(fieldItems);
      pushToast({
        variant: 'danger',
        title: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_ERROR_TITLE,
        message: fieldItems.length > 0 ? fieldItems.slice(0, 4).join(' · ') : message,
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

    try {
      await handleSubmit(handleValidSubmit, handleInvalid)(event);
    } catch (unexpectedError) {
      console.error('[FoundationForm] submit failed', unexpectedError, getValues());
      setClientError(UI_MESSAGES.FOUNDATIONS_FORM_SAVE_UNEXPECTED);
      pushToast({
        variant: 'danger',
        title: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_ERROR_TITLE,
        message: UI_MESSAGES.FOUNDATIONS_FORM_SAVE_UNEXPECTED,
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
        <div className="space-y-2">
          <p className="text-sm font-medium text-text-primary">{UI_MESSAGES.FOUNDATIONS_FORM_MAP}</p>
          <p className="text-xs text-text-muted">{UI_MESSAGES.FOUNDATIONS_FORM_MAP_HINT}</p>
          <Controller
            name="latitude"
            control={control}
            render={({ field: latField }) => (
              <Controller
                name="longitude"
                control={control}
                render={({ field: lngField }) => (
                  <DeliveryMap
                    editable
                    latitude={latField.value}
                    longitude={lngField.value}
                    onChange={(latitude, longitude) => {
                      latField.onChange(latitude);
                      lngField.onChange(longitude);
                    }}
                  />
                )}
              />
            )}
          />
          {errors.latitude?.message && (
            <p className="text-sm text-error-500">{errors.latitude.message}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={UI_MESSAGES.FOUNDATIONS_FORM_LATITUDE}
              type="number"
              step="any"
              value={watch('latitude') ?? ''}
              readOnly
              optionalMark
            />
            <Input
              label={UI_MESSAGES.FOUNDATIONS_FORM_LONGITUDE}
              type="number"
              step="any"
              value={watch('longitude') ?? ''}
              readOnly
              optionalMark
            />
          </div>
        </div>
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
        <p className="text-sm text-text-secondary">{UI_MESSAGES.FOUNDATIONS_FORM_SOCIAL_URL_HINT}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {SOCIAL_NETWORKS.map((network) => (
            <Input
              key={network}
              label={socialNetworkLabel(network)}
              placeholder={UI_MESSAGES.FOUNDATIONS_FORM_SOCIAL_URL}
              value={getSocialUrl(network)}
              optionalMark
              error={socialFieldErrors[network]}
              onChange={(event) => updateSocialUrl(network, event.target.value)}
            />
          ))}
        </div>
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
        </div>

        <Button type="submit" isLoading={isSubmitting} fullWidth>
          {UI_MESSAGES.FOUNDATIONS_SAVE_PROFILE}
        </Button>
      </div>
    </form>
  );
}
