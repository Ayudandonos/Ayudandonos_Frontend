import { z } from 'zod';
import { UI_MESSAGES } from '@/constants/messages.constants';

export const createDonationSchema = z.object({
  needId: z.string().uuid(UI_MESSAGES.DONATIONS_NEED_REQUIRED),
  quantity: z.coerce.number().int().min(1, UI_MESSAGES.DONATIONS_QUANTITY_MIN),
  notes: z
    .string()
    .trim()
    .max(2000, UI_MESSAGES.DONATIONS_NOTES_MAX)
    .optional()
    .or(z.literal('')),
  initialMessage: z
    .string()
    .trim()
    .max(1000, UI_MESSAGES.DONATIONS_INITIAL_MESSAGE_MAX)
    .optional()
    .or(z.literal('')),
  estimatedDeliveryAt: z.string().optional().or(z.literal('')),
});

export type CreateDonationFormData = z.infer<typeof createDonationSchema>;
