import { useForm, Controller } from 'react-hook-form';
import type { ReactNode } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DeliveryMap } from '@/components/ui/DeliveryMap';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { useGeocodeOnLocationChange } from '@/hooks/useGeocodeOnLocationChange';
import {
  campaignFormSchema,
  type CampaignFormData,
} from '@/features/campaigns/validations/campaigns.validations';

interface CampaignFormProps {
  defaultValues?: Partial<CampaignFormData>;
  apiError?: string;
  submitLabel: string;
  isLoading?: boolean;
  children?: ReactNode;
  onSubmit: (data: CampaignFormData) => Promise<void>;
  secondaryAction?: {
    label: string;
    onClick: (data: CampaignFormData) => Promise<void>;
    disabled?: boolean;
  };
}

/**
 * Entrada: defaultValues, labels y callbacks de envio.
 * Proceso: Formulario RHF+Zod de campana con selector de mapa.
 * Salida: Retorna el elemento JSX del formulario.
 */
export function CampaignForm({
  defaultValues,
  apiError,
  submitLabel,
  isLoading = false,
  children,
  onSubmit,
  secondaryAction,
}: CampaignFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      startDate: '',
      endDate: '',
      deliveryAddress: '',
      deliveryLatitude: null,
      deliveryLongitude: null,
      ...defaultValues,
    },
  });

  const deliveryAddress = watch('deliveryAddress');
  const { isGeocoding, geocodeError } = useGeocodeOnLocationChange({
    query: { address: deliveryAddress, country: 'Colombia' },
    onCoords: (latitude, longitude) => {
      setValue('deliveryLatitude', latitude, { shouldDirty: true, shouldValidate: true });
      setValue('deliveryLongitude', longitude, { shouldDirty: true, shouldValidate: true });
    },
  });

  const busy = isSubmitting || isLoading;

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        label={UI_MESSAGES.CAMPAIGNS_FORM_TITLE}
        error={errors.title?.message}
        {...register('title')}
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-label" htmlFor="campaign-description">
          {UI_MESSAGES.CAMPAIGNS_FORM_DESCRIPTION}
        </label>
        <textarea
          id="campaign-description"
          rows={5}
          className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base text-text-primary focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
          {...register('description')}
        />
        {errors.description?.message && (
          <p className="text-sm text-error-500">{errors.description.message}</p>
        )}
      </div>
      <Input
        label={UI_MESSAGES.CAMPAIGNS_FORM_IMAGE_URL}
        type="url"
        error={errors.imageUrl?.message}
        {...register('imageUrl')}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={UI_MESSAGES.CAMPAIGNS_FORM_START_DATE}
          type="datetime-local"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <Input
          label={UI_MESSAGES.CAMPAIGNS_FORM_END_DATE}
          type="datetime-local"
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>
      <Input
        label={UI_MESSAGES.CAMPAIGNS_FORM_ADDRESS}
        error={errors.deliveryAddress?.message}
        hint={UI_MESSAGES.CAMPAIGNS_FORM_ADDRESS_HINT}
        {...register('deliveryAddress')}
      />
      <div className="space-y-2">
        <p className="text-label">{UI_MESSAGES.CAMPAIGNS_FORM_MAP}</p>
        <p className="text-xs text-text-muted">{UI_MESSAGES.CAMPAIGNS_FORM_MAP_HINT}</p>
        {isGeocoding && (
          <p className="text-xs text-text-secondary">{UI_MESSAGES.MAP_GEOCODING}</p>
        )}
        {geocodeError && (
          <p className="text-xs text-amber-800" role="status">
            {geocodeError}
          </p>
        )}
        <Controller
          name="deliveryLatitude"
          control={control}
          render={({ field: latField }) => (
            <Controller
              name="deliveryLongitude"
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
        {errors.deliveryLatitude?.message && (
          <p className="text-sm text-error-500">{errors.deliveryLatitude.message}</p>
        )}
      </div>
      {children}
      {apiError && <Alert variant="danger">{apiError}</Alert>}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {secondaryAction && (
          <Button
            type="button"
            variant="secondary"
            isLoading={busy}
            disabled={secondaryAction.disabled || busy}
            onClick={() => void handleSubmit(secondaryAction.onClick)()}
          >
            {secondaryAction.label}
          </Button>
        )}
        <Button type="submit" isLoading={busy} disabled={busy}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
