import { useState } from 'react';
import { useForm, type FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { LocationCascadingFields } from '@/features/foundations/components/LocationCascadingFields';
import {
  updateFoundationSchema,
  type UpdateFoundationFormData,
} from '@/features/foundations/validations/foundations.validations';
import type { FoundationSocialLink } from '@/features/foundations/types/foundations.types';

interface FoundationFormProps {
  defaultValues: UpdateFoundationFormData;
  apiError?: string;
  successMessage?: string;
  onSubmit: (data: UpdateFoundationFormData) => Promise<void>;
}

const SOCIAL_NETWORKS = ['FACEBOOK', 'INSTAGRAM'] as const;

/**
 * Entrada: defaultValues, apiError, successMessage y onSubmit del perfil.
 * Proceso: Renderiza formulario con validacion visible y guardado explicito.
 * Salida: Retorna el elemento JSX del formulario.
 */
export function FoundationForm({
  defaultValues,
  apiError,
  successMessage,
  onSubmit,
}: FoundationFormProps) {
  const [clientValidationError, setClientValidationError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFoundationFormData>({
    resolver: zodResolver(updateFoundationSchema),
    defaultValues,
    mode: 'onSubmit',
  });

  const socialLinks = watch('socialLinks') ?? [];
  const socialLinksError = errors.socialLinks?.message || errors.socialLinks?.root?.message;

  /**
   * Entrada: network: red social; url: enlace a persistir en el formulario.
   * Proceso: Actualiza o agrega la URL de la red social en el estado del formulario.
   * Salida: No retorna valor; modifica socialLinks via setValue.
   */
  const updateSocialUrl = (network: FoundationSocialLink['network'], url: string) => {
    const current = [...socialLinks];
    const index = current.findIndex((link) => link.network === network);

    if (index >= 0) {
      current[index] = { network, url };
    } else {
      current.push({ network, url });
    }

    setValue('socialLinks', current, { shouldDirty: true });
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
   * Proceso: Muestra alerta global y enfoca el primer campo invalido.
   * Salida: No retorna valor.
   */
  const handleInvalid = (formErrors: FieldErrors<UpdateFoundationFormData>) => {
    setClientValidationError(UI_MESSAGES.FOUNDATIONS_FORM_VALIDATION_ERROR);
    const firstKey = Object.keys(formErrors)[0];
    if (!firstKey) {
      return;
    }
    const element = document.querySelector<HTMLElement>(
      `[name="${firstKey}"], #foundation-profile-form [aria-invalid="true"]`,
    );
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element?.focus?.();
  };

  /**
   * Entrada: data: valores ya validados por Zod.
   * Proceso: Limpia alerta local y delega el guardado al contenedor.
   * Salida: No retorna valor.
   */
  const handleValidSubmit = async (data: UpdateFoundationFormData) => {
    setClientValidationError('');
    await onSubmit({
      ...data,
      acronym: data.acronym ?? null,
      website: data.website ?? null,
      socialLinks: data.socialLinks ?? [],
    });
  };

  return (
    <form
      id="foundation-profile-form"
      onSubmit={handleSubmit(handleValidSubmit, handleInvalid)}
      className="space-y-8"
      noValidate
    >
      {(apiError || clientValidationError) && (
        <Alert variant="danger">{apiError || clientValidationError}</Alert>
      )}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

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
        <Button type="submit" isLoading={isSubmitting} fullWidth>
          {UI_MESSAGES.FOUNDATIONS_SAVE_PROFILE}
        </Button>
      </div>
    </form>
  );
}
