import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import {
  updateFoundationSchema,
  type UpdateFoundationFormData,
} from '@/features/foundations/validations/foundations.validations';
import type { FoundationSocialLink } from '@/features/foundations/types/foundations.types';

interface FoundationFormProps {
  defaultValues: UpdateFoundationFormData;
  apiError?: string;
  onSubmit: (data: UpdateFoundationFormData) => Promise<void>;
}

const SOCIAL_NETWORKS = ['FACEBOOK', 'INSTAGRAM'] as const;

/**
 * Entrada: defaultValues: datos iniciales; apiError: mensaje global; onSubmit: handler async.
 * Proceso: Renderiza formulario completo de perfil de fundacion con validacion Zod.
 * Salida: Retorna el elemento JSX del formulario.
 */
export function FoundationForm({ defaultValues, apiError, onSubmit }: FoundationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UpdateFoundationFormData>({
    resolver: zodResolver(updateFoundationSchema),
    defaultValues,
  });

  const socialLinks = watch('socialLinks') ?? [];

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {apiError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {apiError}
        </p>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_SECTION_IDENTITY}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_NAME}
            placeholder={UI_MESSAGES.REGISTER_FOUNDATION_NAME_PLACEHOLDER}
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_ACRONYM}
            error={errors.acronym?.message}
            {...register('acronym')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_NIT}
            error={errors.nit?.message}
            {...register('nit')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_CATEGORY}
            error={errors.category?.message}
            {...register('category')}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {UI_MESSAGES.FOUNDATIONS_SECTION_LOCATION}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_CITY}
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_DEPARTMENT}
            error={errors.department?.message}
            {...register('department')}
          />
          <div className="md:col-span-2">
            <Input
              label={UI_MESSAGES.FOUNDATIONS_FORM_ADDRESS}
              error={errors.address?.message}
              {...register('address')}
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
            </label>
            <textarea
              rows={field === 'description' ? 4 : 3}
              className="w-full rounded-lg border border-border-default bg-white px-4 py-3 text-sm focus:border-vivid-600 focus:outline-none"
              {...register(field)}
            />
            {errors[field]?.message && (
              <p className="mt-1 text-sm text-red-600">{errors[field]?.message}</p>
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
            {...register('institutionalEmail')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_PHONE}
            error={errors.phone?.message}
            {...register('phone')}
          />
          <div className="md:col-span-2">
            <Input
              label={UI_MESSAGES.FOUNDATIONS_FORM_WEBSITE}
              error={errors.website?.message}
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
            {...register('legalRepresentativeName')}
          />
          <Input
            label={UI_MESSAGES.FOUNDATIONS_FORM_LEGAL_REP_DOCUMENT}
            error={errors.legalRepresentativeDocument?.message}
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
              onChange={(event) => updateSocialUrl(network, event.target.value)}
            />
          ))}
        </div>
      </section>

      <Button type="submit" isLoading={isSubmitting} fullWidth>
        {UI_MESSAGES.FOUNDATIONS_SAVE_PROFILE}
      </Button>
    </form>
  );
}
