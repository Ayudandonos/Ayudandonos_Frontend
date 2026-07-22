import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import { donationsService } from '@/features/donations/services/donations.service';
import {
  contactFoundationSchema,
  type ContactFoundationFormData,
} from '@/features/campaigns/validations/campaigns.validations';
import type { CampaignNeed } from '@/features/campaigns/types/campaigns.types';
import { parseApiError } from '@/utils/api-error';

interface ContactFoundationModalProps {
  foundationName: string;
  campaignId: string;
  needs: CampaignNeed[];
  onClose: () => void;
}

/**
 * Entrada: foundationName, campaignId, needs y callback onClose.
 * Proceso: Crea un compromiso de donacion con mensaje inicial y abre el chat.
 * Salida: Retorna el elemento JSX del modal de contacto para donar.
 */
export function ContactFoundationModal({
  foundationName,
  campaignId,
  needs,
  onClose,
}: ContactFoundationModalProps) {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const availableNeeds = needs.filter(
    (need) => need.quantity - need.fulfilledQuantity > 0,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFoundationFormData>({
    resolver: zodResolver(contactFoundationSchema),
    defaultValues: {
      needId: availableNeeds[0]?.id ?? '',
      quantity: 1,
      message: '',
    },
  });

  /**
   * Entrada: data: need, cantidad y mensaje validados.
   * Proceso: POST /donations con initialMessage y redirige al chat de la donacion.
   * Salida: No retorna valor; navega o muestra error.
   */
  async function onSubmit(data: ContactFoundationFormData) {
    setApiError('');
    try {
      const created = await donationsService.createDonation({
        needId: data.needId,
        quantity: data.quantity,
        notes: data.message,
        initialMessage: data.message,
      });
      onClose();
      navigate(`/my-donations/${created.id}`);
    } catch (error) {
      setApiError(parseApiError(error).message || UI_MESSAGES.CAMPAIGNS_CONTACT_ERROR);
    }
  }

  if (availableNeeds.length === 0) {
    return (
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-foundation-title"
      >
        <div className="w-full max-w-lg space-y-4 rounded-xl border border-border-default bg-white p-6 shadow-xl">
          <h3 id="contact-foundation-title" className="text-lg font-bold text-text-primary">
            {UI_MESSAGES.CAMPAIGNS_CONTACT_TITLE}
          </h3>
          <p className="text-sm text-text-secondary">
            {foundationName}: {UI_MESSAGES.CAMPAIGNS_CONTACT_NO_NEEDS}
          </p>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              {UI_MESSAGES.COMMON_CANCEL}
            </Button>
            <Button type="button" onClick={() => navigate(`/campaigns/${campaignId}`)}>
              {UI_MESSAGES.CAMPAIGNS_BACK}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-foundation-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-border-default bg-white p-6 shadow-xl">
        <h3 id="contact-foundation-title" className="text-lg font-bold text-text-primary">
          {UI_MESSAGES.CAMPAIGNS_CONTACT_TITLE}
        </h3>
        <p className="mt-1 text-sm text-text-secondary">
          {foundationName} — {UI_MESSAGES.CAMPAIGNS_CONTACT_DESC}
        </p>
        <form className="mt-5 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1.5">
            <label className="text-label" htmlFor="contact-need">
              {UI_MESSAGES.DONATIONS_NEED}
            </label>
            <select
              id="contact-need"
              className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base"
              {...register('needId')}
            >
              {availableNeeds.map((need) => (
                <option key={need.id} value={need.id}>
                  {need.name} ({need.quantity - need.fulfilledQuantity} {need.unit})
                </option>
              ))}
            </select>
            {errors.needId?.message && (
              <p className="text-sm text-error-500">{errors.needId.message}</p>
            )}
          </div>
          <Input
            label={UI_MESSAGES.DONATIONS_QUANTITY}
            type="number"
            min={1}
            error={errors.quantity?.message}
            {...register('quantity')}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-label" htmlFor="contact-message">
              {UI_MESSAGES.CAMPAIGNS_CONTACT_MESSAGE}
            </label>
            <textarea
              id="contact-message"
              rows={4}
              className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base text-text-primary focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              placeholder={UI_MESSAGES.CAMPAIGNS_CONTACT_MESSAGE_PLACEHOLDER}
              {...register('message')}
            />
            {errors.message?.message && (
              <p className="text-sm text-error-500">{errors.message.message}</p>
            )}
          </div>
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="secondary" onClick={onClose}>
              {UI_MESSAGES.COMMON_CANCEL}
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {UI_MESSAGES.CAMPAIGNS_CONTACT_SUBMIT}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
