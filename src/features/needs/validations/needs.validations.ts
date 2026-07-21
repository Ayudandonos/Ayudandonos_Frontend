import { z } from 'zod';
import { UI_MESSAGES } from '@/constants/messages.constants';

export const needFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, UI_MESSAGES.NEEDS_NAME_MIN)
    .max(200, UI_MESSAGES.NEEDS_NAME_MAX),
  description: z
    .string()
    .trim()
    .max(2000, UI_MESSAGES.NEEDS_DESCRIPTION_MAX)
    .optional()
    .or(z.literal('')),
  quantity: z.coerce.number().int().min(1, UI_MESSAGES.NEEDS_QUANTITY_MIN),
  unit: z
    .string()
    .trim()
    .min(1, UI_MESSAGES.NEEDS_UNIT_MIN)
    .max(50, UI_MESSAGES.NEEDS_UNIT_MAX),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

export type NeedFormData = z.infer<typeof needFormSchema>;
