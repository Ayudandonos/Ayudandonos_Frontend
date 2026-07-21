import { z } from 'zod';
import { UI_MESSAGES } from '@/constants/messages.constants';

const optionalUrl = z
  .string()
  .trim()
  .url(UI_MESSAGES.CAMPAIGNS_URL_INVALID)
  .or(z.literal(''))
  .nullable()
  .optional();

const optionalCoords = z.object({
  deliveryLatitude: z.number().min(-90).max(90).nullable().optional(),
  deliveryLongitude: z.number().min(-180).max(180).nullable().optional(),
});

/**
 * Entrada: Ninguna.
 * Proceso: Define schema Zod para crear o editar campanas alineado al backend.
 * Salida: Retorna el schema de formulario de campana.
 */
export const campaignFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, UI_MESSAGES.CAMPAIGNS_TITLE_MIN)
      .max(200, UI_MESSAGES.CAMPAIGNS_TITLE_MAX),
    description: z
      .string()
      .trim()
      .min(10, UI_MESSAGES.CAMPAIGNS_DESCRIPTION_MIN)
      .max(5000, UI_MESSAGES.CAMPAIGNS_DESCRIPTION_MAX),
    imageUrl: optionalUrl,
    startDate: z.string().optional().or(z.literal('')),
    endDate: z.string().optional().or(z.literal('')),
    deliveryAddress: z
      .string()
      .trim()
      .min(5, UI_MESSAGES.CAMPAIGNS_ADDRESS_MIN)
      .or(z.literal(''))
      .optional(),
    deliveryLatitude: z.number().min(-90).max(90).nullable().optional(),
    deliveryLongitude: z.number().min(-180).max(180).nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: UI_MESSAGES.CAMPAIGNS_END_BEFORE_START,
        path: ['endDate'],
      });
    }

    const hasLat = data.deliveryLatitude !== undefined && data.deliveryLatitude !== null;
    const hasLng = data.deliveryLongitude !== undefined && data.deliveryLongitude !== null;
    if (hasLat !== hasLng) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: UI_MESSAGES.CAMPAIGNS_COORDS_INCOMPLETE,
        path: ['deliveryLatitude'],
      });
    }
  });

export type CampaignFormData = z.infer<typeof campaignFormSchema>;

export const contactFoundationSchema = z.object({
  name: z.string().trim().min(2, UI_MESSAGES.CAMPAIGNS_CONTACT_NAME_MIN),
  email: z.string().trim().email(UI_MESSAGES.AUTH_EMAIL_INVALID),
  phone: z.string().trim().min(7, UI_MESSAGES.CAMPAIGNS_CONTACT_PHONE_MIN).optional().or(z.literal('')),
  message: z
    .string()
    .trim()
    .min(10, UI_MESSAGES.CAMPAIGNS_CONTACT_MESSAGE_MIN)
    .max(2000, UI_MESSAGES.CAMPAIGNS_CONTACT_MESSAGE_MAX),
});

export type ContactFoundationFormData = z.infer<typeof contactFoundationSchema>;

export const campaignNeedFormSchema = z.object({
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

export type CampaignNeedFormData = z.infer<typeof campaignNeedFormSchema>;

export { optionalCoords };
