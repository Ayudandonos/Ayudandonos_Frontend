import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UI_MESSAGES } from '@/constants/messages.constants';
import {
  contactFoundationSchema,
  type ContactFoundationFormData,
} from '@/features/campaigns/validations/campaigns.validations';

interface ContactFoundationModalProps {
  foundationName: string;
  onClose: () => void;
}

/**
 * Entrada: foundationName y callback onClose.
 * Proceso: Formulario RHF+Zod de contacto; al enviar muestra aviso de endpoint no disponible.
 * Salida: Retorna el elemento JSX del modal.
 */
export function ContactFoundationModal({ foundationName, onClose }: ContactFoundationModalProps) {
  const [infoMessage, setInfoMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFoundationFormData>({
    resolver: zodResolver(contactFoundationSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  /**
   * Entrada: _data: datos validados del formulario (no se envian).
   * Proceso: Informa que el endpoint de contacto no existe en el backend.
   * Salida: No retorna valor; actualiza mensaje informativo.
   */
  async function onSubmit(_data: ContactFoundationFormData) {
    setInfoMessage(UI_MESSAGES.CAMPAIGNS_CONTACT_UNAVAILABLE);
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
          <Input
            label={UI_MESSAGES.CAMPAIGNS_CONTACT_NAME}
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label={UI_MESSAGES.CAMPAIGNS_CONTACT_EMAIL}
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label={UI_MESSAGES.CAMPAIGNS_CONTACT_PHONE}
            error={errors.phone?.message}
            {...register('phone')}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-label" htmlFor="contact-message">
              {UI_MESSAGES.CAMPAIGNS_CONTACT_MESSAGE}
            </label>
            <textarea
              id="contact-message"
              rows={4}
              className="w-full rounded-[var(--radius-sm)] border border-border-default bg-white/60 px-4 py-3 text-base text-text-primary focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-600/20"
              {...register('message')}
            />
            {errors.message?.message && (
              <p className="text-sm text-error-500">{errors.message.message}</p>
            )}
          </div>
          {infoMessage && (
            <p className="rounded-lg bg-vivid-50 px-3 py-2 text-sm text-text-secondary" role="status">
              {infoMessage}
            </p>
          )}
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
