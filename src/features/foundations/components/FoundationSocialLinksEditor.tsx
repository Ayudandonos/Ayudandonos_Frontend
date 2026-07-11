import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import type { SocialNetworkType } from '@/features/foundations/types/foundations.types';
import type { UpdateFoundationFormData } from '@/features/foundations/validations/foundations.validations';

const NETWORK_OPTIONS: { value: SocialNetworkType; label: string }[] = [
  { value: 'FACEBOOK', label: 'Facebook' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'X', label: 'X' },
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'OTHER', label: UI_MESSAGES.FOUNDATIONS_SOCIAL_OTHER },
];

/**
 * Entrada: Debe usarse dentro de FormProvider de react-hook-form con updateFoundationSchema.
 * Proceso: Renderiza lista editable de redes sociales con useFieldArray.
 * Salida: Retorna el elemento JSX del editor de redes sociales.
 */
export function FoundationSocialLinksEditor() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<UpdateFoundationFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'socialLinks',
  });

  return (
    <section className="space-y-4">
      <h3 className="text-subheading">{UI_MESSAGES.FOUNDATIONS_SECTION_SOCIAL}</h3>

      {fields.length === 0 && (
        <p className="text-sm text-text-muted">{UI_MESSAGES.FOUNDATIONS_SOCIAL_EMPTY}</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="grid gap-3 rounded-lg border border-border-default p-4 md:grid-cols-[180px_1fr_auto]">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
                {UI_MESSAGES.FOUNDATIONS_FORM_SOCIAL_NETWORK}
              </label>
              <select
                className="w-full rounded-lg border border-border-default bg-white px-3 py-2 text-sm"
                {...register(`socialLinks.${index}.network`)}
              >
                {NETWORK_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              label={UI_MESSAGES.FOUNDATIONS_FORM_SOCIAL_URL}
              error={errors.socialLinks?.[index]?.url?.message}
              {...register(`socialLinks.${index}.url`)}
            />
            <div className="flex items-end">
              <Button type="button" variant="secondary" size="sm" onClick={() => remove(index)}>
                {UI_MESSAGES.FOUNDATIONS_REMOVE_SOCIAL_LINK}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {fields.length < 10 && (
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ network: 'FACEBOOK', url: '' })}
        >
          {UI_MESSAGES.FOUNDATIONS_ADD_SOCIAL_LINK}
        </Button>
      )}
    </section>
  );
}
